/**
 * Container component for displaying a list of audit logs with loading state and progress
 */
import React, { useState, useEffect } from 'react';
import { AuditLogEntry as AuditLogEntryComponent } from './audit-log-entry';
import { AuditLogEntry, AuditLogState } from '@/types/audit-log';
import { Button } from '@/components/ui/button';
import { generateMockScanLogs } from '@/lib/mock/audit-logs';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Terminal } from 'lucide-react';

interface AuditLogContainerProps {
  scanId?: string;
  projectId?: string;
  className?: string;
  onRunScan?: () => Promise<void>;
  isScanning?: boolean;
  logs?: AuditLogEntry[];
  progress?: number;
}

/**
 * Container for displaying a list of audit logs with loading state and progress bar
 * @param scanId The ID of the scan associated with these logs
 * @param projectId The ID of the project being scanned
 * @param className Optional additional CSS classes
 * @param onRunScan Optional callback to run a scan
 * @param isScanning Optional boolean indicating if a scan is in progress
 * @param logs Optional array of audit log entries to display
 * @param progress Optional progress value (0-100)
 * @returns A component displaying audit logs with loading state
 */
export function AuditLogContainer({
  scanId = '',
  projectId = '',
  className = '',
  onRunScan,
  isScanning = false,
  logs = [],
  progress = 0,
}: AuditLogContainerProps) {
  // State for audit logs, loading state, and progress
  const [auditState, setAuditState] = useState<AuditLogState>({
    logs: [],
    isLoading: false,
    progress: 0,
  });

  // Update audit state when logs or progress change
  useEffect(() => {
    if (logs.length > 0 || progress > 0) {
      setAuditState({
        logs,
        isLoading: isScanning,
        progress,
      });
    }
  }, [logs, progress, isScanning]);

  // Reference to scroll container to auto-scroll to bottom
  const logsEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs appear
  useEffect(() => {
    if (logsEndRef.current && auditState.logs.length > 0) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [auditState.logs.length]);

  /**
   * Simulates running a scan with progressively appearing log entries
   */
  const runMockScan = () => {
    // Reset the audit state
    setAuditState({
      logs: [],
      isLoading: true,
      progress: 0,
    });

    // Generate all the mock logs upfront
    const allLogs = generateMockScanLogs(scanId, projectId);
    const totalLogs = allLogs.length;

    // Show logs incrementally with a delay
    const addLogsWithDelay = (index: number) => {
      if (index >= totalLogs) {
        // Scan complete
        setAuditState((prev) => ({
          ...prev,
          isLoading: false,
          progress: 100,
        }));
        return;
      }

      const progress = Math.round((index / (totalLogs - 1)) * 100);

      // Add the next log
      setAuditState((prev) => ({
        ...prev,
        logs: [...prev.logs, allLogs[index]],
        progress,
      }));

      // Schedule the next log
      const delay = index === 0 ? 500 : Math.random() * 1000 + 500; // Random delay between 0.5 and 1.5 seconds
      setTimeout(() => addLogsWithDelay(index + 1), delay);
    };

    // Start the sequence
    addLogsWithDelay(0);
  };

  return (
    <div
      className={`flex flex-col h-full border rounded-md shadow-sm ${className}`}
    >
      <div className="p-3 border-b bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
        <h3 className="font-medium">Audit Logs</h3>
        <Button
          size="sm"
          onClick={onRunScan || runMockScan}
          disabled={isScanning || auditState.isLoading}
          className="font-mono bg-[#007aff] hover:bg-[#0062cc] text-white border-none"
        >
          {isScanning || auditState.isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Terminal className="h-4 w-4 mr-2" />$ run scan
            </>
          )}
        </Button>
      </div>

      {/* Progress bar for scan */}
      {(isScanning || auditState.isLoading) && (
        <div className="p-2 bg-slate-100 dark:bg-slate-800">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>Scan in progress</span>
            <span>{auditState.progress}%</span>
          </div>
          <Progress value={auditState.progress} className="h-2" />
        </div>
      )}

      {/* Logs container with scrolling */}
      <div className="flex-1 overflow-y-auto p-1 bg-white dark:bg-slate-900">
        {auditState.logs.length === 0 && !auditState.isLoading ? (
          <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-600">
            <p>No logs to display. Run a scan to see logs.</p>
          </div>
        ) : (
          <>
            {auditState.logs.map((log) => (
              <AuditLogEntryComponent key={log.id} entry={log} />
            ))}
            <div ref={logsEndRef} />
          </>
        )}
      </div>
    </div>
  );
}
