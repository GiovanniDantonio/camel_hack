from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ScanMetadata(BaseModel):
    scan_id: str
    timestamp: datetime
    source_details: str # e.g., codebase path, repo URL

class VulnerabilityIndication(BaseModel):
    id: str # Unique ID for this finding
    cwe_id: Optional[str] = None
    cve_id: Optional[str] = None
    description: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    endpoint: str
    method: str # e.g., GET, POST
    parameters: Optional[List[str]] = [] # Parameters involved
    potential_exploit_type: str # e.g., SQLi, XSS, RCE, IDOR
    target_url_base: str # Base URL of the running application to target

class ScanReport(BaseModel):
    scan_metadata: ScanMetadata
    vulnerabilities: List[VulnerabilityIndication]

class VulnerabilityTestResult(BaseModel):
    vuln_id: str
    success: bool
    queries_used: int
    error: Optional[str] = None # For reporting errors during testing
    final_command: Optional[str] = None
    final_stdout: Optional[str] = None
    final_stderr: Optional[str] = None
    ai_assessment_reasoning: Optional[str] = None # Last assessment reasoning from AI
    history: List[Dict[str, str]] # Full conversation history with AI for this vuln 