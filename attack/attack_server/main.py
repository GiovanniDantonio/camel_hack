import subprocess
import threading
import time
import signal
import os
from vulnerability_tester import VulnerabilityTester
from structs import Vulnerability, HTTPMethod, VulnerabilityType, Severity, Matcher, MatcherType

# PARAMS


# ANSI color codes for severity levels
RESET_COLOR = "\033[0m"
COLOR_MAP = {
    Severity.LOW: "\033[92m",    # Green
    Severity.MEDIUM: "\033[93m", # Yellow
    Severity.HIGH: "\033[91m",   # Red
    Severity.CRITICAL: "\033[95m" # Magenta
}

def run_server(run_command: str):
    subprocess.run(run_command.split(' '))

def scan_server(url: str, run_command: str):
    print("*** Starting Vulnerability Test ***")
    print("*** Starting Server ***")
    server_thread = threading.Thread(target=run_server, daemon=True, args=(run_command,))
    server_thread.start()
    time.sleep(2)
    tester = VulnerabilityTester(base_url=url)
    
    vulnerabilities = [
        Vulnerability(
            endpoint="/users",
            method=HTTPMethod.GET,
            vulnerability_type=VulnerabilityType.AUTH_BYPASS,
            expected_status=200,
            payloads=[],
            description="Test for unauthorized access to user list",
            severity="MEDIUM",
            cwe_id="CWE-306",
            remediation="Implement proper authentication checks",
            matchers=[Matcher(type=MatcherType.STATUS_CODE, expected_status=200)]
        ),
        Vulnerability(
            endpoint="/user/1",
            method=HTTPMethod.GET,
            vulnerability_type=VulnerabilityType.IDOR,
            expected_status=401,
            payloads=[],
            description="Test for Insecure Direct Object Reference",
            severity="HIGH",
            cwe_id="CWE-639",
            remediation="Implement proper authorization checks",
            matchers=[Matcher(type=MatcherType.STATUS_CODE, expected_status=401)]
        ),
    ]
    
    results = tester.run_tests(vulnerabilities)
    
    print("*** Finished Vulnerability Test ***")
    for result in [result for result in results if result.is_vulnerable]:
        color = COLOR_MAP.get(result.severity, "")
        print(f"{color}Vulnerability found: {result.vulnerability_type} on {result.endpoint} Severity: {result.severity} Description: {result.description} CWE ID: {result.cwe_id} Remediation: {result.remediation}{RESET_COLOR}")

    print("*** Killing Server ***")
    # Send kill signal to the process
    os.kill(os.getpid(), signal.SIGTERM)
    # Wait for thread to complete
    server_thread.join()

if __name__ == "__main__":
    scan_server(url="http://127.0.0.1:5000", run_command="python3 /Users/user-pc/Desktop/camel_hack/attack/demo_non_protected/main.py")