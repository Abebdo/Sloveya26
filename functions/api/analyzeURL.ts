import { Env, createResponse, corsHeaders } from './utils';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { url } = await request.json() as { url: string };

    if (!url) {
      return createResponse({ success: false, error: "URL required" }, 400);
    }

    const systemPrompt = `
    You are Solveya, an expert in Phishing & URL Forensics.
    Analyze this URL: "${url}"
    
    Detect:
    - Typosquatting (e.g. g0ogle.com)
    - Suspicious TLDs (.xyz, .top)
    - Subdomain hiding (e.g. paypal.com-secure.login.net)
    - Cloaking services (bit.ly, tinyurl)
    
    Simulate the results of a deep scan.
    Output STRICTLY VALID JSON:
    {
      "riskScore": number (0-100),
      "riskLevel": "SAFE" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
      "scamType": string,
      "summary": string,
      "redFlags": string[],
      "action": string,
      "details": {
         "finalUrl": "${url}",
         "redirectChain": ["${url}"], 
         "domainAge": "Unknown (AI Estimate based on risk)",
         "sslStatus": "Valid / Invalid / Missing",
         "hostCountry": "Unknown",
         "isShortener": boolean
      }
    }
    `;

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this URL: ${url}` }
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
