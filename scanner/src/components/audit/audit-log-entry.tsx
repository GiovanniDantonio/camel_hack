/**
 * Component for rendering a single audit log entry with appropriate styling based on log level
 */
import React from 'react';
import { AuditLogEntry as AuditLogEntryType } from '@/types/audit-log';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  InfoIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from 'lucide-react';

interface AuditLogEntryProps {
  entry: AuditLogEntryType;
}

/**
 * Renders a single audit log entry with styled icon and formatting based on log level
 * @param entry The audit log entry to display
 * @returns A styled audit log entry component
 */
export function AuditLogEntry({ entry }: AuditLogEntryProps) {
  // Determine the appropriate icon based on log level
  const LogIcon = React.useMemo(() => {
    switch (entry.level) {
      case 'info':
        return InfoIcon;
      case 'warning':
        return AlertTriangleIcon;
      case 'error':
        return AlertCircleIcon;
      case 'success':
        return CheckCircleIcon;
      default:
        return InfoIcon;
    }
  }, [entry.level]);

  // Calculate colors and styles based on log level
  const levelStyles = React.useMemo(() => {
    switch (entry.level) {
      case 'info':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-950 dark:text-blue-300';
      case 'warning':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-950 dark:text-amber-300';
      case 'error':
        return 'text-red-500 bg-red-50 dark:bg-red-950 dark:text-red-300';
      case 'success':
        return 'text-green-500 bg-green-50 dark:bg-green-950 dark:text-green-300';
      default:
        return 'text-slate-500 bg-slate-50 dark:bg-slate-800 dark:text-slate-300';
    }
  }, [entry.level]);

  // Format the timestamp for display
  const formattedTime = React.useMemo(() => {
    try {
      return formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  }, [entry.timestamp]);

  return (
    <div className="flex items-start p-2 border-b border-slate-200 dark:border-slate-700">
      <div className={cn('p-1.5 rounded-full mr-3', levelStyles)}>
        <LogIcon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="font-medium text-sm text-slate-800 dark:text-slate-200">
            {entry.message}
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 whitespace-nowrap">
            {formattedTime}
          </span>
        </div>
        {entry.details && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {entry.details}
          </p>
        )}
      </div>
    </div>
  );
}
