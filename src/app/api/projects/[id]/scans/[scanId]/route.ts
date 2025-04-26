import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/projects/[id]/scans/[scanId] - Get scan status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; scanId: string } },
) {
  try {
    const awaitedParams = await params;
    const projectId = awaitedParams.id;
    const scanId = awaitedParams.scanId;

    // Create Supabase client
    const supabase = await createClient();

    // Get the user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get the scan details
    const { data: scan, error: scanError } = await supabase
      .from("scans")
      .select("*")
      .eq("id", scanId)
      .eq("project_id", projectId)
      .single();

    if (scanError) {
      return NextResponse.json(
        { error: "Failed to fetch scan" },
        { status: 500 },
      );
    }

    if (!scan) {
      return NextResponse.json(
        { error: "Scan not found" },
        { status: 404 },
      );
    }

    // Count vulnerabilities for this scan
    const { count: vulnerabilitiesCount, error: countError } = await supabase
      .from("vulnerabilities")
      .select("*", { count: "exact", head: true })
      .eq("scan_id", scanId);

    if (countError) {
      console.error("Error counting vulnerabilities:", countError);
      // Continue with scan data, just won't have accurate count
    } else {
      // Update the scan object with the count
      scan.vulnerabilities_found = vulnerabilitiesCount || 0;
    }

    // Add estimated progress if scan is running
    if (scan.status === "running") {
      // Calculate progress based on timestamp if not available in the DB
      if (
        scan.progress_percentage === null ||
        scan.progress_percentage === undefined
      ) {
        const now = new Date();
        const startTime = new Date(scan.created_at);
        // Assume scans take about 2 minutes on average
        const estimatedDuration = 2 * 60 * 1000;
        const elapsed = now.getTime() - startTime.getTime();
        scan.progress = Math.min(
          Math.floor((elapsed / estimatedDuration) * 100),
          99,
        );
      } else {
        scan.progress = scan.progress_percentage;
      }
    }

    return NextResponse.json(scan);
  } catch (error) {
    console.error("Error fetching scan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH /api/projects/[id]/scans/[scanId] - Update a scan (e.g., for admin to update status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; scanId: string } },
) {
  try {
    // Await params to avoid Next.js dynamic API warning
    const { id: projectId, scanId } = await params;

    if (!projectId || !scanId) {
      return NextResponse.json(
        { error: "Project ID and Scan ID are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient(true); // Use admin client

    // Get request body
    const updates = await request.json();

    // Check if the scan exists
    const { error: checkError } = await supabase
      .from("scans")
      .select("id")
      .eq("project_id", projectId)
      .eq("id", scanId)
      .single();

    if (checkError) {
      if (checkError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Scan not found" },
          { status: 404 },
        );
      }

      console.error("Error checking scan:", checkError);
      return NextResponse.json(
        { error: "Failed to check scan" },
        { status: 500 },
      );
    }

    // Update the scan
    const { data, error } = await supabase
      .from("scans")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", scanId)
      .select()
      .single();

    if (error) {
      console.error("Error updating scan:", error);
      return NextResponse.json(
        { error: "Failed to update scan" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PATCH /api/projects/[id]/scans/[scanId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
