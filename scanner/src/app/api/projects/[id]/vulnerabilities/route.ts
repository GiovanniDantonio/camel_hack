import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Define types to match Supabase schema
interface MockScan {
  id: string;
  project_id: string;
  scan_type: string;
  status: string;
  created_at: string;
  started_at: string;
  completed_at: string;
  branch: string;
  commit_hash: string;
  files_selected: number;
  vulnerabilities_found: number;
  is_mock: boolean;
}

interface MockVulnerability {
  id: string;
  project_id: string;
  scan_id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file_path: string;
  line_start: number;
  line_end: number;
  code_snippet: string;
  recommendation: string;
  status: 'open' | 'in_progress' | 'resolved' | 'false_positive';
  created_at: string;
  updated_at: string;
  is_mock: boolean;
  scan: {
    id: string;
    scan_type: string;
    status: string;
    created_at: string;
    completed_at: string;
    branch: string;
    commit_hash: string;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await params to avoid Next.js dynamic API warning
    const { id: projectId } = await params;

    console.log(`Fetching all vulnerabilities for project ${projectId}`);

    // In a real implementation, we would query Supabase for all vulnerabilities
    // associated with scans belonging to this project.
    
    // Generate mock data that conforms to the schema
    const mockScanIds = [
      `mock_${uuidv4().substring(0, 8)}`,
      `mock_${uuidv4().substring(0, 8)}`,
      `mock_${uuidv4().substring(0, 8)}`
    ];
    
    // Mock scan data for context
    const mockScans: MockScan[] = mockScanIds.map((id, index) => ({
      id,
      project_id: projectId,
      scan_type: ['full', 'quick', 'dependency'][index % 3],
      status: ['completed', 'completed', 'completed'][index % 3],
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * (index + 1)).toISOString(),
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * (index + 1)).toISOString(),
      completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * index).toISOString(),
      branch: ['main', 'feature/auth', 'fix/security'][index % 3],
      commit_hash: `mock${index}${uuidv4().substring(0, 7)}`,
      files_selected: [245, 78, 32][index % 3],
      vulnerabilities_found: [5, 3, 2][index % 3],
      is_mock: true
    }));

    // Generate mock vulnerabilities
    const severities = ['critical', 'high', 'medium', 'low'] as const;
    const statuses = ['open', 'in_progress', 'resolved', 'false_positive'] as const;
    
    const mockVulnerabilities: MockVulnerability[] = [];
    
    // Create different types of mock vulnerabilities for each scan
    mockScans.forEach((scan, scanIndex) => {
      const vulnCount = scan.vulnerabilities_found;
      
      for (let i = 0; i < vulnCount; i++) {
        const severityIndex = Math.min(i, severities.length - 1);
        const statusIndex = Math.floor(Math.random() * statuses.length);
        
        mockVulnerabilities.push({
          id: `mock_vuln_${uuidv4()}`,
          project_id: projectId,
          scan_id: scan.id,
          severity: severities[severityIndex],
          title: [
            'SQL Injection in Query Builder',
            'Cross-Site Scripting in User Profile',
            'Insecure Direct Object Reference',
            'Hardcoded API Key',
            'Missing Content Security Policy',
            'Unsafe Deserialization',
            'Broken Authentication Flow',
            'CSRF Protection Missing',
            'Weak Password Hashing',
            'Insecure File Upload'
          ][Math.floor(Math.random() * 10)],
          description: `This is a mock ${severities[severityIndex]} severity vulnerability found in scan ${scanIndex + 1}.`,
          file_path: [
            'src/api/users.ts',
            'app/components/Profile.tsx',
            'lib/database/query.js',
            'server/auth/session.ts',
            'app/api/upload/route.ts'
          ][Math.floor(Math.random() * 5)],
          line_start: 10 + i * 5,
          line_end: 10 + i * 5 + 2,
          code_snippet: `function processUserInput(data) {\n  // Vulnerable code\n  const query = "SELECT * FROM users WHERE id = " + data.userId;\n  return db.execute(query);\n}`,
          recommendation: 'Use parameterized queries to prevent SQL injection attacks.',
          status: statuses[statusIndex],
          created_at: scan.created_at,
          updated_at: new Date().toISOString(),
          is_mock: true,
          // Additional fields to match schema
          scan: {
            id: scan.id,
            scan_type: scan.scan_type,
            status: scan.status,
            created_at: scan.created_at,
            completed_at: scan.completed_at,
            branch: scan.branch,
            commit_hash: scan.commit_hash
          }
        });
      }
    });
    
    // Sort by severity (critical first)
    mockVulnerabilities.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    return NextResponse.json(mockVulnerabilities);
  } catch (error) {
    console.error('Error fetching vulnerabilities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vulnerabilities' },
      { status: 500 }
    );
  }
} 