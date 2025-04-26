import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// GET /api/projects/[id]/scans/[scanId]/code-files - Get code files for a scan
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; scanId: string } }
) {
  try {
    // Await params to avoid Next.js dynamic API warning
    const { id: projectId, scanId } = await params;

    console.log(
      `Fetching code files for scan ${scanId} in project ${projectId}`
    );

    // Check if this is a mock scan (by naming convention) before querying database
    if (scanId.startsWith("mock_")) {
      // For mock scans, generate mock code files
      // Generate between 10 and 30 files
      const fileCount = Math.floor(Math.random() * 20) + 10;

      const fileExtensions = [
        { ext: ".js", lang: "javascript" },
        { ext: ".ts", lang: "typescript" },
        { ext: ".tsx", lang: "typescript" },
        { ext: ".jsx", lang: "javascript" },
        { ext: ".py", lang: "python" },
        { ext: ".html", lang: "html" },
        { ext: ".css", lang: "css" },
        { ext: ".json", lang: "json" },
      ];

      const directories = [
        "src/components/",
        "app/api/",
        "lib/utils/",
        "pages/auth/",
        "server/routes/",
        "src/hooks/",
        "public/assets/",
        "styles/",
        "config/",
      ];

      const mockCodeFiles = [];

      for (let i = 0; i < fileCount; i++) {
        const extIndex = i % fileExtensions.length;
        const dirIndex = i % directories.length;
        const { ext, lang } = fileExtensions[extIndex];

        const fileName = `file${i}${ext}`;
        const filePath = `${directories[dirIndex]}${fileName}`;
        const fileSize = (Math.random() * 5000) + 500; // 500-5500 bytes

        mockCodeFiles.push({
          id: `mock_file_${uuidv4()}`,
          scan_id: scanId,
          file_path: filePath,
          content_hash: `mock_hash_${Math.random().toString(36).slice(2, 10)}`,
          file_size: Math.floor(fileSize),
          language: lang,
          scanned: true,
          created_at: new Date().toISOString(),
          is_mock: true,
        });
      }

      return NextResponse.json(mockCodeFiles);
    }

    // Only query the real database for real scan IDs
    const supabase = await createClient();

    // Query real database for code files
    const { data, error } = await supabase
      .from("code_files")
      .select("*")
      .eq("scan_id", scanId)
      .order("file_path");

    if (error) {
      console.error("Error fetching code files:", error);
      return NextResponse.json(
        { error: "Failed to fetch code files" },
        { status: 500 },
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error in GET code files:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
