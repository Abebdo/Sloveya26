import type { AnalysisResult, AnalyzeCompanyRequest } from './types';

// ============================================================================
// API CLIENTS
// ============================================================================

export async function analyzeMessageAPI(message: string): Promise<AnalysisResult> {
  return await makeRequest('/api/analyzeMessage', { message });
}

export async function analyzeUrlAPI(url: string): Promise<AnalysisResult> {
  return await makeRequest('/api/analyzeURL', { url });
}

export async function analyzeCompanyAPI(data: AnalyzeCompanyRequest): Promise<AnalysisResult> {
  return await makeRequest('/api/analyzeCompany', data);
}

export async function analyzeFileAPI(file: File): Promise<AnalysisResult> {
  const metadata = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    lastModified: file.lastModified
  };
  return await makeRequest('/api/analyzeFile', metadata);
}

async function makeRequest(endpoint: string, body: any): Promise<AnalysisResult> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request to ${endpoint} failed`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Analysis failed');
  }

  return data.data;
}

// ============================================================================
// MOCK ENGINES (Fallback / Demo)
// ============================================================================

const MOCK_DELAY = 1500;

export async function analyzeMessageMock(message: string): Promise<AnalysisResult> {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  const lowerMsg = message.toLowerCase();
  
  let score = 10;
  let riskLevel: AnalysisResult['riskLevel'] = 'SAFE';
  let scamType = 'None';
  let redFlags: string[] = [];
  let highlights: NonNullable<AnalysisResult['highlightIndices']> = [];

  if (lowerMsg.includes('urgent') || lowerMsg.includes('act now')) {
    score += 40;
    redFlags.push('High urgency language detected');
    highlights.push({ phrase: 'urgent', type: 'DANGER', explanation: 'Scammers use urgency.' });
  }

  if (lowerMsg.includes('click link') || lowerMsg.includes('http')) {
    score += 30;
    redFlags.push('Suspicious link request');
    highlights.push({ phrase: 'click link', type: 'WARNING', explanation: 'Never click unknown links.' });
  }

  if (score > 80) riskLevel = 'CRITICAL';
  else if (score > 60) riskLevel = 'HIGH';
  else if (score > 40) riskLevel = 'MODERATE';
  else if (score > 20) riskLevel = 'LOW';

  if (score > 40) scamType = 'Phishing/Social Engineering';

  return {
    riskScore: score,
    riskLevel,
    scamType,
    summary: score > 40 ? "Message shows signs of social engineering." : "Message appears safe.",
    redFlags,
    action: score > 40 ? "Do not reply. Block sender." : "No action needed.",
    highlightIndices: highlights
  };
}

export async function analyzeUrlMock(url: string): Promise<AnalysisResult> {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  const isSuspicious = url.includes('bit.ly') || url.includes('ngrok') || url.length > 50;
  
  return {
    riskScore: isSuspicious ? 85 : 5,
    riskLevel: isSuspicious ? 'CRITICAL' : 'SAFE',
    scamType: isSuspicious ? 'Malicious URL' : 'None',
    summary: isSuspicious 
      ? "This URL uses a URL shortener often associated with masking malicious destinations."
      : "Domain reputation checks out. SSL certificate is valid.",
    redFlags: isSuspicious ? ['Hidden destination', 'Low reputation TLD'] : [],
    action: isSuspicious ? "Do not visit this link." : "Safe to visit.",
    details: {
      redirectChain: isSuspicious ? [url, "http://malicious-site.com/login"] : [url],
      domainAge: isSuspicious ? "2 days" : "5 years"
    }
  };
}

export async function analyzeCompanyMock(data: AnalyzeCompanyRequest): Promise<AnalysisResult> {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

  const isFake = data.companyName.toLowerCase().includes('inc') && !data.website; 
  
  return {
    riskScore: isFake ? 75 : 10,
    riskLevel: isFake ? 'HIGH' : 'SAFE',
    scamType: isFake ? 'Impersonation' : 'None',
    summary: isFake 
      ? "We could not find verified business registration data for this entity." 
      : "Company appears legitimate with verified registration.",
    redFlags: isFake ? ['No physical address found', 'Domain registered recently'] : [],
    action: isFake ? "Do not transfer funds or sign contracts." : "Proceed with standard due diligence.",
    details: {
      registrationDate: isFake ? "N/A" : "2010-05-12",
      jurisdiction: isFake ? "Unknown" : "Delaware, USA"
    }
  };
}

export async function analyzeFileMock(file: File): Promise<AnalysisResult> {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  const isMalware = file.name.endsWith('.exe') || file.name.endsWith('.scr');
  
  return {
    riskScore: isMalware ? 95 : 5,
    riskLevel: isMalware ? 'CRITICAL' : 'SAFE',
    scamType: isMalware ? 'Malware' : 'None',
    summary: isMalware 
      ? "File signature matches known trojan patterns." 
      : "File metadata appears clean. No malicious scripts detected.",
    redFlags: isMalware ? ['Executable extension', 'Suspicious entropy'] : [],
    action: isMalware ? "Delete immediately. Do not run." : "Safe to open.",
    details: {
      fileType: file.type,
      fileSize: file.size,
      hashes: { md5: "mock-hash-123" }
    }
  };
}
