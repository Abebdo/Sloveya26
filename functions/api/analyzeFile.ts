import { Env, createResponse, corsHeaders } from './utils';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { fileName, fileSize, fileType } = await request.json() as { fileName: string, fileSize: number, fileType: string };

    const systemPrompt = `
    You are Solveya, a Malware Analysis Expert.
    Analyze this file metadata for potential threats.
    
    File Name: "${fileName}"
    File Size: ${fileSize} bytes
    File Type: "${fileType}"
    
    Detect:
    - Double extensions (e.g. .pdf.exe)
    - Masquerading (e.g. huge size for a text file, or tiny size for an installer)
    - Suspicious extensions (.scr, .vbs, .bat)
    - Common malware naming patterns (e.g. "invoice_urgent", "crack", "keygen")
    
    Output STRICTLY VALID JSON:
    {
      "riskScore": number (0-100),
      "riskLevel": "SAFE" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
      "scamType": string,
      "summary": string,
      "redFlags": string[],
      "action": string,
      "details": {
         "suspiciousPermissions": [],
         "embeddedUrls": [], 
         "isExecutable": boolean
      }
    }
    `;

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Analyze this file." }
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
