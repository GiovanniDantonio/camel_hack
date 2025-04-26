export interface ScanHistory {
  id: string;
  timestamp: string;
  type: 'full' | 'incremental' | 'targeted';
  status: 'pending' | 'running' | 'completed' | 'failed';
  vulnerabilitiesFound: number;
  riskScore: number;
  duration: string;
  logs?: string[];
}
