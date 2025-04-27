import os
import json
import subprocess
import argparse
from typing import List, Dict, Optional, Tuple
from openai import OpenAI, BadRequestError
from pydantic import ValidationError
from structs import ScanReport, VulnerabilityIndication, VulnerabilityTestResult
import logging

# --- Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# Ensure the OpenAI API key is set as an environment variable 'OPENAI_API_KEY'
API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable not set.")

client = OpenAI(api_key=API_KEY)
AI_MODEL = "gpt-4o-mini" # Or your preferred model

# --- Helper Functions ---

def call_openai(prompt: str, context_messages: List[Dict[str, str]] = []) -> Optional[str]:
    """Sends a prompt to the OpenAI API and returns the response content."""
    messages = context_messages + [{"role": "user", "content": prompt}]
    try:
        response = client.chat.completions.create(
            model=AI_MODEL,
            messages=messages
        )
        return response.choices[0].message.content
    except BadRequestError as e:
        logging.error(f"OpenAI API request failed (Bad Request): {e}")
        if "context_length_exceeded" in str(e):
             logging.error("Context length exceeded. Consider reducing history or prompt size.")
        return None
    except Exception as e:
        logging.error(f"OpenAI API request failed: {e}")
        return None

def parse_command_from_ai(response: str) -> Optional[str]:
    """Extracts a command (e.g., curl) from the AI's response."""
    # Simple parsing: Look for a line starting with 'Command:'
    # or code blocks. More robust parsing might be needed.
    lines = response.strip().split('\n')
    for line in lines:
        if line.lower().startswith("command:"):
            return line[len("command:"):].strip()
    # Look for bash/shell code blocks
    if "```bash" in response:
        start = response.find("```bash") + len("```bash")
        end = response.find("```", start)
        if end != -1:
            return response[start:end].strip()
    if "```shell" in response:
        start = response.find("```shell") + len("```shell")
        end = response.find("```", start)
        if end != -1:
            return response[start:end].strip()
    logging.warning(f"Could not parse command from AI response: {response}")
    return None

def parse_assessment_from_ai(response: str) -> Optional[bool]:
    """Parses the AI's success/failure assessment."""
    response_lower = response.lower()
    if "assessment: success" in response_lower or "attack successful" in response_lower:
        return True
    if "assessment: failure" in response_lower or "attack failed" in response_lower:
        return False
    logging.warning(f"Could not parse assessment from AI response: {response}")
    return None

def parse_suggestion_from_ai(response: str) -> str:
    """Parses the AI's suggestion for the next step."""
    # Look for lines indicating giving up or suggesting modifications
    response_lower = response.lower()
    if "suggestion: give up" in response_lower or "no further suggestions" in response_lower:
        return "GIVE_UP"
    # Find the suggestion part
    suggestion_marker = "suggestion:"
    if suggestion_marker in response_lower:
        start_index = response_lower.find(suggestion_marker) + len(suggestion_marker)
        return response[start_index:].strip()
    # If no specific suggestion found, return the whole response for context
    return response # Return the full response if specific markers aren't found

def run_command(command: str) -> Tuple[int, str, str]:
    """Runs a shell command and returns status code, stdout, and stderr."""
    logging.info(f"Executing command: {command}")
    try:
        # Use shell=True cautiously, ensure commands from AI are somewhat trustworthy
        # or add more sanitization. Splitting might be safer if possible.
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=30)
        logging.debug(f"Command stdout:\n{result.stdout}")
        logging.debug(f"Command stderr:\n{result.stderr}")
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        logging.warning(f"Command timed out: {command}")
        return -1, "", "TimeoutExpired"
    except Exception as e:
        logging.error(f"Failed to execute command '{command}': {e}")
        return -1, "", str(e)

# --- Core Logic ---

