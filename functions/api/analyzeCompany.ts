import { Env, createResponse, corsHeaders } from './utils';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { name, website, email } = await request.json() as { name: string, website: string, email: string };

    const systemPrompt = `
    You are Solveya, a Corporate Intelligence & Fraud Analyst.
    Analyze the legitimacy of this company/entity.
    
    Entity Name: "${name}"
    Website: "${website}"
    Email: "${email}"
    
    Checks:
    - Domain consistency (does email domain match website?)
    - Free email provider detection (gmail, hotmail for a "company")
    - Known scam entity patterns
    - Website URL risk (typosquatting)
    
    Output STRICTLY VALID JSON:
    {
      "riskScore": number (0-100),
      "riskLevel": "SAFE" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
      "scamType": string,
      "summary": string,
      "redFlags": string[],
      "action": string,
      "details": {
         "trustScore": number (0-100),
         "officialWebsite": "${website}",
         "realContactEmail": "Unknown",
         "domainAge": "Unknown"
      }
    }
    `;

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Analyze this company." }
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
