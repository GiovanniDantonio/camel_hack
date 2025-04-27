import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/cve/[id]
 * Fetches CVE data from the NIST NVD API
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cveId = params.id;

  // Validate CVE ID format
  const cveRegex = /^CVE-\d{4}-\d{4,}$/;
  if (!cveRegex.test(cveId)) {
    return NextResponse.json(
      { error: 'Invalid CVE format. Expected format: CVE-YYYY-NNNNN' },
      { status: 400 }
    );
  }

  try {
    // Use the NIST NVD API to fetch CVE data
    // This is more reliable than the CVE Services API
    const response = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveId}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch CVE data: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Check if we found any vulnerabilities
    if (!data.vulnerabilities || data.vulnerabilities.length === 0) {
      return NextResponse.json(
        { error: `CVE ${cveId} not found` },
        { status: 404 }
      );
    }
    
    // Extract the CVE data from the response
    const cveData = data.vulnerabilities[0].cve;
    
    // Get the description - NVD provides descriptions in multiple languages
    let description = 'No description available';
    if (cveData.descriptions && cveData.descriptions.length > 0) {
      // Try to find an English description first
      const englishDesc = cveData.descriptions.find((d: { lang: string; value: string }) => d.lang === 'en');
      description = englishDesc ? englishDesc.value : cveData.descriptions[0].value;
    }
    
    // Create a meaningful name from the CVE ID if no title is available
    const name = `${cveId}: ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`;

    console.log('Found CVE data:', { cveId, name, description });
    
    return NextResponse.json({
      cveId,
      name,
      description
    });
  } catch (error) {
    console.error('Error fetching CVE data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CVE data' },
      { status: 500 }
    );
  }
}
