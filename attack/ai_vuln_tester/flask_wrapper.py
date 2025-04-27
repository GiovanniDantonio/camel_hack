from flask import Flask, request, jsonify
import logging
import os

# Import necessary components from ai_tester and structs
from structs import ScanReport, VulnerabilityTestResult # Assuming structs.py is in the same directory or accessible
from ai_tester import run_scan_tests, AI_MODEL, API_KEY # Import the core function
from pydantic import ValidationError

# --- Flask App Setup ---
app = Flask(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Check for OpenAI API Key on startup
if not API_KEY:
    logging.error("FATAL: OPENAI_API_KEY environment variable not set. Flask server cannot start.")
    # In a real app, you might exit or prevent starting
    # For now, just log the error.

# --- API Endpoint ---
@app.route('/test', methods=['POST'])
def handle_test_request():
    """Receives a scan report JSON and runs AI vulnerability tests."""
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
        results: List[VulnerabilityTestResult] = run_scan_tests(scan_report, query_limit)
        
        # Convert results to JSON-serializable format
        results_dict = [r.model_dump(mode='json') for r in results]
        
        logging.info(f"Finished tests for scan_id: {scan_report.scan_metadata.scan_id}")
        return jsonify({"results": results_dict}), 200

    except Exception as e:
        logging.error(f"Error during run_scan_tests for scan_id {scan_report.scan_metadata.scan_id}: {e}", exc_info=True)
        return jsonify({"error": "An internal error occurred during vulnerability testing."}), 500

# --- Run Server ---
if __name__ == '__main__':
    # Make sure to set the host and port as needed
    # Use 0.0.0.0 to make it accessible externally (e.g., from Docker)
    app.run(host='0.0.0.0', port=5005, debug=False) 