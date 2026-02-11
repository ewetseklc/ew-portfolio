import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { claim_text } = await req.json();
    if (!claim_text) {
      return new Response(JSON.stringify({ error: "claim_text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an actuarial claims triage AI. Given a claim description, analyze it and return a JSON response using the suggest_triage tool. Consider:
- Severity of damage/loss described
- Number of affected areas/items
- Complexity of the claim
- Historical patterns for similar claims
- Potential for escalation

Severity scale: 1-3 (Low), 4-6 (Medium), 7-10 (High/Critical)
Reserve amounts should reflect realistic actuarial estimates in USD.`,
          },
          { role: "user", content: claim_text },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_triage",
              description: "Return the actuarial triage result for the claim",
              parameters: {
                type: "object",
                properties: {
                  severity_score: { type: "number", description: "Severity score from 1-10" },
                  reserve_amount: { type: "number", description: "Suggested reserve amount in USD" },
                  risk_category: { type: "string", description: "Risk category (e.g., Property Damage, Bodily Injury, Liability)" },
                  reasoning: { type: "string", description: "Brief actuarial reasoning for the assessment" },
                },
                required: ["severity_score", "reserve_amount", "risk_category", "reasoning"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_triage" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("claims-triage error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
