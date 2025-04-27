from flask import Flask, request, jsonify, Response
import logging
import os
import json
import subprocess
import tempfile
import shutil
import time
from flask_cors import CORS # Import CORS

# Import necessary components from ai_tester and structs
from structs import ScanReport, VulnerabilityTestResult # Assuming structs.py is in the same directory or accessible
from ai_tester import run_scan_tests, AI_MODEL, API_KEY # Import the core function
from pydantic import ValidationError

# --- Flask App Setup ---
app = Flask(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
CORS(app) # Enable CORS for all routes

# Check for OpenAI API Key on startup
if not API_KEY:
    logging.error("FATAL: OPENAI_API_KEY environment variable not set. Flask server cannot start.")
    # In a real app, you might exit or prevent starting
    # For now, just log the error.

# --- API Endpoints ---

@app.route('/test', methods=['POST'])
def handle_test_request():
    """Receives a scan report JSON and runs AI vulnerability tests synchronously."""
    if not API_KEY:
        return jsonify({"error": "Server configuration error: OpenAI API key not set."}), 500

    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    
    # Extract scan report and optional limit
    scan_report_data = data.get('scan_report')
    query_limit = data.get('query_limit', 3) # Default limit if not provided

    if not scan_report_data:
        return jsonify({"error": "Missing 'scan_report' in request body"}), 400
    
    try:
        # Validate the scan report structure
        scan_report = ScanReport(**scan_report_data)
    except ValidationError as e:
        logging.error(f"Scan report validation failed: {e}")
        return jsonify({"error": "Invalid scan_report format", "details": e.errors()}), 400
    except Exception as e:
        logging.error(f"Error processing scan report data: {e}")
        return jsonify({"error": "Could not process scan_report data"}), 400

    try:
        logging.info(f"Received test request for scan_id: {scan_report.scan_metadata.scan_id}")
        # Call the core testing logic from ai_tester
        results_generator = run_scan_tests(scan_report, query_limit)
        results_list = list(results_generator) # Consume the generator
        
        # Convert results to JSON-serializable format
        results_dict = [r.model_dump(mode='json') for r in results_list]
        
        logging.info(f"Finished tests for scan_id: {scan_report.scan_metadata.scan_id}")
        return jsonify({"results": results_dict}), 200

    except Exception as e:
        logging.error(f"Error during run_scan_tests for scan_id {scan_report.scan_metadata.scan_id}: {e}", exc_info=True)
        return jsonify({"error": "An internal error occurred during vulnerability testing."}), 500

@app.route('/test-stream', methods=['POST']) # Use POST to send report easily
def handle_test_stream_request():
    """Receives scan report JSON, runs tests, and streams results via SSE."""
    if not API_KEY:
        # SSE error handling is tricky, client just disconnects.
        # Log error server-side.
        logging.error("SSE Request Error: OpenAI API key not set.")
        return Response("data: {\"error\": \"Server configuration error: OpenAI API key not set.\"}\n\n", mimetype='text/event-stream')

    if not request.is_json:
        logging.error("SSE Request Error: Payload not JSON")
        return Response("data: {\"error\": \"Request must be JSON\"}\n\n", mimetype='text/event-stream')

    data = request.get_json()
    scan_report_data = data.get('scan_report')
    query_limit = data.get('query_limit', 3)
    git_url = data.get('git_url')
    run_command = data.get('run_command')

    if not scan_report_data:
        logging.error("SSE Request Error: Missing scan_report")
        return Response("data: {\"error\": \"Missing 'scan_report' in request body\"}\n\n", mimetype='text/event-stream')

    if not git_url:
        logging.error("SSE Request Error: Missing git_url")
        return Response(f"data: {json.dumps({'error': 'Missing git_url in request body'})}\n\n", mimetype='text/event-stream')

    if not run_command:
        logging.error("SSE Request Error: Missing run_command")
        return Response(f"data: {json.dumps({'error': 'Missing run_command in request body'})}\n\n", mimetype='text/event-stream')

    try:
        scan_report = ScanReport(**scan_report_data)
    except Exception as e:
        logging.error(f"SSE Request Error: Invalid scan_report format: {e}")
        return Response(f"data: {json.dumps({'error': 'Invalid scan_report format', 'details': str(e)})}\n\n", mimetype='text/event-stream')

    def generate_results():
        temp_dir = None
        server_process = None
        try:
            # 1. Clone Git Repository
            yield f"event: status\ndata: {json.dumps({'message': f'Cloning repository {git_url}...'})}\n\n"
            temp_dir = tempfile.mkdtemp()
            logging.info(f"Cloning {git_url} into {temp_dir}")
            clone_command = ["git", "clone", git_url, temp_dir]
            clone_result = subprocess.run(clone_command, capture_output=True, text=True)

            if clone_result.returncode != 0:
                error_msg = f"Git clone failed. Return code: {clone_result.returncode}. Stderr: {clone_result.stderr[:500]}"
                logging.error(error_msg)
                yield f"event: error\ndata: {json.dumps({'error': 'Git clone failed', 'details': error_msg})}\n\n"
                return # Stop generation

            yield f"event: status\ndata: {json.dumps({'message': 'Repository cloned successfully.'})}\n\n"

            # 2. Run Server Command Asynchronously
            yield f"event: status\ndata: {json.dumps({'message': f'Executing server command: {run_command}...'})}\n\n"
            logging.info(f"Running server command '{run_command}' in {temp_dir}")
            # Use Popen to run in background. shell=True is often needed for complex commands,
            # but be mindful of security if run_command is user-controlled in a real system.
            server_process = subprocess.Popen(run_command, shell=True, cwd=temp_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

            # Brief pause to allow server to start
            time.sleep(2) # Wait 2 seconds as requested
            
            # Check if process started and didn't immediately exit with an error
            poll_result = server_process.poll()
            if poll_result is not None:
                 # Process terminated early
                 _, stderr_output = server_process.communicate() # Get output
                 error_msg = f"Server command '{run_command}' failed to start or exited prematurely. Exit code: {poll_result}. Stderr: {stderr_output[:500]}"
                 logging.error(error_msg)
                 yield f"event: error\ndata: {json.dumps({'error': 'Server command failed', 'details': error_msg})}\n\n"
                 return # Stop generation
            
            yield f"event: status\ndata: {json.dumps({'message': 'Server started (process launched). Waiting before test...'})}\n\n"
            # Optional: Could add more sophisticated server health check here instead of just sleep

            # 3. Run Vulnerability Tests
            # Ensure ai_tester uses the correct target_url_base from the report
            yield f"event: status\ndata: {json.dumps({'message': 'Starting vulnerability analysis...'})}\n\n"
            for item in run_scan_tests(scan_report, query_limit):
                # Format for SSE: data: <json_string>\n\n
                if isinstance(item, dict) and item.get("type") == "status":
                    # Send as a custom 'status' event
                    status_data = json.dumps({"message": item.get("message", "")})
                    yield f"event: status\ndata: {status_data}\n\n"
                elif isinstance(item, VulnerabilityTestResult):
                    # Send actual results as default 'data' event
                    result_json = item.model_dump_json()
                    yield f"data: {result_json}\n\n"
                else:
                    # Log unexpected item type if necessary
                    logging.warning(f"run_scan_tests yielded unexpected type: {type(item)}")

            # Signal end (optional)
            yield f"event: end\ndata: {{}}\n\n"
        except Exception as e:
            error_context = f"scan_id {scan_report.scan_metadata.scan_id if scan_report else 'N/A'}"
            logging.error(f"Error during streaming for {error_context}: {e}", exc_info=True)
            # Send an error event
            error_data = json.dumps({"error": "An internal error occurred during streaming.", "details": str(e)})
            yield f"event: error\ndata: {error_data}\n\n"
        finally:
            # 4. Cleanup
            if server_process and server_process.poll() is None: # Check if process is still running
                yield f"event: status\ndata: {json.dumps({'message': 'Terminating server process...'})}\n\n"
                logging.info(f"Terminating server process (PID: {server_process.pid})")
                try:
                    server_process.terminate() # Try graceful termination first
                    server_process.wait(timeout=5) # Wait a bit
                except subprocess.TimeoutExpired:
                    logging.warning("Server process did not terminate gracefully, killing.")
                    server_process.kill() # Force kill if terminate fails
                except Exception as term_err:
                    logging.error(f"Error terminating server process: {term_err}")
            
            if temp_dir and os.path.exists(temp_dir):
                yield f"event: status\ndata: {json.dumps({'message': 'Cleaning up temporary directory...'})}\n\n"
                logging.info(f"Removing temporary directory: {temp_dir}")
                try:
                    shutil.rmtree(temp_dir)
                except Exception as clean_err:
                    logging.error(f"Error cleaning up temp directory {temp_dir}: {clean_err}")
            
            yield f"event: status\ndata: {json.dumps({'message': 'Cleanup complete.'})}\n\n"
            
    return Response(generate_results(), mimetype='text/event-stream')


def kill_port(port):
    try:
        # Find process using port
        result = subprocess.run(['lsof', '-i', f':{port}'], capture_output=False, text=True)
        if result.stdout:
            # Get the PID from the output
            lines = result.stdout.strip().split('\n')
            if len(lines) > 1:  # Skip header line
                pid = lines[1].split()[1]
                # Kill the process
                subprocess.run(['kill', '-9', pid])
                print(f"Killed process {pid} running on port {port}")
    except Exception as e:
        print(f"Error killing port {port}: {e}")

# --- Run Server ---
if __name__ == '__main__':
    # Make sure to set the host and port as needed
    # Use 0.0.0.0 to make it accessible externally (e.g., from Docker)
    kill_port(5000)
    app.run(host='0.0.0.0', port=5005, debug=False) 