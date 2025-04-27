import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';

interface ExportReportButtonProps {
  projectId: string;
}

export function ExportReportButton({ projectId }: ExportReportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'json') => {
    console.log(`Starting export in ${format} format for project ${projectId}`);
    setIsExporting(true);
    
    try {
      const supabase = createClient();
      
      // Get all vulnerabilities for this project with related data
      const { data: vulnerabilities, error } = await supabase
        .from('vulnerabilities')
        .select(`
          *,
          scans (
            id,
            scan_type,
            branch,
            commit_hash,
            created_at
          )
        `)
        .eq('project_id', projectId)
        .order('severity', { ascending: false });

      if (error) {
        throw new Error('Failed to fetch vulnerabilities: ' + error.message);
      }

      if (!vulnerabilities || vulnerabilities.length === 0) {
        toast.warning('No vulnerabilities found for this project');
        setIsExporting(false);
        return;
      }

      // Get project info
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('project_name, repository_url')
        .eq('id', projectId)
        .single();

      if (projectError) {
        throw new Error('Failed to fetch project info: ' + projectError.message);
      }

      // Format the data for export
      const reportData = vulnerabilities.map(vuln => {
        return {
          title: vuln.title || 'Untitled',
          severity: vuln.severity || 'unknown',
          status: vuln.status || 'unknown',
          file_path: vuln.file_path || 'N/A',
          line_location: vuln.line_start ? `${vuln.line_start}-${vuln.line_end || vuln.line_start}` : 'N/A',
          description: vuln.description || '',
          remediation: vuln.remediation || '',
          found_in: vuln.scans?.scan_type || 'Unknown',
          branch: vuln.scans?.branch || 'Unknown',
          commit: vuln.scans?.commit_hash || 'Unknown',
          date_found: vuln.created_at ? formatDate(vuln.created_at) : 'Unknown',
          resolution_status: vuln.status === 'resolved' ? 'Resolved' : 'Open',
          resolution_note: vuln.resolution_note || '',
          resolved_at: vuln.resolved_at ? formatDate(vuln.resolved_at) : '',
        };
      });

      // Add metadata
      const metadata = {
        project_name: project.project_name,
        repository_url: project.repository_url,
        export_date: formatDate(new Date().toISOString()),
        total_vulnerabilities: vulnerabilities.length,
        open_vulnerabilities: vulnerabilities.filter(v => v.status === 'open').length,
        resolved_vulnerabilities: vulnerabilities.filter(v => v.status === 'resolved').length,
      };
      
      if (format === 'json') {
        const jsonData = {
          metadata,
          vulnerabilities: reportData
        };
        
        downloadFile(
          JSON.stringify(jsonData, null, 2),
          `vulnerability-report-${projectId}.json`,
          'application/json'
        );
      } else {
        // CSV format
        const csvHeader = Object.keys(reportData[0] || {}).join(',');
        const csvRows = reportData.map(obj => 
          Object.values(obj)
            .map(value => `"${String(value).replace(/"/g, '""')}"`)
            .join(',')
        );
        
        const csvContent = [csvHeader, ...csvRows].join('\n');
        
        // Add metadata as comments at the top
        const metadataComments = Object.entries(metadata)
          .map(([key, value]) => `# ${key}: ${value}`)
          .join('\n');
        
        const fullCsvContent = `${metadataComments}\n\n${csvContent}`;
        
        downloadFile(
          fullCsvContent,
          `vulnerability-report-${projectId}.csv`,
          'text/csv'
        );
      }
      
      toast.success(`Vulnerability report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error(`Failed to export vulnerability report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Helper function to download a file
  function downloadFile(content: string, filename: string, contentType: string) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    
    // Trigger download
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Helper function to format dates
  function formatDate(dateString: string): string {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
