import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbw6qXXzzJj-5ulyAqOBxL33j8CyUc9CiVxl3sD15ItgbHRhF-z5FLFxsY7Ue8b1Gd2t/exec";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const text = (val: unknown) =>
  typeof val === "string" ? val.trim() : val == null ? "" : String(val).trim();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: userData, error: userError } = await admin.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (userError || !userData?.user) return json({ error: "Unauthorized" }, 401);

    const { data: roleRow, error: roleError } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (roleError) {
      console.error("role lookup failed:", roleError.message);
      return json({ error: "Authorization check failed" }, 500);
    }
    if (!roleRow) return json({ error: "Forbidden" }, 403);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    let payload: unknown;
    try {
      const res = await fetch(`${SHEETS_ENDPOINT}?_=${Date.now()}`, {
        redirect: "follow",
        signal: controller.signal,
      });
      if (!res.ok) {
        console.error("sheets endpoint error:", res.status);
        return json({ error: "Failed to fetch rules from the source sheet" }, 502);
      }
      const raw = await res.text();
      try {
        payload = JSON.parse(raw);
      } catch {
        // Tolerate a JSONP-wrapped body: callback(...) — parsed as data, never executed.
        const match = raw.match(/^[^(]*\(([\s\S]*)\)\s*;?\s*$/);
        if (!match) {
          console.error("sheets endpoint returned non-JSON body");
          return json({ error: "Source sheet returned an unexpected format" }, 502);
        }
        payload = JSON.parse(match[1]);
      }
    } finally {
      clearTimeout(timer);
    }

    const rows: any[] = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as any)?.data)
        ? (payload as any).data
        : [];

    const rules = rows
      .filter((r) => r && typeof r === "object")
      .map((r: any) => {
        const areaValue = text(r.area ?? r.Area ?? r.AREA);
        return {
          title: text(r.title ?? r.Title ?? r.TITLE).slice(0, 500),
          description: text(
            r.description ?? r.fullDescription ?? r.FullDescription ??
              r.FULLDESCRIPTION ?? r.Description ?? r.DESCRIPTION,
          ).slice(0, 10000),
          area: areaValue
            ? areaValue.split(/[;,]/).map((a: string) => a.trim()).filter(Boolean).slice(0, 20)
            : null,
          discipline: text(r.discipline ?? r.Discipline ?? r.DISCIPLINE).slice(0, 200) || null,
          skill: text(r.skill ?? r.Skill ?? r.SKILL).slice(0, 200) || null,
        };
      })
      .filter((rule) => rule.title && rule.description)
      .slice(0, 2000);

    if (rules.length === 0) return json({ error: "No valid rules found in the source sheet" }, 422);

    const { error: insertError } = await admin.from("rules").insert(rules);
    if (insertError) {
      console.error("insert failed:", insertError.message);
      return json({ error: "Failed to save imported rules" }, 500);
    }

    return json({ success: true, imported: rules.length });
  } catch (e) {
    console.error("import-google-sheets-rules error:", e);
    return json({ error: "Import failed" }, 500);
  }
});
