from flask import Flask, request, jsonify, Response
import logging
import os
import json
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

    if not scan_report_data:
        logging.error("SSE Request Error: Missing scan_report")
        return Response("data: {\"error\": \"Missing 'scan_report' in request body\"}\n\n", mimetype='text/event-stream')

    try:
        scan_report = ScanReport(**scan_report_data)
    except Exception as e:
        logging.error(f"SSE Request Error: Invalid scan_report format: {e}")
        return Response(f"data: {json.dumps({'error': 'Invalid scan_report format', 'details': str(e)})}\n\n", mimetype='text/event-stream')

    def generate_results():
        try:
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
            logging.error(f"Error during streaming for scan_id {scan_report.scan_metadata.scan_id}: {e}", exc_info=True)
            # Send an error event
            error_data = json.dumps({"error": "An internal error occurred during streaming.", "details": str(e)})
            yield f"event: error\ndata: {error_data}\n\n"
            
    return Response(generate_results(), mimetype='text/event-stream')

# --- Run Server ---
if __name__ == '__main__':
    # Make sure to set the host and port as needed
    # Use 0.0.0.0 to make it accessible externally (e.g., from Docker)
    app.run(host='0.0.0.0', port=5005, debug=False) 