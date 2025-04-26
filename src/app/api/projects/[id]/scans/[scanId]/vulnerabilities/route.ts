import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// GET /api/projects/[id]/scans/[scanId]/vulnerabilities - Get vulnerabilities for a scan
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; scanId: string } }
) {
  try {
    // Await params to avoid Next.js dynamic API warning
    const { id: projectId, scanId } = await params;

    console.log(
      `Fetching vulnerabilities for scan ${scanId} in project ${projectId}`
    );

    // Check if this is a mock scan (by naming convention) before querying database
    if (scanId.startsWith("mock_")) {
      // For mock scans, generate mock vulnerabilities
      // Calculate number of vulnerabilities based on the last character of the scanId
      const lastChar = scanId.slice(-1);
      const vulnerabilityCount = parseInt(lastChar, 16) % 8; // 0-7 vulnerabilities

      if (vulnerabilityCount === 0) {
        return NextResponse.json([]);
      }

      const severities = ["critical", "high", "medium", "low"];
      const statuses = ["open", "in_progress", "resolved", "false_positive"];
      const mockVulnerabilityTypes = [
        {
          type: "mock_sql_injection",
          titles: [
            "Unsanitized SQL input in query builder",
            "Direct SQL query with user input",
            "SQL injection vulnerability in database controller",
          ],
          paths: [
            "app/api/database/query.ts",
            "server/db/controller.js",
            "lib/database.ts",
          ],
        },
        {
          type: "mock_xss",
          titles: [
            "Unescaped user input rendered as HTML",
            "DOM-based XSS vulnerability",
            "Cross-site scripting risk in template",
          ],
          paths: [
            "app/components/Comment.jsx",
            "pages/user/profile.tsx",
            "templates/userContent.js",
          ],
        },
        {
          type: "mock_csrf",
          titles: [
            "Missing CSRF token in form submission",
            "Cross-site request forgery vulnerability",
            "Insecure form handling without CSRF protection",
          ],
          paths: [
            "app/components/Form.jsx",
            "pages/auth/settings.ts",
            "lib/forms/handler.js",
          ],
        },
        {
          type: "mock_auth_issues",
          titles: [
            "Weak password hashing algorithm",
            "Missing authentication for API endpoint",
            "Insecure session management",
          ],
          paths: [
            "app/auth/passwords.ts",
            "pages/api/users/data.js",
            "lib/session.ts",
          ],
        },
      ];

      const mockVulnerabilities = [];

      // Create different types of vulnerabilities
      for (let i = 0; i < vulnerabilityCount; i++) {
        const typeIndex = i % mockVulnerabilityTypes.length;
        const vulnType = mockVulnerabilityTypes[typeIndex];

        const severity = severities[Math.min(i, severities.length - 1)];
        const titleIndex = i % vulnType.titles.length;
        const pathIndex = i % vulnType.paths.length;

        const lineStart = 10 + (i * 5);
        const lineEnd = lineStart + 3;

        mockVulnerabilities.push({
          id: `mock_vuln_${uuidv4()}`,
          scan_id: scanId,
          severity: severity,
          title: vulnType.titles[titleIndex],
          description:
            `This is a mock ${vulnType.type} vulnerability that could allow attackers to compromise the system. This is for demonstration purposes only.`,
          file_path: vulnType.paths[pathIndex],
          line_start: lineStart,
          line_end: lineEnd,
          code_snippet:
            `function processUserInput(data) {\n  // Vulnerable code\n  const query = "SELECT * FROM users WHERE id = " + data.userId;\n  return db.execute(query);\n}`,
          recommendation:
            `Sanitize user input before using it in SQL queries. Use parameterized queries or an ORM to prevent SQL injection attacks.`,
          status: statuses[i % statuses.length],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_mock: true,
        });
      }

      return NextResponse.json(mockVulnerabilities);
    }

    // Only query the real database for real scan IDs
    const supabase = await createClient();

    // Query real database for vulnerabilities
    const { data, error } = await supabase
      .from("vulnerabilities")
      .select("*")
      .eq("scan_id", scanId)
      .order("severity");

    if (error) {
      console.error("Error fetching vulnerabilities:", error);
      return NextResponse.json(
        { error: "Failed to fetch vulnerabilities" },
        { status: 500 },
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error in GET vulnerabilities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/projects/[id]/scans/[scanId]/vulnerabilities - Create a new vulnerability for a scan
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; scanId: string } }
) {
  try {
    // Await params to avoid Next.js dynamic API warning
    const { id: projectId, scanId } = await params;

    if (!projectId || !scanId) {
      return NextResponse.json(
        { error: "Project ID and Scan ID are required" },
        { status: 400 }
      );
    }

    // Check if this is a mock scan ID and handle specially
    if (scanId.startsWith("mock_")) {
      // For mock scans, just return a mock success response
      const mockVulnerability = {
        id: `mock_vuln_${uuidv4()}`,
        project_id: projectId,
        scan_id: scanId,
        severity: "medium",
        title: "Mock Vulnerability Created",
        description: "This is a mock vulnerability created via API.",
        file_path: "src/mock/file.ts",
        line_start: 42,
        line_end: 45,
        code_snippet: "const mockCode = 'This is mock code';\nconsole.log(mockCode);",
        status: "open",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_mock: true
      };

      return NextResponse.json(mockVulnerability);
    }

    const supabase = await createClient(true); // Use admin client

    // Check if the scan exists and belongs to the project
    const { error: scanError } = await supabase
      .from("scans")
      .select("id")
      .eq("project_id", projectId)
      .eq("id", scanId)
      .single();

    if (scanError) {
      if (scanError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Scan not found" },
          { status: 404 },
        );
      }

      console.error("Error checking scan:", scanError);
      return NextResponse.json(
        { error: "Failed to check scan" },
        { status: 500 },
      );
    }

    // Get vulnerability data from the request body
    const vulnerabilityData = await request.json();

    // Make sure required fields are present
    const requiredFields = ["severity", "title", "location"];
    for (const field of requiredFields) {
      if (!vulnerabilityData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Create the vulnerability
    const newVulnerability = {
      project_id: projectId,
      scan_id: scanId,
      severity: vulnerabilityData.severity,
      title: vulnerabilityData.title,
      description: vulnerabilityData.description || "",
      location: vulnerabilityData.location,
      line_start: vulnerabilityData.line_start,
      line_end: vulnerabilityData.line_end,
      code_snippet: vulnerabilityData.code_snippet,
      status: "open",
      remediation: vulnerabilityData.remediation || "",
      vulnerability_type: vulnerabilityData.vulnerability_type || null,
      affected_components: vulnerabilityData.affected_components || [],
      reference_urls: vulnerabilityData.reference_urls || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("vulnerabilities")
      .insert(newVulnerability)
      .select()
      .single();

    if (error) {
      console.error("Error creating vulnerability:", error);
      return NextResponse.json(
        { error: "Failed to create vulnerability" },
        { status: 500 },
      );
    }

    // Increment vulnerabilities_found counter in the scan
    await supabase
      .from("scans")
      .update({
        vulnerabilities_found: supabase.rpc("increment", {
          row_id: scanId,
          table_name: "scans",
          column_name: "vulnerabilities_found",
        }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", scanId);

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Error in POST /api/projects/[id]/scans/[scanId]/vulnerabilities:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
