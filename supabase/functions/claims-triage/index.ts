import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
            content: `You are an Actuarial Claims Specialist. Analyze the user's damage description and return a triage assessment using the suggest_triage tool.

Assign a Severity Score from 1-10 based on:
- Severity of damage/loss described
- Number of affected areas/items
- Complexity of the claim
- Potential for escalation

Calculate the Initial Case Reserve using this formula: 500 * (severity_score ^ 2.2).
Round the reserve to the nearest dollar.

Provide a 2-sentence actuarial justification explaining the severity assignment and reserve rationale.`,
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
                  reserve_amount: { type: "number", description: "Initial case reserve in USD calculated as 500 * (severity_score ^ 2.2)" },
                  risk_category: { type: "string", description: "Risk category (e.g., Property Damage, Bodily Injury, Liability)" },
                  reasoning: { type: "string", description: "2-sentence actuarial justification" },
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
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
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

    // Enforce the formula server-side as a safeguard
    const score = Math.max(1, Math.min(10, Math.round(result.severity_score)));
    const calculatedReserve = Math.round(500 * Math.pow(score, 2.2));

    return new Response(JSON.stringify({
      severity_score: score,
      reserve_amount: calculatedReserve,
      risk_category: result.risk_category,
      reasoning: result.reasoning,
    }), {
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
