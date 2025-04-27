/**
 * Defines the structure for audit log entries in the application
 * These logs track actions during security scans and other operations
 */
export type AuditLogLevel = 'info' | 'warning' | 'error' | 'success';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  level: AuditLogLevel;
  message: string;
  details?: string;
  source: 'system' | 'user' | 'scan';
  contextId?: string; // Could be scanId, projectId, etc.
}

export interface AuditLogState {
  logs: AuditLogEntry[];
  isLoading: boolean;
  progress: number; // 0-100 percentage
}