def test_vulnerability(vuln: VulnerabilityIndication, query_limit: int) -> VulnerabilityTestResult:
    """Attempts to test a single vulnerability using AI guidance."""
    logging.info(f"--- Testing Vulnerability: {vuln.id} ({vuln.potential_exploit_type} on {vuln.endpoint}) --- ")
    
    query_count = 0
    history = [] # Keep track of the conversation with the AI for this vulnerability
    last_command = None
    last_response_stdout = None
    last_response_stderr = None
    suggestion = f"Initial attempt for {vuln.potential_exploit_type}"

    while query_count < query_limit:
        # 1. Generate Test Command
        prompt_cmd = f"""
        Based on the following vulnerability details, generate a *single*, specific command-line command (e.g., using curl, wget) to test or exploit it.
        Focus on common and easily testable techniques for the indicated type.
        Provide *only* the command, prefixed with 'Command:'.

        Vulnerability Details:
        - Type: {vuln.potential_exploit_type}
        - Endpoint: {vuln.endpoint}
        - Method: {vuln.method}
        - Base URL: {vuln.target_url_base}
        - Parameters: {', '.join(vuln.parameters) if vuln.parameters else 'None'}
        - Description: {vuln.description}
        - Previous Attempt Context: {suggestion}

        Format the output strictly as:
        Command: <your command here>
        """
        logging.info(f"Query {query_count + 1}/{query_limit}: Requesting command...")
        ai_response_cmd = call_openai(prompt_cmd, history)
        query_count += 1
        if not ai_response_cmd:
            logging.error("Failed to get command generation response from AI.")
            break 
        history.append({"role": "user", "content": prompt_cmd})
        history.append({"role": "assistant", "content": ai_response_cmd})

        command = parse_command_from_ai(ai_response_cmd)
        if not command:
            logging.warning("AI did not provide a valid command. Stopping test for this vulnerability.")
            break
        last_command = command

        # 2. Execute Command
        return_code, stdout, stderr = run_command(command)
        last_response_stdout = stdout
        last_response_stderr = stderr

        if return_code == -1 and stderr == "TimeoutExpired":
             suggestion = "Previous command timed out. Try a faster or different approach."
             continue # Skip assessment and ask for a new command directly

        # 3. Analyze Result
        prompt_assess = f"""
        I executed the following command to test the vulnerability ({vuln.potential_exploit_type} on {vuln.endpoint}):
        Command: {command}

        Here is the result:
        - Return Code: {return_code}
        - Standard Output:
        {stdout[:1000]} {'...' if len(stdout) > 1000 else ''}
        - Standard Error:
        {stderr[:1000]} {'...' if len(stderr) > 1000 else ''}

        Based *only* on this command output, assess if the vulnerability test/exploit likely succeeded.
        Look for common indicators of success for {vuln.potential_exploit_type} (e.g., specific error messages for SQLi, reflected input for XSS, expected data for IDOR, unexpected output for RCE).

        Format the output strictly as:
        Assessment: <Success/Failure>
        Reasoning: <Brief explanation of why you think it succeeded or failed>
        """
        logging.info(f"Query {query_count + 1}/{query_limit}: Requesting assessment...")
        ai_response_assess = call_openai(prompt_assess, history)
        query_count += 1
        if not ai_response_assess:
             logging.error("Failed to get assessment response from AI.")
             break
        history.append({"role": "user", "content": prompt_assess})
        history.append({"role": "assistant", "content": ai_response_assess})

        assessment = parse_assessment_from_ai(ai_response_assess)

        if assessment is True:
            logging.info(f"Vulnerability {vuln.id} test SUCCESSFUL.")
            return VulnerabilityTestResult(
                vuln_id=vuln.id,
                success=True,
                final_command=command,
                final_stdout=stdout,
                final_stderr=stderr,
                queries_used=query_count,
                ai_assessment_reasoning=ai_response_assess, # Include AI reasoning
                history=history
            )

        # 4. Ask for Modification (if not successful and limit not reached)
        if query_count >= query_limit:
            logging.warning(f"Query limit reached for vulnerability {vuln.id}.")
            break

        prompt_suggest = f"""
        The previous attempt to test the vulnerability ({vuln.potential_exploit_type} on {vuln.endpoint}) failed or was inconclusive.

        Last Command: {command}
        Last Response Status Code: {return_code}
        Last Response Output (stdout snippet): {stdout[:200]}...
        Last Response Error (stderr snippet): {stderr[:200]}...
        AI Assessment of Last Attempt: {ai_response_assess}

        Based on this, suggest ONE specific modification to the command or a completely different command-line approach to try next.
        If you believe further attempts are unlikely to succeed with simple command-line tools, suggest giving up.

        Format the output strictly as:
        Suggestion: <Your detailed suggestion for the next command OR the phrase 'Give Up'>
        """
        logging.info(f"Query {query_count + 1}/{query_limit}: Requesting suggestion...")
        ai_response_suggest = call_openai(prompt_suggest, history)
        query_count += 1
        if not ai_response_suggest:
             logging.error("Failed to get suggestion response from AI.")
             break
        history.append({"role": "user", "content": prompt_suggest})
        history.append({"role": "assistant", "content": ai_response_suggest})

        suggestion = parse_suggestion_from_ai(ai_response_suggest)
        if suggestion == "GIVE_UP":
            logging.info(f"AI suggested giving up on vulnerability {vuln.id}.")
            break
        # Continue loop with the new suggestion as context

    # If loop finishes without success
    logging.info(f"Vulnerability {vuln.id} test FAILED or inconclusive after {query_count} queries.")
    return {
        "vuln_id": vuln.id,
        "success": False,
        "final_command": last_command,
        "final_stdout": last_response_stdout,
        "final_stderr": last_response_stderr,
        "queries_used": query_count,
        "ai_assessment_reasoning": history[-1]["content"] if history and history[-1]["role"] == "assistant" else "N/A"
    }


