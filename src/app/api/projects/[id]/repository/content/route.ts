import { NextResponse } from "next/server";
import { getFileContent } from "./services";
import fs from "fs/promises";
import { join, basename } from "path";

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
    // File path parameter
    const filePathParam = url.searchParams.get("path");
    const branch = url.searchParams.get("branch") || "main";
    const commit = url.searchParams.get("commit");

    if (!filePathParam) {
      return NextResponse.json(
        { error: "Path parameter is required" },
        { status: 400 },
      );
    }

    // Attempt GitHub API fetch
    let content;
    try {
      content = await getFileContent({ projectId, path: filePathParam, branch, commit: commit || undefined });
    } catch (error) {
      console.error("Error fetching file content via GitHub API:", error);
      // Fallback to local file system
      try {
        const projectRoot = process.cwd();
        const absolutePath = join(projectRoot, filePathParam);
        const fileContent = await fs.readFile(absolutePath, "utf-8");
        const fallbackResponse = {
          name: basename(filePathParam),
          path: filePathParam,
          size: fileContent.length,
          content: fileContent,
          sha: "",
          url: "",
          download_url: "",
          encoding: "utf-8",
          type: "file",
        };
        return NextResponse.json(fallbackResponse);
      } catch (fsError) {
        console.error("Local fallback failed:", fsError);
        // Propagate original error for outer catch
        throw error;
      }
    }
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
