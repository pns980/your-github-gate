import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const BodySchema = z.object({
  scenario: z.string().trim().min(1).max(4000),
});

const SYSTEM_PROMPT = `You provide thoughtful guidance based on a curated set of life/work rules. Follow these principles:
- Encourage independent thinking and personal responsibility
- Show genuine empathy and respect for diverse perspectives
- Maintain clear, professional, and constructive communication
- Be pragmatic and realistic
- Promote mindfulness and emotional self-awareness
- Support personal growth and development
- Value fairness, objectivity, and ethical considerations
- Focus on long-term, constructive outcomes

You will receive a user scenario and a list of rules. Use the provide_guidance tool to return concise actionable guidance and identify which rules from the provided list are most relevant, explaining how each applies to this specific scenario. Only choose rules from the provided list and use their titles exactly as given.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const { scenario } = parsed.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: rules, error: rulesError } = await supabase
      .from("rules")
      .select("title, description, area, discipline, skill");
    if (rulesError) throw new Error(`Failed to load rules: ${rulesError.message}`);

    const rulesText = (rules ?? [])
      .map((r: any, i: number) => {
        const meta = [
          r.discipline ? `discipline: ${r.discipline}` : null,
          r.skill ? `skill: ${r.skill}` : null,
          Array.isArray(r.area) && r.area.length ? `area: ${r.area.join(", ")}` : null,
        ]
          .filter(Boolean)
          .join(" | ");
        return `${i + 1}. ${r.title}\n   ${r.description}${meta ? `\n   (${meta})` : ""}`;
      })
      .join("\n\n");

    const userMessage = `SCENARIO:\n${scenario}\n\nAVAILABLE RULES:\n${rulesText}\n\nProvide guidance for this scenario and identify which of the rules above apply, using the provide_guidance tool.`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        tools: [
          {
            name: "provide_guidance",
            description: "Return guidance text and the list of relevant rules from the provided set.",
            input_schema: {
              type: "object",
              properties: {
                reply: { type: "string", description: "Actionable guidance for the scenario." },
                rules_used: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "Exact title of a rule from the provided list." },
                      reason: { type: "string", description: "How this rule applies to the scenario." },
                    },
                    required: ["title", "reason"],
                  },
                },
              },
              required: ["reply", "rules_used"],
            },
          },
        ],
        tool_choice: { type: "tool", name: "provide_guidance" },
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error("Anthropic API error:", anthropicRes.status, errText);
      return new Response(
        JSON.stringify({ success: false, error: `Anthropic API error (${anthropicRes.status})` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await anthropicRes.json();
    const toolUse = (data.content ?? []).find((b: any) => b.type === "tool_use");
    if (!toolUse?.input) {
      console.error("No tool_use in Anthropic response:", JSON.stringify(data));
      throw new Error("Model did not return structured guidance");
    }

    const { reply, rules_used } = toolUse.input as { reply: string; rules_used: Array<{ title: string; reason: string }> };

    return new Response(
      JSON.stringify({ success: true, reply, rules_used }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("generate-guidance error:", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
