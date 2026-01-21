import { Env, createResponse, corsHeaders } from './utils';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { message } = await request.json() as { message: string };

    if (!message || message.length < 5) {
      return createResponse({ success: false, error: "Message too short" }, 400);
    }

    const systemPrompt = `
    You are Solveya, an advanced AI Fintech Security Expert.
    Analyze the following message for financial fraud, social engineering, and security threats.
    
    Look for:
    - Urgency cues (e.g. "act now", "suspended").
    - Manipulation indicators (emotional blackmail, authority bias).
    - Legitimacy (does it sound professional or fake?).
    
    Output STRICTLY VALID JSON:
    {
      "riskScore": number (0-100),
      "riskLevel": "SAFE" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
      "scamType": string,
      "summary": string,
      "redFlags": string[],
      "action": string,
      "safeRewrite": string (Neutralized/Honest version),
      "highlightIndices": [
        { "phrase": "substring", "type": "DANGER" | "WARNING", "explanation": "why" }
      ],
      "details": {
         "manipulationIndicators": string[],
         "urgencyCues": string[],
         "legitimacyAssessment": "Likely Fake" | "Suspicious" | "Likely Real"
      }
    }
    `;

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    let rawOutput = typeof response === 'string' ? response : (response.response || JSON.stringify(response));
    rawOutput = rawOutput.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const analysis = JSON.parse(rawOutput);
      return createResponse({ success: true, data: analysis });
    } catch (e) {
      return createResponse({ success: false, error: "AI Parsing Failed" }, 500);
    }

  } catch (error) {
    return createResponse({ success: false, error: "Internal Server Error" }, 500);
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders });
};
