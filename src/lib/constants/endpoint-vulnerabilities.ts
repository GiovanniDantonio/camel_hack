/*
 * Endpoint Vulnerability Lists
 * ----------------------------
 * This module centralizes static data structures that map API endpoints to
 * discovered vulnerabilities.  It is intentionally **pure**: the data
 * structures are simple JavaScript objects so that they can be imported and
 * extended anywhere in the code-base without introducing hidden side-effects
 * or runtime dependencies.
 *
 * List #1 – `endpointVulnerabilities`
 *   A high-level mapping of `{ endpoint, vulnerability }` pairs.  Use this when
 *   you only need to know *that* a given endpoint is affected by a
 *   vulnerability but do not care *where* in the source code the flaw lives.
 *
 * List #2 – `endpointVulnerabilityDetails`
 *   A more granular mapping that additionally tracks the filename that holds
 *   the vulnerable code and the exact (1-based) line numbers where the problem
 *   occurs.  This is useful for tools such as the code viewer or automated
 *   remediation pipelines that need to surface the vulnerable fragment
 *   directly to the developer.
 *
 * NOTE:  Both lists start out **empty** – they will be populated at runtime by
 *        the scanning pipeline.  Keeping the initial state empty avoids stale
 *        data in production and ensures we do not violate YAGNI.
 */

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

/**
 * Minimal mapping of an endpoint to a vulnerability type.
 */
export interface EndpointVulnerability {
  /** REST/GraphQL endpoint, e.g. `/api/projects/:id` */
  endpoint: string;
  /** Short vulnerability label, e.g. `sql_injection` */
  vulnerability: string;
}

/**
 * Extended mapping that also captures the file that contains the vulnerable
 * code along with the relevant source-line numbers.
 */
export interface EndpointVulnerabilityDetail extends EndpointVulnerability {
  /** Relative file path within the repository */
  file_path: string;
  /** One-based line numbers that exhibit the vulnerability */
  lines: number[];
}

// ---------------------------------------------------------------------------
// Data Stores (initially empty)
// ---------------------------------------------------------------------------

/**
 * High-level list of endpoint-to-vulnerability pairs.
 * Populated dynamically by the vulnerability-scanner service.
 */
export const endpointVulnerabilities: EndpointVulnerability[] = [];

/**
 * Detailed list of endpoint-to-vulnerability mappings with file context.
 */
export const endpointVulnerabilityDetails: EndpointVulnerabilityDetail[] = [];

import { Database } from "@/types/database.types";

// Internal type alias for vulnerability row
export type VulnerabilityRow = Database["public"]["Tables"]["vulnerabilities"]["Row"];

/**
 * Convert a file path under src/app to a Next.js route pattern.
 * Returns null for non-route files.
 */
function filePathToEndpoint(filePath: string): string | null {
  const segments = filePath.split("/");
  const appIndex = segments.findIndex(s => s === "app");
  if (appIndex === -1) return null;
  const relevant = segments.slice(appIndex + 1);
  if (relevant[0] === "api") {
    const rest = relevant.slice(1).filter(seg => seg !== "route.ts");
    return "/api/" + rest.map(seg =>
      seg.startsWith("[") && seg.endsWith("]")
        ? `:${seg.slice(1,-1)}`
        : seg
    ).join("/");
  } else {
    const pages = relevant.filter(seg => seg !== "page.tsx");
    return "/" + pages.map(seg =>
      seg.startsWith("[") && seg.endsWith("]")
        ? `:${seg.slice(1,-1)}`
        : seg
    ).join("/");
  }
}

/** Inclusive range of line numbers */
function inclusiveRange(start: number, end: number): number[] {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

/**
 * Compute high-level endpoint vulnerability list from raw vulnerabilities.
 */
export function computeEndpointVulnerabilities(vulns: VulnerabilityRow[]): EndpointVulnerability[] {
  const map = new Map<string, Set<string>>();
  for (const v of vulns) {
    // Skip if no file path
    if (!v.file_path) continue;
    const ep = filePathToEndpoint(v.file_path);
    if (!ep) continue;
    if (!map.has(ep)) map.set(ep, new Set());
    map.get(ep)!.add(v.title);
  }
  const result: EndpointVulnerability[] = [];
  for (const [ep, titles] of map) {
    for (const title of titles) {
      result.push({ endpoint: ep, vulnerability: title });
    }
  }
  return result;
}

/**
 * Compute detailed endpoint vulnerability list with file and lines context.
 */
export function computeEndpointVulnerabilityDetails(vulns: VulnerabilityRow[]): EndpointVulnerabilityDetail[] {
  const details: EndpointVulnerabilityDetail[] = [];
  for (const v of vulns) {
    // Ensure required fields are present
    if (!v.file_path || v.line_start == null || v.line_end == null) continue;
    const ep = filePathToEndpoint(v.file_path);
    if (!ep) continue;
    details.push({
      endpoint: ep,
      vulnerability: v.title,
      file_path: v.file_path,
      lines: inclusiveRange(v.line_start, v.line_end),
    });
  }
  return details;
}
