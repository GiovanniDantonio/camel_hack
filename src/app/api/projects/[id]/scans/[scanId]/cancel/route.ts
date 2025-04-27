import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // Get the scan to verify it exists and belongs to this project
    const { data: scan, error: scanError } = await supabase
      .from("scans")
      .select("status")
      .eq("id", scanId)
      .eq("project_id", projectId)
      .single();

    if (scanError || !scan) {
      return NextResponse.json(
        { error: "Scan not found" },
        { status: 404 },
      );
    }

    // Only allow canceling scans that are pending or running
    if (scan.status !== "pending" && scan.status !== "running") {
      return NextResponse.json(
        { error: `Cannot cancel scan with status: ${scan.status}` },
        { status: 400 },
      );
    }

    // Update the scan status to canceled
    const { error: updateError } = await supabase
      .from("scans")
      .update({
        status: "canceled",
        completed_at: new Date().toISOString(), // Mark as completed (with canceled status)
        updated_at: new Date().toISOString(),
        execution_logs: supabase.rpc("append_to_scan_logs", {
          scan_id: scanId,
          log_message: "Scan canceled by user",
        }),
      })
      .eq("id", scanId);

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to cancel scan: ${updateError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Scan canceled successfully",
    });
  } catch (error) {
    console.error("Error canceling scan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
