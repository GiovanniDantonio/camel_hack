/**
 * Generates mock audit log data for development and testing purposes
 */
import { v4 as uuidv4 } from 'uuid';
import { AuditLogEntry, AuditLogLevel } from '@/types/audit-log';

/**
 * Creates a single mock audit log entry with the specified parameters
 * @param level The severity level of the log entry
 * @param message The message text to display
 * @param source The source of the log entry (system, user, or scan)
 * @param contextId Optional ID to associate with the log (scanId, projectId, etc.)
 * @param details Optional additional details about the log entry
 * @returns A mock audit log entry
 */
export function createMockLogEntry(
  level: AuditLogLevel,
  message: string,
  source: 'system' | 'user' | 'scan',
  contextId?: string,
  details?: string
): AuditLogEntry {
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    level,
    message,
    source,
    contextId,
    details,
  };
}

/**
 * Predefined mock scan phases that will be used to generate sequential log entries
 */
const scanPhases = [
  { level: 'info', message: 'Initializing security scan' },
  { level: 'info', message: 'Loading project configuration' },
  { level: 'info', message: 'Starting dependency analysis' },
  { level: 'info', message: 'Checking for vulnerable dependencies' },
  { level: 'warning', message: 'Found potentially outdated packages' },
  { level: 'info', message: 'Analyzing code patterns' },
  { level: 'info', message: 'Running static code analysis' },
  { level: 'warning', message: 'Detected potential SQL injection risk' },
  { level: 'error', message: 'Found critical XSS vulnerability' },
  { level: 'info', message: 'Checking authentication mechanisms' },
  { level: 'info', message: 'Validating access controls' },
  { level: 'info', message: 'Analyzing data encryption' },
  { level: 'info', message: 'Generating vulnerability report' },
  { level: 'success', message: 'Scan completed successfully' },
];

/**
 * Generates a sequence of mock audit logs for a scan process
 * @param scanId The ID of the scan to associate with the logs
 * @param projectId The ID of the project being scanned
 * @returns An array of mock audit log entries
 */
export function generateMockScanLogs(scanId: string, projectId: string): AuditLogEntry[] {
  return scanPhases.map(phase => createMockLogEntry(
    phase.level as AuditLogLevel,
    phase.message,
    'scan',
    scanId,
    `Project: ${projectId}`
  ));
}
