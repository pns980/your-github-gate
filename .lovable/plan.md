# Replace Google Apps Script with native Claude-powered guidance

Replace the external Google Apps Script call in `ScenarioHelper` with a new Supabase edge function that:
1. Fetches all rules directly from the `rules` table in the database
2. Calls Anthropic's Claude Sonnet API with the same system context + scenario + rules
3. Returns guidance text + the list of rules applied (title + reason) in the exact shape the frontend already expects

User-facing behavior, input, output, rating flow, and UI stay identical.

## What you'll need to provide

- An **Anthropic API key** (from https://console.anthropic.com/settings/keys). I'll request it as a secure backend secret before deploying — never exposed to the frontend.

## Implementation steps

### 1. Add `ANTHROPIC_API_KEY` secret
Use the secrets tool to securely collect your Anthropic key.

### 2. Create edge function `supabase/functions/generate-guidance/index.ts`
- Public function (no auth required — matches today's anonymous flow).
- Accepts `{ scenario: string }`.
- Validates input with Zod (length 1–4000 chars).
- Uses the service-role Supabase client to `SELECT title, description, area, discipline, skill FROM rules`.
- Builds the system prompt with the 8 guiding principles you provided.
- Builds the user prompt: scenario + serialized rule list (title + description).
- Calls Anthropic `POST https://api.anthropic.com/v1/messages` with model `claude-sonnet-4-5-20250929`.
- Uses **tool calling** to force structured JSON output (a `provide_guidance` tool with schema `{ reply: string, rules_used: [{title, reason}] }`) so we never have to parse loose JSON.
- Returns `{ success: true, reply, rules_used }` matching today's shape.
- Returns proper CORS headers and 4xx/5xx errors with messages.

### 3. Update `src/pages/ScenarioHelper.tsx`
- Replace the `fetch(googleScriptUrl)` block and all the JSONP/raw_response fallback parsing with a single `supabase.functions.invoke('generate-guidance', { body: { scenario } })` call.
- Keep the existing sanitization (10k char cap, tag stripping, 200 char title cap).
- Keep the `guidance_records` insert and the like/dislike rating flow exactly as-is.
- Keep all UI, loading states, perfec™ bullets, and random scenario generator unchanged.

### 4. Configuration
- No `supabase/config.toml` change needed — default `verify_jwt = false` is correct for this public endpoint.
- Edge function deploys automatically.

## Technical details

**System prompt** (sent to Claude):
> You provide thoughtful guidance based on a curated set of life/work rules. Follow these principles:
> - Encourage independent thinking and personal responsibility
> - Show genuine empathy and respect for diverse perspectives
> - Maintain clear, professional, and constructive communication
> - Be pragmatic and realistic
> - Promote mindfulness and emotional self-awareness
> - Support personal growth and development
> - Value fairness, objectivity, and ethical considerations
> - Focus on long-term, constructive outcomes
>
> You will receive a user scenario and a list of rules. Use the `provide_guidance` tool to return concise actionable guidance and identify which rules from the provided list are most relevant, explaining how each applies to this specific scenario.

**Tool schema** (forces structured output):
```json
{
  "name": "provide_guidance",
  "input_schema": {
    "type": "object",
    "properties": {
      "reply": { "type": "string" },
      "rules_used": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "reason": { "type": "string" }
          },
          "required": ["title", "reason"]
        }
      }
    },
    "required": ["reply", "rules_used"]
  }
}
```

**Rule payload size**: All rules will be sent on every call (per your choice). At today's count this is well within Claude Sonnet's 200k context window.

**Removed**: The Google Apps Script URL and all JSONP/raw_response parsing fallbacks. The integration memory note about that script will become obsolete.

## What stays the same
- The page UI, loading state, random scenario button, perfec™ bullets
- The `guidance_records` table writes (scenario, guidance, applied_rules)
- The Like / Not Liked rating flow
- The "click an applied rule to browse it" navigation
- All sanitization defenses