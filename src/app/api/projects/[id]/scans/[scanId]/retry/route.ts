import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runVulnerabilityScan } from "@/lib/services/serverless/scanner/scanner";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; scanId: string } },
) {
  try {
    const projectId = params.id;
    const scanId = params.scanId;

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

    // Get the user ID
    const userId = session.user.id;

    // Get the original scan to copy its parameters
    const { data: originalScan, error: scanError } = await supabase
      .from("scans")
      .select("*")
      .eq("id", scanId)
      .eq("project_id", projectId)
      .single();

    if (scanError || !originalScan) {
      return NextResponse.json(
        { error: "Scan not found" },
        { status: 404 },
      );
    }

    // Prepare scan request with parameters from the original scan
    const scanRequest = {
      projectId,
      branch: originalScan.branch,
      commit: originalScan.commit_hash || "",
      filePaths: [], // Will be populated by the scanner service
      triggeredBy: userId,
      scanType: originalScan.scan_type,
      vulnerabilityList: originalScan.vulnerability_types || [],
    };

    // Start the scan process without awaiting (fire and forget)
    runVulnerabilityScan(scanRequest);

    // Return success response
    return NextResponse.json({
      status: "pending",
      message: "Scan retry initiated successfully",
    });
  } catch (error) {
    console.error("Error retrying scan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
