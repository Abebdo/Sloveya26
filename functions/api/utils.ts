export interface Env {
  AI: any;
}

export interface AnalysisResult {
  riskScore: number;
  riskLevel: "SAFE" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  scamType: string;
  summary: string;
  redFlags: string[];
  action: string;
  safeRewrite?: string; // Optional for non-message types
  highlightIndices?: Array<{ phrase: string; type: "DANGER" | "WARNING"; explanation: string }>;
  details?: any; // For URL/File/Company specific details
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function createResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}
