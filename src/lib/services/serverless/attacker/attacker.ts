import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
import { AIService, Models } from "../../../ai";
import { SQLInjectionToolExecutor, SQLInjectionResult, SQLInjectionTool, AttackResult } from "./attack_tools";
import { SQLInjectionParams } from "./attack_tools";

import { updateAttackLogs } from '../utils';

type Vulnerability = Database["public"]["Tables"]["vulnerabilities"]["Row"];

/**
 * Runs an attack on a vulnerability
 * 
 * @param attackId - The ID of the attack record
 * @param vulnerabilityId - The ID of the vulnerability
 * @param vulnerability - The vulnerability details
 */
export async function runAttackOrchestrator(
  attackId: string,
  vulnerabilityId: string,
  vulnerability: Vulnerability
): Promise<void> {
  const supabase = await createClient();

  // Function to check if attack has been canceled
  const checkIfCanceled = async (): Promise<boolean> => {
    const { data, error } = await supabase
      .from("attacks")
      .select("status")
      .eq("id", attackId)
      .single();

    if (error) {
      console.error("Error checking attack status:", error);
      return false;
    }

    return data.status === "canceled";
  };

  try {
    // Log the vulnerability object for verification
    await updateAttackLogs(supabase, attackId, `Starting attack on vulnerability: ${vulnerability.title} (ID: ${vulnerabilityId})`);
    await updateAttackLogs(supabase, attackId, `Vulnerability details: ${JSON.stringify(vulnerability, null, 2)}`);
    
    // Step 1: Analyze the vulnerability
    await updateAttackLogs(supabase, attackId, "Analyzing vulnerability to determine attack strategy...");
    
    // Check if attack has been canceled
    if (await checkIfCanceled()) {
      console.log(`[Attack] Attack ${attackId} was canceled, stopping analysis`);
      await updateAttackLogs(supabase, attackId, "Attack canceled by user, stopping analysis", "failed");
      return;
    }

    // Get the project details, and the base target URL
    const { data: project } = await supabase
      .from("projects")
      .select("id, target_url") // Select only needed fields
      .eq("id", vulnerability.project_id || "")
      .single();

    if (!project) {
      throw new Error("Project not found");
    }

    // *** Add check for target_url ***
    if (!project.target_url) {
      throw new Error(`Project ${project.id} does not have a target_url configured.`);
    }

    // Assign to a new variable after the check to help TS inference
    const validatedTargetUrl: string = project.target_url; 

    // Step 2: Analyze the vulnerability to determine the appropriate attack tool and parameters
    await updateAttackLogs(supabase, attackId, "Analyzing vulnerability to determine attack tool and parameters...");
    
    // Check if attack has been canceled
    if (await checkIfCanceled()) {
      console.log(`[Attack] Attack ${attackId} was canceled, stopping analysis`);
      await updateAttackLogs(supabase, attackId, "Attack canceled by user, stopping analysis", "failed");
      return;
    }
    
    // Analyze the vulnerability to determine the appropriate attack tool and parameters
    const attackParams = await analyzeVulnerabilityForAttack(vulnerability, { target_url: validatedTargetUrl });
    
    if (!attackParams) {
      throw new Error("Failed to analyze vulnerability for attack");
    }
    
    await updateAttackLogs(supabase, attackId, `Attack parameters determined: ${JSON.stringify(attackParams, null, 2)}`);
    
    // Step 3: Execute the attack
    await updateAttackLogs(supabase, attackId, "Executing the attack...");
    
    // Check if attack has been canceled
    if (await checkIfCanceled()) {
      console.log(`[Attack] Attack ${attackId} was canceled, stopping attack execution`);
      await updateAttackLogs(supabase, attackId, "Attack canceled by user, stopping attack execution", "failed");
      return;
    }
    
    // Execute the attack
    // TODO: Should just pass in the response 
    const attackResult = await executeAttack(
      supabase,
      attackId,
      vulnerability,
      attackParams
    );
    
    await updateAttackLogs(supabase, attackId, `Attack executed. Response received.`);
    
    // Step 4: Analyze the attack result
    await updateAttackLogs(supabase, attackId, "Analyzing attack result...");
    
    // Check if attack has been canceled
    if (await checkIfCanceled()) {
      console.log(`[Attack] Attack ${attackId} was canceled, stopping result analysis`);
      await updateAttackLogs(supabase, attackId, "Attack canceled by user, stopping result analysis", "failed");
      return;
    }
    
    // Analyze the attack result
    const analyzedResult = await analyzeAttackResult(
      supabase,
      attackId,
      vulnerability,
      attackResult
    );
    
    await updateAttackLogs(supabase, attackId, `Attack result analyzed: ${JSON.stringify(analyzedResult, null, 2)}`);
    
    // Step 5: Update the attack record with the final result
    await updateAttackLogs(supabase, attackId, "Updating attack record with final result...");
    
    // Check if attack has been canceled
    if (await checkIfCanceled()) {
      console.log(`[Attack] Attack ${attackId} was canceled, stopping record update`);
      await updateAttackLogs(supabase, attackId, "Attack canceled by user, stopping record update", "failed");
      return;
    }
    
    // Update the attack record with the final result
    const { error: updateError } = await supabase
      .from("attacks")
      .update({
        status: "completed",
        current_stage: "completed",
        progress_percentage: 100,
        result_summary: analyzedResult.message,
        detailed_report: JSON.stringify(analyzedResult),
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .eq("id", attackId);
    
    if (updateError) {
      console.error("Error updating final attack data:", updateError);
      await updateAttackLogs(supabase, attackId, `Error updating final attack data: ${updateError.message}`, "failed");
    } else {
      console.log(`[Attack] Attack ${attackId} completed successfully`);
      await updateAttackLogs(supabase, attackId, "Attack completed successfully", "completed");
    }
  } catch (error) {
    // Handle errors in the attack process
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    console.error(`[Attack] Attack ${attackId} failed:`, error);
    await updateAttackLogs(supabase, attackId, `Attack failed: ${errorMessage}`, "failed");
    
    await supabase
      .from("attacks")
      .update({
        status: "failed",
        current_stage: "failed",
        result_summary: `Attack failed: ${errorMessage}`,
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .eq("id", attackId);
  }
}

export async function analyzeVulnerabilityForAttack(
  vulnerability: Vulnerability,
  project: { target_url: string }
): Promise<SQLInjectionParams | null> {
  // Use the LLM to analyze the vulnerability and determine the appropriate attack parameters
  const aiService = AIService.getInstance();
  const service = aiService.getService(Models.OpenAI.GEMINI_2_5);
  
  // Use JSON.stringify to dump the full vulnerability object into the prompt
  const vulnerabilityDetails = JSON.stringify(vulnerability, null, 2);

  const analysisPrompt = `
    You are an expert security researcher tasked with analyzing a vulnerability and determining the appropriate attack parameters.

    Base URL: ${project.target_url}
    
    Vulnerability Details (JSON):
    \`\`\`json
    ${vulnerabilityDetails}
    \`\`\`
    
    Determine which tool to use and what parameters to use for the attack. targetUrl is derived from the base URL and the vulnerability details (files paths, etc.).

    The target URL we are targeting, which is derived from the base URL and the vulnerability details (files paths, etc.). NEVER USE example.com as the target URL. YOU ARE CREATING A TARGET URL BASED ON THE VULNERABILITY DETAILS.
  `;
  
  // Use the SQLInjectionTool to get the function call format
  const sqlInjectionTool = SQLInjectionTool();
  
  console.log("Sending analysis prompt to LLM:", analysisPrompt);

  const analysisCompletion = await service.createCompletion(
    Models.OpenAI.GPT_4o,
    {
      messages: [
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      tools: [sqlInjectionTool],
      tool_choice: { type: "function", function: { name: "execute_sql_injection_attack" } },
      temperature: 0.2,
      max_tokens: 5000,
    }
  );

  console.log("LLM analysis response received:", analysisCompletion);

  // Get the tool call from the response
  const toolCall = analysisCompletion.choices[0]?.message?.tool_calls?.[0];
  
  if (!toolCall || toolCall.function.name !== "execute_sql_injection_attack") {
    console.error("No valid SQL injection tool call found in the response", analysisCompletion.choices[0]?.message);
    return null;
  }
  
  // Parse the arguments from the tool call
  let params: SQLInjectionParams;
  try {
    console.log("Parsing arguments from tool call:", toolCall.function.arguments);
    const args = JSON.parse(toolCall.function.arguments);
    params = {
      targetUrl: args.targetUrl,
      method: args.method,
      parameter: args.parameter,
      payload: args.payload,
      headers: args.headers || { 'Content-Type': 'application/json' },
      body: args.body || {},
    };

    // Validate essential parameters
    if (!params.targetUrl || !params.parameter || !params.payload) {
        console.error("Missing essential parameters (url, parameter, payload) in parsed args:", args);
        throw new Error("LLM did not provide essential parameters (url, parameter, payload).");
    }
    
    console.log("Generated SQL injection parameters:", params);
    return params;
  } catch (error) {
    console.error("Failed to parse vulnerability analysis or missing essential parameters:", error);
    return null;
  }
}

export async function executeAttack(
  supabase: any,
  attackId: string,
  vulnerability: Vulnerability,
  params: SQLInjectionParams
): Promise<SQLInjectionResult> {
  // Log the SQL injection parameters
  await updateAttackLogs(supabase, attackId, `SQL Injection Parameters:
    Target URL: ${params.targetUrl}
    Parameter: ${params.parameter}
    Payload: ${params.payload}
    Method: ${params.method}
    Headers: ${JSON.stringify(params.headers || {})}
    Body: ${JSON.stringify(params.body || {})}
  `, 'attack_parameters');

  // Execute the SQL injection attack
  const result = await SQLInjectionToolExecutor(params);
  
  await updateAttackLogs(supabase, attackId, `Attack executed. Response received:
    Status Code: ${result.statusCode}
    Response Time: ${result.responseTime}ms
  `, 'attack_complete');
  
  return result;
}

export async function analyzeAttackResult(
  supabase: any,
  attackId: string,
  vulnerability: Vulnerability,
  attackResult: SQLInjectionResult
): Promise<AttackResult> {
  // Use the LLM to analyze the attack result
  const aiService = AIService.getInstance();
  const service = aiService.getService(Models.OpenAI.GPT_4o);
  
  const analysisPrompt = `
    You are an expert security researcher tasked with analyzing the results of a SQL injection attack.
    
    Vulnerability Details (JSON):
    \`\`\`json
    ${JSON.stringify(vulnerability, null, 2)}
    \`\`\`
    
    Attack Result:
    - Status Code: ${attackResult.statusCode}
    - Response Time: ${attackResult.responseTime}ms
    - Response Headers: ${JSON.stringify(attackResult.responseHeaders || {})}
    - Response Body: ${attackResult.evidence}
    
    Based on this information, determine if the SQL injection attack was successful and provide recommendations.
    
    Return your analysis as a structured JSON object with the following fields:
    - success: Whether the attack was successful (true/false)
    - message: A brief summary of the attack result
    - details: Detailed analysis of the attack result
    - evidence: Key evidence from the response that indicates success or failure
    - recommendations: Recommendations for remediation
  `;

  // update log the prompt
  await updateAttackLogs(supabase, attackId, `Attack result analysis prompt: ${analysisPrompt}`, "generating_report");
  
  const analysisCompletion = await service.createCompletion(
    Models.OpenAI.GPT_4o,
    {
      messages: [
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 5000
    }
  );
  
  // Parse the analysis response
  let analysisResult;
  try {
    const content = analysisCompletion.choices[0]?.message?.content || "";
    console.log("LLM Analysis Response:", content);
    
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      analysisResult = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No JSON found in the response");
    }
    
    return {
      success: analysisResult.success || false,
      message: analysisResult.message || "Unknown result",
      details: analysisResult.details || "No details provided",
      evidence: analysisResult.evidence || "No evidence provided",
      recommendations: analysisResult.recommendations || "No recommendations provided"
    };
  } catch (error) {
    console.error("Failed to parse attack result analysis:", error);
    
    // Return a default result if parsing fails
    return {
      success: false,
      message: "Failed to analyze attack result",
      details: "An error occurred during analysis",
      evidence: "No evidence available",
      recommendations: "Review the attack logs for more information"
    };
  }
}