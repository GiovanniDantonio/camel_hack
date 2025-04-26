import { Database } from "@/types/OLD_supabase";
import { CodeFileService } from "./code-file-service";
import { LLMService } from "./llm-service";
import { VulnerabilityService } from "./vulnerability-service";
import { getBaseUrl } from "@/lib/utils/url";
import { auth0 } from "@/lib/auth0";

export type Scan = Database["public"]["Tables"]["scans"]["Row"];
export type ScanInsert = Database["public"]["Tables"]["scans"]["Insert"];

export class ScanService {
  static async createScan(
    projectId: string,
    userId: string,
    options: {
      scanType: "full" | "incremental" | "targeted";
      targetComponents?: string[];
    },
  ): Promise<{ success: boolean; message: string; scanId?: string }> {
    try {
      const response = await fetch(`${getBaseUrl()}/api/scans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          userId,
          scanType: options.scanType,
          targetComponents: options.targetComponents,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.error || "Failed to create scan",
        };
      }

      const scan = await response.json();

      // Immediately execute the scan
      try {
        await this.executeScan(scan.id, scan.project_id, userId, {
          scanType: scan.scan_type as "full" | "incremental" | "targeted",
          targetComponents: scan.target_components || undefined,
          llmProvider: (process.env.DEFAULT_LLM_PROVIDER || "xai") as
            | "deepseek"
            | "xai",
        });
      } catch (execError) {
        console.error("Error starting scan execution:", execError);
      }

      return {
        success: true,
        message: "Security scan initiated successfully",
        scanId: scan.id,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : "Failed to run security scan",
      };
    }
  }

  static async getScansByProjectId(
    projectId: string,
    userId: string,
  ): Promise<Scan[]> {
    const response = await fetch(
      `${getBaseUrl()}/api/scans?projectId=${
        encodeURIComponent(projectId)
      }&userId=${encodeURIComponent(userId)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch scans");
    }

    return response.json();
  }

  static async updateScanStatus(
    id: string,
    userId: string,
    status: "running" | "completed" | "failed",
    updates: {
      executionLogs?: string;
      resultSummary?: string;
      vulnerabilitiesFound?: number;
      riskScore?: number;
    } = {},
  ): Promise<Scan> {
    const updateData = {
      status,
      ...(updates.executionLogs && { execution_logs: updates.executionLogs }),
      ...(updates.resultSummary && { result_summary: updates.resultSummary }),
      ...(updates.vulnerabilitiesFound !== undefined && {
        vulnerabilities_found: updates.vulnerabilitiesFound,
      }),
      ...(updates.riskScore !== undefined && { risk_score: updates.riskScore }),
      ...(status === "running" && { started_at: new Date().toISOString() }),
      ...(status === "completed" || status === "failed"
        ? { completed_at: new Date().toISOString() }
        : {}),
      updated_at: new Date().toISOString(),
    };

    const response = await fetch(
      `${getBaseUrl()}/api/scans?scanId=${encodeURIComponent(id)}&userId=${
        encodeURIComponent(userId)
      }`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(
          `Failed to update scan status: ${
            error.error || response.statusText
          } (${response.status})`,
        );
      } catch (parseError) {
        throw new Error(
          `Failed to update scan status: ${response.statusText} (${response.status})`,
        );
      }
    }

    return response.json();
  }

  static async executeScan(
    scanId: string,
    projectId: string,
    userId: string,
    options: {
      scanType: "full" | "incremental" | "targeted";
      targetComponents?: string[];
      llmProvider?: "deepseek" | "xai";
    },
  ): Promise<void> {
    const logs: string[] = [];
    let currentStatus: "running" | "completed" | "failed" = "running";

    try {
      // Initialize LLM service
      console.log("🤖 Initializing Grok model:", options.llmProvider);
      LLMService.initialize(options.llmProvider);
      logs.push(`Initialized Grok model: ${options.llmProvider}\n`);

      // Update scan status to running
      await this.updateScanStatus(scanId, userId, "running", {
        executionLogs: "Starting security scan with Grok...\n",
      });

      // Get code files
      const codeFiles = await CodeFileService.getCodeFilesByProjectId(
        projectId,
      );
      if (!codeFiles.length) {
        throw new Error("No code files found in the project");
      }

      // Filter files based on scan type
      const filesToScan =
        options.scanType === "targeted" && options.targetComponents
          ? codeFiles.filter((file) =>
            options.targetComponents!.some((component) =>
              file.file_path.includes(component)
            )
          )
          : options.scanType === "incremental"
          ? codeFiles.filter((file) =>
            !file.last_scanned_at ||
            new Date(file.last_scanned_at) < new Date(file.updated_at)
          )
          : codeFiles;

      if (!filesToScan.length) {
        throw new Error(
          options.scanType === "targeted"
            ? "No files found matching the target components"
            : options.scanType === "incremental"
            ? "No files have been modified since last scan"
            : "No files found to scan",
        );
      }

      let totalVulnerabilities = 0;
      let maxRiskScore = 0;
      let failedFiles = 0;

      // Analyze each file
      for (const file of filesToScan) {
        try {
          console.log("\n🔍 Analyzing file with Grok:", file.file_path);
          const result = await LLMService.analyzeCode(
            file.content,
            `File: ${file.file_path}\nLanguage: ${file.language}`,
          );

          // Log detailed Grok analysis output
          console.log("\n📊 Grok Analysis Results:");
          console.log("------------------------------------------");
          console.log("File:", file.file_path);
          console.log("Language:", file.language);
          console.log("Vulnerabilities Found:", result.vulnerabilities.length);
          console.log("Risk Score:", result.riskScore);

          if (result.vulnerabilities.length > 0) {
            console.log("\n🚨 Detected Vulnerabilities:");
            result.vulnerabilities.forEach((vuln, index) => {
              console.log(`\n[${index + 1}] ${vuln.title}`);
              console.log("Severity:", vuln.severity);
              console.log("Location:", vuln.location);
              console.log("Description:", vuln.description);
              console.log("CVE:", vuln.cve || "N/A");
              console.log("Remediation:", vuln.remediation);
            });
          }
          console.log("------------------------------------------\n");

          // Create vulnerabilities
          for (const vuln of result.vulnerabilities) {
            try {
              // Format the vulnerability data
              const vulnerability = {
                project_id: projectId,
                severity: vuln.severity.toLowerCase() as
                  | "critical"
                  | "high"
                  | "medium"
                  | "low",
                title: vuln.title || "Security Issue Detected",
                description: vuln.description,
                location: typeof vuln.location === "string"
                  ? vuln.location
                  : `${file.file_path}:${
                    (vuln.location as any)?.line || "unknown"
                  }`,
                detectedAt: new Date().toISOString(),
                status: "open" as const,
                cve: vuln.cve || undefined,
                remediation: vuln.remediation ||
                  "No remediation steps provided",
                affectedComponents: [file.file_path],
                reference_urls: [] as string[],
              };

              console.log("Creating vulnerability:", vulnerability);
              await VulnerabilityService.createVulnerability(vulnerability);
              totalVulnerabilities++;
            } catch (error) {
              console.error("Failed to create vulnerability:", error);
              // Don't throw, just log and continue with next vulnerability
              logs.push(`⚠️ Failed to create vulnerability record: ${error}\n`);
            }
          }

          maxRiskScore = Math.max(maxRiskScore, result.riskScore);
          logs.push(
            `✓ Grok analyzed ${file.file_path}: Found ${result.vulnerabilities.length} vulnerabilities\n`,
          );

          await CodeFileService.updateCodeFile(file.id, {
            last_scanned_at: new Date().toISOString(),
          });
        } catch (error) {
          console.error("❌ Grok analysis failed:", error);
          failedFiles++;
          logs.push(`❌ Grok failed to analyze ${file.file_path}\n`);

          if (failedFiles > filesToScan.length * 0.5) {
            throw new Error(
              "Too many files failed Grok analysis. Aborting scan.",
            );
          }
        }
      }

      // Update final status
      currentStatus = failedFiles > 0 ? "completed" : "completed";
      const summary =
        `Grok scan completed. Found ${totalVulnerabilities} vulnerabilities with max risk score ${maxRiskScore}.`;

      console.log("\n📋 Final Scan Summary:");
      console.log("------------------------------------------");
      console.log("Total Files Analyzed:", filesToScan.length);
      console.log("Failed Files:", failedFiles);
      console.log("Total Vulnerabilities:", totalVulnerabilities);
      console.log("Maximum Risk Score:", maxRiskScore);
      console.log("------------------------------------------\n");

      await this.updateScanStatus(scanId, userId, currentStatus, {
        executionLogs: logs.join(""),
        resultSummary: summary,
        vulnerabilitiesFound: totalVulnerabilities,
        riskScore: maxRiskScore,
      });
    } catch (error) {
      console.error("❌ Grok scan failed:", error);
      currentStatus = "failed";
      logs.push(
        `❌ Grok scan failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n`,
      );

      await this.updateScanStatus(scanId, userId, "failed", {
        executionLogs: logs.join(""),
        resultSummary: `Grok security scan failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });

      throw error;
    }
  }
}
