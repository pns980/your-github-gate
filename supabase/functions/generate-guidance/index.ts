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

You will receive a user scenario and a list of rules. Return concise actionable guidance and identify which rules from the provided list are most relevant, explaining how each applies to this specific scenario. Only choose rules from the provided list and use their titles exactly as given.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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

    const userMessage = `SCENARIO:\n${scenario}\n\nAVAILABLE RULES:\n${rulesText}\n\nProvide guidance for this scenario and identify which of the rules above apply.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: SYSTEM_PROMPT,
        input: [{ role: "user", content: userMessage }],
        stream: true,
        store: false,
        reasoning: { effort: "low", summary: "auto" },
        include: ["reasoning.encrypted_content"],
        text: {
          format: {
            type: "json_schema",
            name: "guidance",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["reply", "rules_used"],
              properties: {
                reply: { type: "string", description: "Actionable guidance for the scenario." },
                rules_used: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["title", "reason"],
                    properties: {
                      title: { type: "string", description: "Exact title of a rule from the provided list." },
                      reason: { type: "string", description: "How this rule applies to the scenario." },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    });

    if (!aiRes.ok || !aiRes.body) {
      const errText = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, errText);
      const msg = aiRes.status === 429
        ? "Too many requests right now, please try again in a moment."
        : aiRes.status === 402
        ? "AI credits have run out. Please top up in Settings > Plans & credits."
        : `AI service error (${aiRes.status})`;
      return new Response(
        JSON.stringify({ success: false, error: msg }),
        { status: aiRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Read the SSE stream and collect the output text
    const reader = aiRes.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let text = "";
    let finalText = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 1);
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload);
          if (evt.type === "response.output_text.delta") text += evt.delta ?? "";
          else if (evt.type === "response.output_text.done") finalText = evt.text ?? finalText;
          else if (evt.type === "response.failed" || evt.type === "error") {
            console.error("AI stream error:", payload);
            throw new Error("AI service failed to generate guidance");
          }
        } catch (err) {
          if (err instanceof Error && err.message.startsWith("AI service")) throw err;
        }
      }
    }

    const raw = finalText || text;
    if (!raw) throw new Error("Model did not return guidance");
    const { reply, rules_used } = JSON.parse(raw) as { reply: string; rules_used: Array<{ title: string; reason: string }> };

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
