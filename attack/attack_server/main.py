import subprocess
import threading
import time
import signal
import os
from vulnerability_tester import VulnerabilityTester


def run_server():
    subprocess.run(["python3", "/Users/user-pc/Desktop/camel_hack/attack/demo_non_protected/main.py"])


if __name__ == "__main__":
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    time.sleep(2)
    tester = VulnerabilityTester(base_url="http://127.0.0.1:5000")
    vulnerabilities = [
        {"endpoint": "/users", "expected_status": 200},
        {"endpoint": "/user/1", "expected_status": 401},  # Should be unauthorized
    ]
    results = tester.run_tests(vulnerabilities)
    
    print("Vulnerability Test Results:", results)
    
    # Send kill signal to the process
    os.kill(os.getpid(), signal.SIGTERM)
    # Wait for thread to complete
    server_thread.join()