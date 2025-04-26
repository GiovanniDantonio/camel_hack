/**
 * Updates attack logs and stage in the database
 * @param supabase - Supabase client instance
 * @param attackId - ID of the attack
 * @param message - Log message to insert
 * @param stage - Optional stage to update
 */
export async function updateAttackLogs(
  supabase: any,
  attackId: string,
  message: string,
  stage?: string
): Promise<void> {
  // Insert a new log entry into the attack_logs table
  const { error: logError } = await supabase
    .from('attack_logs')
    .insert({
      attack_id: attackId,
      message,
      stage: stage || null,
    });

  if (logError) {
    console.error("Error inserting attack log:", logError);
  }

  // Update the attack record with the new stage if provided
  console.log("Updating attack stage:", stage);
  if (stage) {
    const { error: updateError } = await supabase
      .from("attacks")
      .update({
        current_stage: stage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", attackId);

    if (updateError) {
      console.error("Error updating attack stage:", updateError);
    }
  }
}
