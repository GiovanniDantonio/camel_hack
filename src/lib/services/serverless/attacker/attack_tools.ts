export interface AttackResult {
  success: boolean;
  message: string;
  details: string;
  evidence: string;
  recommendations: string;
}

/**
 * Interface for SQL injection attack parameters
 */
export interface SQLInjectionParams {
  targetUrl: string;
  parameter: string;
  payload: string;
  method: 'GET' | 'POST';
  headers: Record<string, string>;
  body: Record<string, string>;
}

/**
 * Interface for SQL injection attack result
 */
export interface SQLInjectionResult {
  success: boolean;
  message: string;
  details: string;
  evidence: string;
  recommendations: string;
  data?: any;
  error?: string;
  responseTime?: number;
  statusCode?: number;
  responseHeaders?: Record<string, string>;
  targetUrl?: string;
}

/**
 * Creates a tool definition for SQL injection attacks that can be used with OpenAI's function calling API
 * 
 * @returns Tool definition object
 */
export function SQLInjectionTool(): any {
  return {
    type: "function",
    function: {
      name: "execute_sql_injection_attack",
      description: "Execute a SQL injection attack against a target URL to test for vulnerabilities.",
      parameters: {
        type: "object",
        properties: {
          parameter: {
            type: "string",
            description: "The parameter to inject the SQL payload into"
          },
          payload: {
            type: "string",
            description: "The SQL injection payload to use"
          },
          method: {
            type: "string",
            description: "HTTP method to use (GET or POST)",
            enum: ["GET", "POST"]
          },
          headers: {
            type: "object",
            description: "Additional HTTP headers to include in the request",
            additionalProperties: {
              type: "string"
            }
          },
          body: {
            type: "object",
            description: "Additional body parameters for POST requests",
            additionalProperties: {
              type: "string"
            }
          },
          targetUrl: {
            type: "string",
            description: "The target URL we are targeting, which is derived from the base URL and the vulnerability details (files paths, etc.). NEVER USE example.com as the target URL, always use the target URL derived from the base URL and the vulnerability details. YOU ARE CREATING A TARGET URL BASED ON THE VULNERABILITY DETAILS."
          }
        },
        required: ["targetUrl", "parameter", "payload", "method"],
        additionalProperties: false
      },
      strict: true
    }
  };
}

/**
 * Executes a SQL injection attack against a target URL
 * 
 * @param params - SQL injection attack parameters
 * @returns Promise with the attack result
 */
export async function SQLInjectionToolExecutor(params: SQLInjectionParams): Promise<SQLInjectionResult> {
  const { targetUrl, parameter, payload, method, headers = {}, body = {} } = params;
  
  console.log(`Target URL: ${targetUrl || 'Not provided'}`);
  console.log(`Using parameter: ${parameter} with payload: ${payload}`);
  console.log(`Method: ${method}`);
  console.log(`Headers: ${JSON.stringify(headers)}`);
  console.log(`Body: ${JSON.stringify(body)}`);
  
  try {
    // Prepare the request URL and body
    let requestUrl = targetUrl;
    let requestBody: string | undefined;
    
    // If target URL is provided, use it as the base URL
    if (targetUrl) {
      const urlObj = new URL(targetUrl);
      const path = urlObj.pathname;
      requestUrl = `${targetUrl}${path}`;
      console.log(`Using target URL as base: ${requestUrl}`);
    }
    
    if (method === 'GET') {
      // For GET requests, append the parameter with the payload to the URL
      const urlObj = new URL(requestUrl);
      urlObj.searchParams.set(parameter, payload);
      requestUrl = urlObj.toString();
      console.log(`Final GET request URL with payload: ${requestUrl}`);
    } else if (method === 'POST') {
      // For POST requests, include the parameter with the payload in the body
      const requestBodyObj = { ...body };
      requestBodyObj[parameter] = payload;
      requestBody = JSON.stringify(requestBodyObj);
      console.log(`Final POST request URL: ${requestUrl}`);
      console.log(`POST request body: ${requestBody}`);
    }
    
    // Set default headers if not provided
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    
    console.log(`Final request URL: ${requestUrl}`);
    console.log(`Request method: ${method}`);
    console.log(`Request headers: ${JSON.stringify(requestHeaders)}`);
    if (requestBody) {
      console.log(`Request body: ${requestBody}`);
    }
    
    // Execute the request
    const startTime = Date.now();
    const response = await fetch(requestUrl, {
      method,
      headers: requestHeaders,
      body: method === 'POST' ? requestBody : undefined,
    });
    const endTime = Date.now();
    
    // Process the response
    const responseTime = endTime - startTime;
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    
    // Get the response text
    const responseText = await response.text();
    
    console.log(`SQL injection attack completed`);
    console.log(`Response time: ${responseTime}ms, Status code: ${response.status}`);
    
    // Simply return the raw response without any success determination
    return {
      success: true, // We don't determine success here anymore
      message: "SQL injection attack executed",
      details: `Response time: ${responseTime}ms, Status code: ${response.status}`,
      evidence: responseText,
      recommendations: "", // Will be determined by LLM later
      data: responseText,
      responseTime,
      statusCode: response.status,
      responseHeaders,
      targetUrl
    };
  } catch (error) {
    console.error(`SQL injection attack error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    return {
      success: false,
      message: "SQL injection attack failed",
      details: "An error occurred during the attack",
      evidence: error instanceof Error ? error.message : "Unknown error",
      recommendations: "Review error handling and security measures",
      error: error instanceof Error ? error.message : 'Unknown error during SQL injection attack',
      targetUrl
    };
  }
}