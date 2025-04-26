export interface LLMProvider {
  analyzeCode(code: string, context?: string): Promise<LLMAnalysisResult>;
}

export interface LLMAnalysisResult {
  vulnerabilities: Array<{
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    location: string;
    remediation: string;
    cve?: string;
  }>;
  riskScore: number;
} 