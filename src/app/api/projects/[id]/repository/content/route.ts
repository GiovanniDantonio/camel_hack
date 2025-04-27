import { NextResponse } from "next/server";
import { getFileContent } from "./services";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Correctly extract the project ID from params
    const awaitedParams = await params;
    const projectId = awaitedParams.id;

    // Get the query parameters
    const url = new URL(request.url);
    const path = url.searchParams.get("path");
    const branch = url.searchParams.get("branch") || "main";
    const commit = url.searchParams.get("commit");

    if (!path) {
      return NextResponse.json(
        { error: "Path parameter is required" },
        { status: 400 },
      );
    }

    const content = await getFileContent({
      projectId,
      path,
      branch,
      commit: commit || undefined,
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching file content:", error);
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "Failed to fetch file content",
      },
      { status: 500 },
    );
  }
}
