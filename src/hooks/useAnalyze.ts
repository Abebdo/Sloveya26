import { useState } from 'react';
import type { AnalysisResult, AnalyzeCompanyRequest } from '../lib/types';
import { 
  analyzeMessageAPI, analyzeMessageMock,
  analyzeUrlAPI, analyzeUrlMock,
  analyzeFileAPI, analyzeFileMock,
  analyzeCompanyAPI, analyzeCompanyMock
} from '../lib/analyzer-service';

export const useAnalyze = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to run analysis with fallback
  const runAnalysis = async <T>(
    apiCall: (data: T) => Promise<AnalysisResult>,
    mockCall: (data: T) => Promise<AnalysisResult>,
    data: T
  ) => {
    setIsLoading(true);
    setError(null);
    setResult(null); // Clear previous result
    
    try {
      try {
        // Try API first
        const res = await apiCall(data);
        setResult(res);
      } catch (apiError) {
        console.warn("API Analysis failed or unavailable. Falling back to Local Neural Simulation.", apiError);
        // Fallback to mock
        const res = await mockCall(data);
        setResult(res);
      }
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeMessage = (message: string) => runAnalysis(analyzeMessageAPI, analyzeMessageMock, message);
  const analyzeUrl = (url: string) => runAnalysis(analyzeUrlAPI, analyzeUrlMock, url);
  const analyzeFile = (file: File) => runAnalysis(analyzeFileAPI, analyzeFileMock, file);
  const analyzeCompany = (data: AnalyzeCompanyRequest) => runAnalysis(analyzeCompanyAPI, analyzeCompanyMock, data);

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { 
    analyzeMessage, 
    analyzeUrl, 
    analyzeFile, 
    analyzeCompany, 
    isLoading, 
    result, 
    error, 
    reset 
  };
};
