import { Database } from "@/types/database.types";
import { AIService, Models } from "../../../../ai";
import {
  computeEndpointVulnerabilities,
  computeEndpointVulnerabilityDetails,
  endpointVulnerabilities,
  endpointVulnerabilityDetails,
} from "@/lib/constants/endpoint-vulnerabilities";

type ScanRow = Database["public"]["Tables"]["scans"]["Row"];
type Vulnerability = Database["public"]["Tables"]["vulnerabilities"]["Row"];

interface ScanSummaryInput extends ScanRow {
  vulnerabilities: Vulnerability[];
}

/**
 * Creates a comprehensive summary of a vulnerability scan using AI
 *
 * @param scan - The scan data including all detected vulnerabilities
 * @returns Updated scan data with summary fields filled
 */
export async function createScanSummary(
  scan: ScanSummaryInput,
): Promise<Partial<ScanRow>> {
  console.log(`[ScanSummary] Creating summary for scan ${scan.id}`);

  // If no vulnerabilities, create a simple summary
  if (!scan.vulnerabilities || scan.vulnerabilities.length === 0) {
    console.log(`[ScanSummary] No vulnerabilities to summarize`);
    return {
      result_summary: "No vulnerabilities detected in this scan.",
      risk_score: 0,
    };
  }

  console.log(
    `[ScanSummary] Summarizing ${scan.vulnerabilities.length} vulnerabilities`,
  );

  // Persist endpoint ➜ vulnerability mappings for downstream use
  // ---------------------------------------------------------------------------
  const highLevelList = computeEndpointVulnerabilities(scan.vulnerabilities as any);
  const detailedList = computeEndpointVulnerabilityDetails(scan.vulnerabilities as any);

  // Replace contents of the shared in-memory stores
  endpointVulnerabilities.splice(0, endpointVulnerabilities.length, ...highLevelList);
  endpointVulnerabilityDetails.splice(0, endpointVulnerabilityDetails.length, ...detailedList);

  console.log(
    `[ScanSummary] Stored ${highLevelList.length} endpoint pairs and ${detailedList.length} detailed mappings`,
  );

  // Inspect populated lists
  console.log('[ScanSummary] endpointVulnerabilities:', JSON.stringify(endpointVulnerabilities, null, 2));
  console.log('[ScanSummary] endpointVulnerabilityDetails:', JSON.stringify(endpointVulnerabilityDetails, null, 2));

  // Get the AI service instance
  const aiService = AIService.getInstance();

  // Group vulnerabilities by severity
  const vulnsBySeverity = {
    critical: scan.vulnerabilities.filter((v) => v.severity === "critical"),
    high: scan.vulnerabilities.filter((v) => v.severity === "high"),
    medium: scan.vulnerabilities.filter((v) => v.severity === "medium"),
    low: scan.vulnerabilities.filter((v) => v.severity === "low"),
  };

  console.log(
    `[ScanSummary] Severity breakdown - Critical: ${vulnsBySeverity.critical.length}, High: ${vulnsBySeverity.high.length}, Medium: ${vulnsBySeverity.medium.length}, Low: ${vulnsBySeverity.low.length}`,
  );

  // Count vulnerabilities by type
  const vulnTypeCounts: Record<string, number> = {};
  scan.vulnerabilities.forEach((vuln) => {
    const type = vuln.title.split(":")[0].trim();
    vulnTypeCounts[type] = (vulnTypeCounts[type] || 0) + 1;
  });

  console.log(
    `[ScanSummary] Vulnerability types: ${
      Object.keys(vulnTypeCounts).join(", ")
    }`,
  );

  // Get top 5 most severe vulnerabilities for detailed report
  const topVulnerabilities = [
    ...vulnsBySeverity.critical,
    ...vulnsBySeverity.high,
    ...vulnsBySeverity.medium,
    ...vulnsBySeverity.low,
  ].slice(0, 5);

  console.log(
    `[ScanSummary] Selected ${topVulnerabilities.length} top vulnerabilities for detailed report`,
  );

  // Prepare detailed vulnerability information for the prompt
  const vulnDetails = topVulnerabilities.map((vuln, index) => `
Vulnerability ${index + 1}:
- Title: ${vuln.title}
- Severity: ${vuln.severity}
- Location: ${vuln.file_path}:${vuln.line_start}-${vuln.line_end}
- Description: ${vuln.description}
- Code: ${vuln.code_snippet_lines ? vuln.code_snippet_lines.join('\n') : 'No code snippet available'}
- Remediation: ${vuln.remediation}
`).join("\n");

  console.log(`[ScanSummary] Building prompt for AI analysis`);

  // Construct the prompt for the AI
  const prompt = `
You are a security expert analyzing the results of a code security scan. Here's a summary of the scan:

Project ID: ${scan.project_id}
Files Scanned: ${scan.files_scanned}
Total Vulnerabilities: ${scan.vulnerabilities.length}
Severity Breakdown:
- Critical: ${vulnsBySeverity.critical.length}
- High: ${vulnsBySeverity.high.length}
- Medium: ${vulnsBySeverity.medium.length}
- Low: ${vulnsBySeverity.low.length}

Vulnerability Types:
${
    Object.entries(vulnTypeCounts).map(([type, count]) => `- ${type}: ${count}`)
      .join("\n")
  }

Most Critical Vulnerabilities:
${vulnDetails}

Based on this information, please provide:
1. A concise executive summary (2-3 paragraphs) of the scan results
2. An assessment of the overall security risk
3. Prioritized recommendations for remediation

Format your response as a single continuous text with clear sections. Keep it factual, detailed but concise, and provide specific actionable insights.
`;

  try {
    console.log(`[ScanSummary] Calling AI service with OAI model`);

    // Get the OpenAI service from our AI service
    const openaiService = aiService.getService(Models.OpenAI.GPT_4o);
    
    // Call the AI model to generate the summary
    const completion = await openaiService.createCompletion(
      Models.OpenAI.GPT_4o,
      {
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
      }
    );

    const resultSummary = completion.choices[0]?.message?.content ||
      "Failed to generate summary. Please review the raw scan results.";

    console.log(
      `[ScanSummary] Received AI response (${resultSummary.length} chars)`,
    );
    console.log(
      `[ScanSummary] Summary preview: ${resultSummary.substring(0, 100)}...`,
    );

    return {
      result_summary: resultSummary,
      // We calculate risk score in the main function, so just pass it through
      risk_score: scan.risk_score,
    };
  } catch (error) {
    console.error("[ScanSummary] Error generating scan summary:", error);

    // Create a basic summary when AI fails
    const fallbackSummary =
      `Scan completed with ${scan.vulnerabilities.length} vulnerabilities found.
Critical: ${vulnsBySeverity.critical.length}, High: ${vulnsBySeverity.high.length}, 
Medium: ${vulnsBySeverity.medium.length}, Low: ${vulnsBySeverity.low.length}.
Could not generate detailed summary due to an error.`;

    console.log(`[ScanSummary] Using fallback summary due to API error`);

    return {
      result_summary: fallbackSummary,
      risk_score: scan.risk_score,
    };
  }
}
