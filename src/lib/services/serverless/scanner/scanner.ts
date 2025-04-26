import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
import { getParentFiles } from "./agents/dependency-retriever-agent";
import { runVulnerabilityAgent } from "./agents/vulnerability-agent";
import { createScanSummary } from "./agents/create-scan-summary";
import { getOctokitRepo } from "@/lib/octokit/octokit";

/**
 * Sanitizes vulnerability data to prevent PostgreSQL errors with invalid Unicode characters.
 * Removes null characters and other problematic escape sequences.
 *
 * @param vulnerabilities Array of vulnerability objects to sanitize
 * @returns Sanitized array of vulnerability objects
 */
function sanitizeVulnerabilityData<T extends object>(
  vulnerabilities: T[],
): T[] {
  return vulnerabilities.map((vuln) => {
    // Create a new object to avoid mutating the original
    const sanitized = { ...vuln } as Record<string, unknown>;

    // Process all string properties to remove null characters and invalid escape sequences
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === "string") {
        // Replace null characters and other problematic escape sequences
        sanitized[key] = (sanitized[key] as string)
          .replace(/\u0000/g, "") // Remove null characters
          .replace(/\\u0000/g, "") // Remove escaped null characters
          .replace(/[\uD800-\uDFFF]/g, "") // Remove unpaired surrogate code points
          .replace(/[\uFFFE\uFFFF]/g, ""); // Remove non-characters
      } else if (
        Array.isArray(sanitized[key]) &&
        sanitized[key].every((item: unknown) => typeof item === "string")
      ) {
        // Handle arrays of strings (like code_snippet_lines)
        sanitized[key] = (sanitized[key] as string[]).map((str: string) =>
          str.replace(/\u0000/g, "")
            .replace(/\\u0000/g, "")
            .replace(/[\uD800-\uDFFF]/g, "")
            .replace(/[\uFFFE\uFFFF]/g, "")
        );
      }
      // For nested objects we could add recursion, but it doesn't seem necessary for this schema
    });

    return sanitized as T;
  });
}

export type ScanRequest = {
  projectId: string;
  branch: string;
  commit: string;
  filePaths: string[];
  triggeredBy: string;
  scanType: string;
  vulnerabilityList: string[];
  customVulnerabilities?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
};

type Vulnerability = Database["public"]["Tables"]["vulnerabilities"]["Row"];
type ScanRow = Database["public"]["Tables"]["scans"]["Row"];

// Define an interface for the scan summary input that includes vulnerabilities
interface ScanSummaryInput extends ScanRow {
  vulnerabilities: Vulnerability[];
}

// ---------------------
// Risk Score Utility
// ---------------------
/**
 * Calculates a normalized risk score (0-100) based on vulnerability severities and distribution.
 *
 * This is a pure function, making unit-testing straightforward.
 *
 * @param allVulnerabilities  Array of vulnerabilities (must include `severity` and `file_path`)
 * @param filesScanned        Total number of files scanned
 * @returns                   Integer risk score in [0,100]
 */
export function calculateRiskScore(
  allVulnerabilities: Array<{ severity: string; file_path: string | null; title?: string }>,
  filesScanned: number,
): number {
  // Assign weights to each severity (tweakable without touching algorithm below)
  const severityWeights: Record<string, number> = {
    critical: 50,
    high: 30,
    medium: 20,
    low: 10,
  };

  if (!allVulnerabilities.length) return 0;

  // 1. Count vulnerabilities by severity
  const severityCounts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  allVulnerabilities.forEach((v) => {
    if (v.severity in severityCounts) severityCounts[v.severity]++;
  });

  // 2. Weighted base score
  let totalWeight = 0;
  let weightedSum = 0;
  Object.entries(severityCounts).forEach(([severity, count]) => {
    const weight = severityWeights[severity] || 0;
    weightedSum += count * weight;
    totalWeight += count;
  });
  const baseScore = weightedSum / (totalWeight || 1);

  // 3. Concentration – vulnerabilities packed in fewer files = higher risk
  const filesWithVulns = new Set(
    allVulnerabilities.map((v) => v.file_path || "unknown"),
  ).size;
  const concentrationFactor = Math.min(
    1.0,
    Math.sqrt(totalWeight / (filesWithVulns || 1)),
  );

  // 4. Coverage – percentage of scanned files with vulnerabilities
  const coverageFactor = filesWithVulns / (filesScanned || 1);

  // 5. Pattern – repeated vuln types suggest systemic issues
  const vulnTypeCount: Record<string, number> = {};
  allVulnerabilities.forEach((v) => {
    const vulnType = v.title?.split(":")[0]?.trim() || "unknown";
    vulnTypeCount[vulnType] = (vulnTypeCount[vulnType] || 0) + 1;
  });
  const repeatedTypes = Object.values(vulnTypeCount).filter((c) => (c as number) > 1).length;
  const patternFactor = repeatedTypes > 0
    ? Math.min(1.3, 1 + repeatedTypes / 10)
    : 1.0;

  // 6. Severe impact – nonlinear weight for critical+high
  const severeCount = severityCounts.critical + severityCounts.high;
  const severeFactor = severeCount > 0
    ? Math.min(1.5, 1 + Math.log10(severeCount + 1) / 2)
    : 1.0;

  // 7. Combine factors (weights sum to 1)
  const compoundFactor =
    severeFactor * 0.5 +
    concentrationFactor * 0.2 +
    coverageFactor * 0.1 +
    patternFactor * 0.2;

  // 8. Normalise to 0-100
  const adjusted = baseScore * compoundFactor;
  return Math.min(100, Math.ceil(adjusted * (1 + Math.log10(totalWeight + 1) / 2)));
}