# --- Main Execution ---

def main():
    parser = argparse.ArgumentParser(description="Test vulnerabilities from a scan report using AI guidance.")
    parser.add_argument("report_file", help="Path to the JSON scan report file.")
    parser.add_argument("-l", "--limit", type=int, default=5, help="Maximum number of AI queries per vulnerability.")
    parser.add_argument("-o", "--output", help="Path to save the detailed test results (JSON).")

    args = parser.parse_args()

    # Load and validate report
    try:
        with open(args.report_file, 'r') as f:
            report_data = json.load(f)
        scan_report = ScanReport(**report_data)
        logging.info(f"Loaded scan report '{scan_report.scan_metadata.scan_id}' with {len(scan_report.vulnerabilities)} vulnerabilities.")
    except FileNotFoundError:
        logging.error(f"Error: Report file not found at {args.report_file}")
        return
    except json.JSONDecodeError:
        logging.error(f"Error: Could not decode JSON from {args.report_file}")
        return
    except ValidationError as e:
        logging.error(f"Error: Scan report validation failed:\n{e}")
        return
    except Exception as e:
         logging.error(f"An unexpected error occurred loading the report: {e}")
         return

    results = []
    for vuln in scan_report.vulnerabilities:
        # Add safety check for target_url_base if needed
        if not vuln.target_url_base or not vuln.target_url_base.startswith(('http://', 'https://')):
             logging.warning(f"Skipping vulnerability {vuln.id} due to invalid or missing target_url_base: {vuln.target_url_base}")
             results.append({
                 "vuln_id": vuln.id,
                 "success": False,
                 "error": "Invalid target_url_base"
             })
             continue

        result = test_vulnerability(vuln, args.limit)
        results.append(result)
        logging.info(f"Result for {vuln.id}: {'Success' if result['success'] else 'Failure'} ({result['queries_used']} queries)")
        print("-" * 30) # Separator

    # Print Summary
    successful_tests = sum(1 for r in results if r.get('success'))
    print("\n--- Test Summary ---")
    print(f"Total Vulnerabilities Processed: {len(results)}")
    print(f"Successful Tests: {successful_tests}")
    print(f"Failed/Inconclusive Tests: {len(results) - successful_tests}")

    # Save detailed results if output file specified
    if args.output:
        try:
            with open(args.output, 'w') as f:
                json.dump(results, f, indent=2)
            logging.info(f"Detailed test results saved to {args.output}")
        except Exception as e:
            logging.error(f"Failed to save results to {args.output}: {e}")


if __name__ == "__main__":
    main() 