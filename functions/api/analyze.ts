interface Env {
  AI: any;
}

interface AnalysisResult {
  riskScore: number;
  riskLevel: "SAFE" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  scamType: string;
  summary: string;
  redFlags: string[];
  action: string;
  safeRewrite: string;
  highlightIndices: Array<{
    phrase: string;
    type: "DANGER" | "WARNING";
    explanation: string;
  }>;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { message } = await request.json() as { message: string };

    if (!message || message.length < 5) {
      return new Response(JSON.stringify({ success: false, error: "Message too short" }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }

    const systemPrompt = `
    You are Solveya, an advanced AI Cyber-Security Expert.
    Your task is to analyze the following message for scam patterns, fraud, social engineering, and security threats.
    
    Analyze the message deeply. Look for:
    - Urgency, pressure, or threats.
    - Financial requests (crypto, gift cards, wire transfer).
    - Impersonation (banks, government, family).
    - Malicious links or phishing tactics.
    - Grammar errors typical of scams.
    - Emotional manipulation.

    Output STRICTLY VALID JSON matching this schema:
    {
      "riskScore": number (0-100),
      "riskLevel": "SAFE" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
      "scamType": string (e.g., "Phishing", "Investment Scam", "None", "Romance Scam"),
      "summary": string (2 sentences max),
      "redFlags": string[] (list of 3-5 key warning signs found),
      "action": string (recommended action for user),
      "safeRewrite": string (rewrite the message to remove threats/scams, or if it is safe, keep it similar but polished. If it is a blatant scam, provide a satirical 'honest' version or just a neutralized summary),
      "highlightIndices": [
        { "phrase": "exact substring from text", "type": "DANGER" | "WARNING", "explanation": "why this part is bad" }
      ]
    }
    
    If the message is completely safe, score it 0-10 and set riskLevel to SAFE.
    Do NOT output markdown code blocks. Just the raw JSON string.
    `;

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    // Attempt to parse the response to ensure it's valid JSON. 
    // Sometimes models wrap in \`\`\`json ... \`\`\`. We need to clean it.
    let rawOutput = "";
    if (typeof response === 'string') {
        rawOutput = response;
    } else if (response.response) {
        rawOutput = response.response;
    } else {
        rawOutput = JSON.stringify(response);
    }

    // Clean markdown
    rawOutput = rawOutput.replace(/```json/g, "").replace(/```/g, "").trim();

    let analysis: AnalysisResult;
    try {
      analysis = JSON.parse(rawOutput);
    } catch (e) {
      console.error("Failed to parse JSON", rawOutput);
      return new Response(JSON.stringify({ success: false, error: "AI Analysis Failed to generate valid report." }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data: analysis }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}
