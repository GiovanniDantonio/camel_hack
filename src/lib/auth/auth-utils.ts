"use server";

import { createClient } from "@/lib/supabase/server";

// Get the current session
export async function getSession() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting session:", error);
    return null;
  }

  return user;
}

// Get the current user
export async function getUser() {
  const user = await getSession();
  return user || null;
}
