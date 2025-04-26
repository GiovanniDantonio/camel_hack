import { runVulnerabilityScan } from "@/lib/services/serverless/scanner/scanner";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Simulate a background job system
export const mockScanQueue = new Map<string, {
  id: string;
  project_id: string;
  status: string;
  updated_at: string;
  progress: number;
  startTime: number;
}>();

// GET /api/projects/[id]/scans - Get all scans for a project
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const awaitedParams = await params;
    // Authenticate the user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const projectId = awaitedParams.id;

    // Fetch all scans for this project
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: `Failed to fetch scans: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching scans:", error);
    return NextResponse.json(
      { error: "Failed to fetch scans" },
      { status: 500 },
    );
  }
}

// POST /api/projects/[id]/scans - Create a new scan for a project
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const awaitedParams = await params;
    // Get authentication from Supabase
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const projectId = awaitedParams.id;
    const body = await req.json();

    // Validate required fields
    if (!body.scan_type) {
      return NextResponse.json(
        { error: "Missing required field: scan_type" },
        { status: 400 },
      );
    }

    // Map legacy scan types to valid database enum values
    const mapScanType = (type: string): "full" | "incremental" | "targeted" => {
      switch (type) {
        case "deep":
          return "full";
        case "commit":
          return "incremental";
        case "custom":
          return "targeted";
        default:
          return type as "full" | "incremental" | "targeted";
      }
    };

    // Prepare vulnerabilityList from vulnerability_types
    const vulnerabilityList = body.vulnerability_types || [];

    // Extract custom vulnerabilities if provided
    const customVulnerabilities = body.custom_vulnerabilities || [];

    // Prepare scan request with mapped scan type
    const scanRequest = {
      projectId,
      branch: body.branch || "main",
      commit: body.commit_hash || null,
      filePaths: body.files || [],
      triggeredBy: userId,
      scanType: mapScanType(body.scan_type),
      vulnerabilityList,
      customVulnerabilities,
    };

    try {
      // Start the vulnerability scan process
      console.log(`Starting scan for project ${projectId}`);

      // Fire and forget - run the scan without awaiting or storing the promise
      runVulnerabilityScan(scanRequest);

      // Return an initial response to the client
      return NextResponse.json({
        status: "pending",
        message: "Scan started successfully",
      });
    } catch (error) {
      console.error("Error processing scan request:", error);
      return NextResponse.json(
        { error: "Failed to process scan request" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error processing scan request:", error);
    return NextResponse.json(
      { error: "Failed to process scan request" },
      { status: 500 },
    );
  }
}
