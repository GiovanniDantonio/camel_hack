import { NextRequest, NextResponse } from "next/server";
import { 
  getCustomVulnerabilitiesByProjectId,
  createCustomVulnerability,
  deleteCustomVulnerability,
  CustomVulnerability
} from "@/lib/services/custom-vulnerability-service";
import { createClient } from "@/lib/supabase/server";

/**
 * Validates the format of a CVE code.
 * Valid format: CVE-YYYY-NNNNN where YYYY is a year and NNNNN is a sequence number.
 * @param cveCode The CVE code to validate
 * @returns True if the CVE code is valid, false otherwise
 */
function validateCveFormat(cveCode: string): boolean {
  // CVE format: CVE-YYYY-NNNNN (year-sequence number)
  const cveRegex = /^CVE-\d{4}-\d{4,}$/;
  return cveRegex.test(cveCode);
}

// GET /api/vulnerabilities/custom?projectId=...
export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get project ID from query params
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Verify the user has access to this project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 403 }
      );
    }

    // Fetch custom vulnerabilities for the project
    const customVulnerabilities = await getCustomVulnerabilitiesByProjectId(projectId);

    return NextResponse.json({ customVulnerabilities });
  } catch (error) {
    console.error("Error fetching custom vulnerabilities:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom vulnerabilities" },
      { status: 500 }
    );
  }
}

// POST /api/vulnerabilities/custom
export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { projectId, name, description, cveCode } = body;

    if (!projectId || !name || !description) {
      return NextResponse.json(
        { error: "Project ID, name, and description are required" },
        { status: 400 }
      );
    }
    
    // Validate CVE code format if provided
    if (cveCode && !validateCveFormat(cveCode)) {
      return NextResponse.json(
        { error: "Invalid CVE format. Expected format: CVE-YYYY-NNNNN" },
        { status: 400 }
      );
    }

    // Verify the user has access to this project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 403 }
      );
    }

    // Log the request data for debugging
    console.log('Creating custom vulnerability with data:', {
      project_id: projectId,
      name,
      description,
      cve_code: cveCode || null,
      created_by: user.id
    });
    
    // Check if a vulnerability with this CVE code already exists for this project
    if (cveCode) {
      const { data: existingVulnerabilities } = await supabase
        .from('custom_vulnerabilities')
        .select('id, name, cve_code')
        .eq('project_id', projectId.toString())
        .eq('cve_code', cveCode)
        .eq('is_active', true);

      if (existingVulnerabilities && existingVulnerabilities.length > 0) {
        return NextResponse.json(
          { 
            error: `A vulnerability with CVE code ${cveCode} already exists in this project`,
            existingVulnerability: existingVulnerabilities[0]
          },
          { status: 409 } // Conflict status code
        );
      }
    }
    
    // Create the custom vulnerability with properly formatted data
    // Ensure project_id is a valid UUID string
    const customVulnerability = await createCustomVulnerability({
      project_id: projectId.toString(), // Ensure it's a string
      name,
      description,
      cve_code: cveCode || null,
      created_by: user.id,
      is_active: true,
    });

    return NextResponse.json({ customVulnerability }, { status: 201 });
  } catch (error) {
    console.error("Error creating custom vulnerability:", error);
    return NextResponse.json(
      { error: `Failed to create custom vulnerability: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// DELETE /api/vulnerabilities/custom?id=...&projectId=...
export async function DELETE(request: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get vulnerability ID and project ID from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const projectId = searchParams.get("projectId");

    if (!id || !projectId) {
      return NextResponse.json(
        { error: "Vulnerability ID and Project ID are required" },
        { status: 400 }
      );
    }

    // Verify the user has access to this project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 403 }
      );
    }

    // Delete the custom vulnerability
    await deleteCustomVulnerability(id, projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting custom vulnerability:", error);
    return NextResponse.json(
      { error: "Failed to delete custom vulnerability" },
      { status: 500 }
    );
  }
}
