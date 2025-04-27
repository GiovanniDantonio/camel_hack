import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { Database } from '@/types/database.types';

// NOTE: Only the parts of the Database type that we actually use are important here.
// We alias it so that consumers of this component do not need to import the entire type file.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Tables } from '@/types/database.types';

type VulnerabilityRow = Database['public']['Tables']['vulnerabilities']['Row'];

type SimpleAttackComponentProps = {
  vulnerability: VulnerabilityRow;
  queryLimit?: number;
  gitUrl?: string;
  /**
   * Optional styling props so that the caller can maintain the look-and-feel of the old AttackComponent.
   */
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
};

type LogEntry = {
  id: string;
  event: string | null;
  message: string;
};

/**
 * A **very** lightweight replacement for the original `AttackComponent`.
 *
 * It no longer relies on Supabase nor on any backend orchestration. Instead, it:
 *   1. Builds the JSON payload expected by the new attacker service (see docs/SCAN_ARCHITECTURE.md).
 *   2. Sends the payload directly to `http://192.168.128.15:5005/test`.
 *   3. Listens to the Server-Sent-Events (SSE) stream returned by that service and
 *      renders the events in a tiny "terminal"-like UI so that the user can
 *      follow the attack progress live.
 */
export function SimpleAttackComponent({
  vulnerability,
  queryLimit = 2,
  gitUrl = 'git@example.com:repo/repo.git',
  variant = 'default',
  size = 'default',
  className = '',
}: SimpleAttackComponentProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [completed, setCompleted] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleRunAttack = async () => {
    if (isRunning) return;

    // Build the JSON payload. The structure is copied from the spec provided by the user.
    const payload = {
      query_limit: queryLimit,
      git_url: gitUrl,
      run_command: 'python3 attack/demo_non_protected/main.py',
      scan_report: {
        scan_metadata: {
          // We fall back to reasonable defaults if specific fields are missing.
          scan_id: vulnerability.scan_id || `vuln-scan-${vulnerability.id}`,
          timestamp: new Date().toISOString(),
          source_details: vulnerability.file_path || 'unknown',
        },
        vulnerabilities: [
          {
            id: vulnerability.id,
            // Many fields may not exist on the typed `vulnerability` object yet.
            // We cast to `any` to avoid TypeScript errors until the DB schema is updated.
            cwe_id: (vulnerability as any).cwe_id ?? undefined,
            description: vulnerability.description || '',
            file_path: vulnerability.file_path || 'unknown',
            line_number: vulnerability.line_start ?? undefined,
            endpoint: (vulnerability as any).endpoint ?? undefined,
            method: (vulnerability as any).http_method ?? undefined,
            parameters: (vulnerability as any).parameters ?? [],
            potential_exploit_type: (vulnerability as any).exploit_type ?? undefined,
            target_url_base: (vulnerability as any).target_url_base ?? undefined,
          },
        ],
      },
    } as const;

    console.log("Attack payload:", payload);

    setIsRunning(true);
    setCompleted(false);
    setLogs([]);

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch('http://192.168.128.15:5005/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status} – Unable to start attack`);
      }

      // Parse the SSE stream manually (minimal parser).
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Each SSE event is separated by *two* new lines (\n\n) as per spec.
        let eventBoundary = buffer.indexOf('\n\n');
        while (eventBoundary !== -1) {
          const rawEvent = buffer.slice(0, eventBoundary).trim();
          buffer = buffer.slice(eventBoundary + 2);
          eventBoundary = buffer.indexOf('\n\n');

          if (rawEvent) handleRawSseEvent(rawEvent);
        }
      }

      // Flush any remaining buffered data after the stream ends.
      if (buffer.trim()) {
        handleRawSseEvent(buffer.trim());
      }

      setCompleted(true);
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        pushLog('canceled', 'Attack canceled by user.');
      } else {
        pushLog('error', `Error: ${(err as Error).message}`);
      }
    } finally {
      setIsRunning(false);
      abortRef.current = null;
    }
  };

  const handleCancel = () => {
    if (!isRunning || !abortRef.current) return;
    abortRef.current.abort();
  };

  const handleRawSseEvent = (raw: string) => {
    // SSE format is multiple "field: value" lines. We only care about `event:` and `data:`.
    let eventName: string | null = null;
    let dataPayload: string | null = null;

    raw.split('\n').forEach((line) => {
      if (line.startsWith('event:')) {
        eventName = line.replace('event:', '').trim();
      } else if (line.startsWith('data:')) {
        // Everything after the first "data:" is considered payload. We trim just in case.
        dataPayload = line.replace('data:', '').trim();
      }
    });

    if (dataPayload === null) return; // ignore malformed messages

    try {
      const parsed = JSON.parse(dataPayload);
      pushLog(eventName, JSON.stringify(parsed));
    } catch (_) {
      pushLog(eventName, dataPayload);
    }
  };

  const pushLog = (eventName: string | null, message: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        event: eventName,
        message,
      },
    ]);
  };

  // --- Auto-scroll log viewer to bottom when new messages arrive ---
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Memoise computed UI booleans for clarity.
  const canRun = !isRunning && !completed;
  const canCancel = isRunning;

  return (
    <div className="space-y-4">
      {/* --- Action buttons --- */}
      {canRun && (
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={handleRunAttack}
          disabled={isRunning}
        >
          Run Attack
        </Button>
      )}

      {/* Cyber security themed loading bar and message */}
      {isRunning && logs.length === 0 && (
        <div className="w-full flex flex-col items-center py-6">
          <div className="w-3/4 h-4 bg-gray-800 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-600 to-purple-700 animate-pulse" style={{ width: '100%' }} />
          </div>
          <div className="text-cyan-300 font-mono text-sm mt-2">
            Launching Exploit: <span className="text-purple-300">Engaging Attack Vector…</span>
          </div>
        </div>
      )}

      {canCancel && (
        <Button
          variant="destructive"
          size={size}
          className={className}
          onClick={handleCancel}
        >
          Cancel Attack
        </Button>
      )}

      {/* --- Log viewer --- */}
      {(isRunning && logs.length > 0) || completed ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Attack Logs</CardTitle>
            <CardDescription>
              {completed ? 'Completed' : 'Running…'} – {logs.length} event
              {logs.length === 1 ? '' : 's'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full">
              <div
                ref={logContainerRef}
                className="font-mono text-xs p-2 bg-black text-green-400 space-y-1"
              >
                {logs.map((log) => (
                  <div key={log.id}>
                    <span className="text-gray-500 mr-2">
                      {new Date(parseInt(log.id.split('-')[0], 10)).toLocaleTimeString()}
                    </span>
                    <span className="text-yellow-400">[{log.event || 'message'}]</span>{' '}
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