export async function runVulnerabilityScan(
  scanRequest: ScanRequest,
): Promise<ScanRow> {
  const supabase = await createClient();
  const uniqueFilePaths = [...new Set(scanRequest.filePaths)];

  // Create a new scan record
  const timestamp = new Date().toISOString();

  const { data: newScan, error: insertError } = await supabase
    .from("scans")
    .insert({
      project_id: scanRequest.projectId,
      branch: scanRequest.branch,
      commit_hash: scanRequest.commit,
      scan_type: scanRequest.scanType,
      status: "running",
      created_at: timestamp,
      started_at: timestamp,
      triggered_by: scanRequest.triggeredBy,
      progress_percentage: 0,
      files_scanned: 0,
      vulnerabilities_found: 0,
      current_stage: "initializing",
      execution_logs: "Scan initialized\n",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Error creating scan record:", insertError);
    throw new Error(`Failed to create scan record: ${insertError.message}`);
  }

  if (!newScan || !newScan.id) {
    throw new Error("Failed to create scan record");
  }

  const scanId = newScan.id;

  // Function to check if scan has been canceled
  const checkIfCanceled = async (): Promise<boolean> => {
    const { data: currentScan } = await supabase
      .from("scans")
      .select("status")
      .eq("id", scanId)
      .single();

    return currentScan?.status === "canceled";
  };

  // Update logs and stage
  const updateLogs = async (message: string, stage?: string) => {
    const { data: currentScan } = await supabase
      .from("scans")
      .select("execution_logs, status")
      .eq("id", scanId)
      .single();

    // If scan doesn't exist or already marked as canceled, don't change the status
    if (!currentScan) {
      console.log(
        `[VulnerabilityScan] Scan ${scanId} no longer exists, cannot update logs`,
      );
      return;
    }

    const isCanceled = currentScan.status === "canceled";

    // If already canceled and trying to change stage (not just adding logs), abort
    if (isCanceled && stage && stage !== "canceled") {
      console.log(
        `[VulnerabilityScan] Scan ${scanId} is canceled, not changing stage to ${stage}`,
      );
      // Still append the log but don't change status or stage
      const logs = currentScan.execution_logs
        ? `${currentScan.execution_logs}${timestamp}: ${message} (Note: Scan is canceled)\n`
        : `${timestamp}: ${message} (Note: Scan is canceled)\n`;

      await supabase
        .from("scans")
        .update({
          execution_logs: logs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", scanId);
      return;
    }

    const logs = currentScan.execution_logs
      ? `${currentScan.execution_logs}${timestamp}: ${message}\n`
      : `${timestamp}: ${message}\n`;

    const updateData: Partial<ScanRow> = {
      execution_logs: logs,
      updated_at: new Date().toISOString(),
    };

    // Only set stage if not canceled or if explicitly setting to canceled
    if (!isCanceled && stage) {
      updateData.current_stage = stage;
    } else if (stage === "canceled") {
      updateData.current_stage = "canceled";
      updateData.status = "canceled";
    }

    // If already canceled, preserve the canceled status
    if (isCanceled) {
      updateData.status = "canceled";
    }

    await supabase
      .from("scans")
      .update(updateData)
      .eq("id", scanId);
  };

  try {
    // Step 1: Expand file set by finding dependencies (skip for full scans)
    const isFullScan = scanRequest.scanType === "full";

    if (isFullScan) {
      await updateLogs(
        "Full scan selected, skipping dependency analysis",
        "preparing_scan",
      );
      console.log(
        `[VulnerabilityScan] Full scan ${scanId} for project ${scanRequest.projectId}, skipping dependency analysis`,
      );
    } else {
      await updateLogs(
        "Finding dependencies for target files...",
        "finding_dependencies",
      );
      console.log(
        `[VulnerabilityScan] Starting scan ${scanId} for project ${scanRequest.projectId}`,
      );
      console.log(
        `[VulnerabilityScan] Initial files to scan: ${uniqueFilePaths.length}`,
      );
    }

    const expandedFilePaths = new Set<string>(uniqueFilePaths);
    let progress = 0;

    // Only perform dependency analysis for non-full scans
    if (!isFullScan) {
      // For each file, find its dependencies and add them to the expanded set
      for (const filePath of uniqueFilePaths) {
        // Check if scan has been canceled
        if (await checkIfCanceled()) {
          console.log(
            `[VulnerabilityScan] Scan ${scanId} was canceled, stopping processing`,
          );
          await updateLogs(
            "Scan canceled by user, stopping dependency analysis",
          );
          return {
            ...newScan as ScanRow,
            status: "canceled",
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }

        try {
          console.log(
            `[VulnerabilityScan] Finding dependencies for: ${filePath}`,
          );
          const dependencies = await getParentFiles(
            scanRequest.projectId,
            scanRequest.branch,
            scanRequest.commit,
            filePath,
          );

          console.log(
            `[VulnerabilityScan] Found ${dependencies.length} dependencies for ${filePath}`,
          );

          for (const dependency of dependencies) {
            expandedFilePaths.add(dependency);
          }

          progress++;
          const progressPercentage = Math.floor(
            (progress / uniqueFilePaths.length) * 20,
          ); // 20% of total progress

          await supabase
            .from("scans")
            .update({
              progress_percentage: progressPercentage,
              updated_at: new Date().toISOString(),
            })
            .eq("id", scanId);
        } catch (error) {
          console.error(
            `[VulnerabilityScan] Error finding dependencies for ${filePath}:`,
            error,
          );
          await updateLogs(
            `Failed to get dependencies for ${filePath}: ${error}`,
          );
          // Continue with next file
        }
      }

      // Check again if scan was canceled after dependency analysis
      if (await checkIfCanceled()) {
        console.log(
          `[VulnerabilityScan] Scan ${scanId} was canceled, stopping processing`,
        );
        await updateLogs(
          "Scan canceled by user, stopping before file scanning",
        );
        return {
          ...newScan as ScanRow,
          status: "canceled",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
    }

    // Filter out file paths that do not actually exist in the repository
    let allFilesToScan = Array.from(expandedFilePaths);

    async function filterExistingFiles(
      projectId: string,
      branch: string,
      commit: string,
      paths: string[],
    ): Promise<string[]> {
      const { octokit, repoFullName } = await getOctokitRepo(projectId);
      const [owner, repo] = repoFullName.split("/");

      const existing: string[] = [];

      for (const p of paths) {
        try {
          // Try commit ref first if provided
          if (commit) {
            try {
              await octokit.rest.repos.getContent({
                owner,
                repo,
                path: p,
                ref: commit,
              });
              existing.push(p);
              continue;
            } catch (err: any) {
              if (!(err && err.status === 404)) {
                throw err;
              }
              // fall through to branch
            }
          }

          // Fallback to branch (or default branch if not provided)
          try {
            await octokit.rest.repos.getContent({
              owner,
              repo,
              path: p,
              ref: branch || undefined,
            });
            existing.push(p);
          } catch (err: any) {
            if (!(err && err.status === 404)) {
              console.error(
                `[VulnerabilityScan] Unexpected error while checking ${p}:`,
                err,
              );
            }
            // 404 – file truly missing, skip
          }
        } catch (innerErr) {
          console.error(
            `[VulnerabilityScan] Error validating existence of ${p}:`,
            innerErr,
          );
        }
      }

      return existing;
    }

    allFilesToScan = await filterExistingFiles(
      scanRequest.projectId,
      scanRequest.branch,
      scanRequest.commit,
      allFilesToScan,
    );

    if (allFilesToScan.length !== expandedFilePaths.size) {
      await updateLogs(
        `Skipping ${expandedFilePaths.size - allFilesToScan.length} non-existent files`,
      );
      console.log(
        `[VulnerabilityScan] Skipping ${expandedFilePaths.size - allFilesToScan.length} non-existent files`,
      );
    }

    // Step 2: Scan each file for vulnerabilities
    await updateLogs("Starting vulnerability scan...", "scanning_files");
    console.log(
      `[VulnerabilityScan] Beginning vulnerability scanning phase for ${allFilesToScan.length} files`,
    );

    const allVulnerabilities: Vulnerability[] = [];
    let filesScanned = 0;

    // Create a function to process a single file
    const scanFile = async (filePath: string): Promise<Vulnerability[]> => {
      try {
        console.log(
          `[VulnerabilityScan] Scanning file: ${filePath}`,
        );

        const vulnerabilities = await runVulnerabilityAgent(
          scanRequest.projectId,
          scanRequest.branch,
          scanRequest.commit,
          filePath,
          scanRequest.vulnerabilityList,
          false,
          scanRequest.customVulnerabilities || [],
        );

        if (vulnerabilities.length > 0) {
          console.log(
            `[VulnerabilityScan] Found ${vulnerabilities.length} vulnerabilities in ${filePath}`,
          );

          // Add scan_id to each vulnerability
          return vulnerabilities.map((v) => ({
            ...v,
            scan_id: scanId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));
        } else {
          console.log(
            `[VulnerabilityScan] No vulnerabilities found in ${filePath}`,
          );
          return [];
        }
      } catch (error) {
        console.error(`[VulnerabilityScan] Error scanning ${filePath}:`, error);
        await updateLogs(`Error scanning ${filePath}: ${error}`, "error");
        return [];
      }
    };

    // Task queue implementation for processing files
    // Maintains at most MAX_CONCURRENT_TASKS running at a time
    const MAX_CONCURRENT_TASKS = 8;
    let activeTasks = 0;
    let taskIndex = 0;

    // Process files through a task queue
    const processTaskQueue = async (): Promise<Vulnerability[]> => {
      const allResults: Vulnerability[] = [];

      // Process files with a concurrent task queue
      const processNextTask = async (): Promise<void> => {
        // Check for cancellation periodically
        if (taskIndex % 5 === 0 && await checkIfCanceled()) {
          console.log(
            `[VulnerabilityScan] Scan ${scanId} was canceled, stopping task queue`,
          );
          await updateLogs(
            "Scan canceled by user, stopping vulnerability scan",
          );
          throw new Error("SCAN_CANCELED");
        }

        // If all tasks are queued, we're done
        if (taskIndex >= allFilesToScan.length) return;

        // Get the next file to process
        const filePath = allFilesToScan[taskIndex++];
        activeTasks++;

        try {
          // Process the file
          const vulnerabilities = await scanFile(filePath);

          // Insert vulnerabilities if found
          if (vulnerabilities.length > 0) {
            // Sanitize the vulnerability data before insertion
            const sanitizedVulnerabilities = sanitizeVulnerabilityData(
              vulnerabilities,
            );

            const { error: vulnInsertError } = await supabase
              .from("vulnerabilities")
              .insert(sanitizedVulnerabilities);

            if (vulnInsertError) {
              console.error(
                `[VulnerabilityScan] Error inserting vulnerabilities:`,
                vulnInsertError,
              );
              await updateLogs(
                `Error inserting vulnerabilities: ${vulnInsertError.message}`,
              );
            } else {
              await updateLogs(
                `Found ${vulnerabilities.length} vulnerabilities in ${filePath}`,
              );
              allResults.push(...vulnerabilities);
            }
          }

          // Update progress
          filesScanned++;
          const progressPercentage = 20 +
            Math.floor((filesScanned / allFilesToScan.length) * 70); // 20-90% of total progress

          await supabase
            .from("scans")
            .update({
              progress_percentage: progressPercentage,
              files_scanned: filesScanned,
              vulnerabilities_found: allResults.length,
              updated_at: new Date().toISOString(),
            })
            .eq("id", scanId);
        } catch (error) {
          console.error(
            `[VulnerabilityScan] Error in task for ${filePath}:`,
            error,
          );
        } finally {
          activeTasks--;

          // Start next task
          if (taskIndex < allFilesToScan.length) {
            await processNextTask();
          }
        }
      };

      // Start the initial batch of tasks
      const initialTasks: Promise<void>[] = [];
      const initialBatchSize = Math.min(
        MAX_CONCURRENT_TASKS,
        allFilesToScan.length,
      );

      for (let i = 0; i < initialBatchSize; i++) {
        initialTasks.push(processNextTask());
      }

      // Wait for all tasks to complete
      await Promise.all(initialTasks);

      // Wait until all active tasks are done
      while (activeTasks > 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return allResults;
    };

    // Execute the task queue
    try {
      await updateLogs(
        `Starting vulnerability scanning with up to ${MAX_CONCURRENT_TASKS} concurrent files`,
      );
      const scanResults = await processTaskQueue();
      allVulnerabilities.push(...scanResults);
    } catch (error) {
      if (error instanceof Error && error.message === "SCAN_CANCELED") {
        return {
          ...newScan as ScanRow,
          status: "canceled",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          files_scanned: filesScanned,
          vulnerabilities_found: allVulnerabilities.length,
        };
      }

      console.error(`[VulnerabilityScan] Error processing task queue:`, error);
      await updateLogs(
        `Error in vulnerability scanning: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    // Check again if scan was canceled before generating summary
    if (await checkIfCanceled()) {
      console.log(
        `[VulnerabilityScan] Scan ${scanId} was canceled, stopping before report generation`,
      );
      await updateLogs(
        "Scan canceled by user, stopping before report generation",
      );
      return {
        ...newScan as ScanRow,
        status: "canceled",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        files_scanned: filesScanned,
        vulnerabilities_found: allVulnerabilities.length,
      };
    }

    // Step 3: Generate summary
    await updateLogs("Generating scan report...", "generating_report");
    console.log(
      `[VulnerabilityScan] Beginning summary generation for scan ${scanId}`,
    );
    console.log(
      `[VulnerabilityScan] Total vulnerabilities found: ${allVulnerabilities.length}`,
    );

    // Collect vulnerability types
    const vulnerabilityTypes = new Set<string>();
    allVulnerabilities.forEach((v) => {
      vulnerabilityTypes.add(v.title.split(":")[0].trim());
    });

    console.log(
      `[VulnerabilityScan] Vulnerability types found: ${
        Array.from(vulnerabilityTypes).join(", ")
      }`,
    );

    let riskScore = calculateRiskScore(allVulnerabilities, filesScanned);

    // Create detailed summary
    const scanRow: ScanRow = {
      ...newScan as ScanRow,
      progress_percentage: 90,
      status: "completed",
      files_scanned: filesScanned,
      vulnerabilities_found: allVulnerabilities.length,
      vulnerability_types: Array.from(vulnerabilityTypes),
      risk_score: riskScore,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Generate comprehensive report using AI
    console.log(
      `[VulnerabilityScan] Calling AI for comprehensive report generation`,
    );
    const scanSummary = await createScanSummary({
      ...scanRow,
      vulnerabilities: allVulnerabilities,
    } as ScanSummaryInput);

    console.log(
      `[VulnerabilityScan] AI summary generated (${
        scanSummary.result_summary?.length || 0
      } chars)`,
    );

    // Update the scan record with the final summary
    const finalScanData: Partial<ScanRow> = {
      ...scanSummary,
      progress_percentage: 100,
      status: "completed",
      current_stage: "completed",
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from("scans")
      .update(finalScanData)
      .eq("id", scanId);

    if (updateError) {
      console.error(
        `[VulnerabilityScan] Error updating final scan data:`,
        updateError,
      );
      await updateLogs(
        `Error updating final scan data: ${updateError.message}`,
      );
    } else {
      console.log(`[VulnerabilityScan] Scan ${scanId} completed successfully`);
      await updateLogs("Scan completed successfully", "completed");
    }

    // Return the complete scan row
    return {
      ...scanRow,
      ...finalScanData,
    };
  } catch (error) {
    // Handle errors in the scan process
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    console.error(`[VulnerabilityScan] Scan ${scanId} failed:`, error);
    await updateLogs(`Scan failed: ${errorMessage}`, "failed");

    await supabase
      .from("scans")
      .update({
        status: "failed",
        current_stage: "failed",
        result_summary: `Scan failed: ${errorMessage}`,
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .eq("id", scanId);

    throw error;
  }
}
