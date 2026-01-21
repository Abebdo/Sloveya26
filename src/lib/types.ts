export interface AnalysisResult {
  riskScore: number;
  riskLevel: "SAFE" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  scamType: string;
  summary: string;
  redFlags: string[];
  action: string;
  safeRewrite?: string;
  highlightIndices?: Array<{
    phrase: string;
    type: "DANGER" | "WARNING";
    explanation: string;
  }>;
  details?: any; // For URL/File/Company specific details (e.g. WHOIS data, redirects, malware metadata)
}

export interface AnalyzeMessageRequest {
  message: string;
}

export interface AnalyzeURLRequest {
  url: string;
}

export interface AnalyzeCompanyRequest {
  companyName: string;
  website?: string;
  email?: string;
}

export interface AnalyzeFileRequest {
  fileName: string;
  fileSize: number;
  fileType: string;
  contentBase64?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}
