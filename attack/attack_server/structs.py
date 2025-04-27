from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Literal
from enum import Enum
from datetime import datetime

class MatcherType(str, Enum):
    STATUS_CODE = "STATUS_CODE"
    CONTAINS = "CONTAINS"
    REGEX = "REGEX"

class Matcher(BaseModel):
    type: MatcherType
    expected_status: Optional[int] = None
    value: Optional[str] = None
    negate: bool = False

class HTTPMethod(str, Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    PATCH = "PATCH"

class VulnerabilityType(str, Enum): 
    SQL_INJECTION = "SQL_INJECTION"
    XSS = "XSS"
    CSRF = "CSRF"
    AUTH_BYPASS = "AUTH_BYPASS"
    IDOR = "IDOR"
    RCE = "RCE"
    LFI = "LFI"
    RFI = "RFI"
    XXE = "XXE"
    SSRF = "SSRF"

class Severity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class PayloadResult(BaseModel):
    payload: str
    status_code: int
    vulnerable: bool
    response_time: float
    response_length: int
    response_headers: Dict[str, str]
    error: Optional[str] = None
    timestamp: datetime = datetime.now()

class VulnerabilityTestResult(BaseModel):
    endpoint: str
    method: HTTPMethod
    vulnerability_type: VulnerabilityType
    description: str
    severity: Severity
    cwe_id: Optional[str]
    remediation: Optional[str]
    results: List[PayloadResult]
    start_time: datetime = datetime.now()
    end_time: Optional[datetime] = None
    total_payloads: int
    successful_payloads: int
    failed_payloads: int
    average_response_time: float
    is_vulnerable: bool

    def __init__(self, **data):
        super().__init__(**data)
        self.end_time = datetime.now()
        self.total_payloads = len(self.results)
        self.successful_payloads = sum(1 for r in self.results if r.vulnerable)
        self.failed_payloads = self.total_payloads - self.successful_payloads
        self.average_response_time = sum(r.response_time for r in self.results) / self.total_payloads if self.total_payloads > 0 else 0
        self.is_vulnerable = any(r.vulnerable for r in self.results)

class Vulnerability(BaseModel):
    endpoint: str
    method: HTTPMethod
    vulnerability_type: VulnerabilityType
    expected_status: int
    payloads: List[str]
    headers: Optional[Dict[str, str]] = None
    cookies: Optional[Dict[str, str]] = None
    params: Optional[Dict[str, Any]] = None
    data: Optional[Dict[str, Any]] = None
    json: Optional[Dict[str, Any]] = None
    auth: Optional[Dict[str, str]] = None
    timeout: Optional[int] = 5
    verify_ssl: bool = False
    follow_redirects: bool = True
    description: str
    severity: Severity
    cwe_id: Optional[str] = None
    remediation: Optional[str] = None
    matchers: List[Matcher]
    match_logic: Literal["ANY", "ALL"] = "ANY"