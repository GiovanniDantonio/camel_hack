import { Database } from "@/types/database.types";

import { createBrowserClient } from "@supabase/ssr";

export function createClient(admin: boolean = false) {
  // for (
  //   const env of [
  //     "NEXT_PUBLIC_SUPABASE_URL",
  //     "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  //     "SUPABASE_SERVICE_ROLE_KEY",
  //   ]
  // ) {
  //   console.log(env, process.env[env]);
  //   if (!process.env[env]) {
  //     throw new Error(`Missing env.${env}`);
  //   }
  // }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    admin
      ? process.env.SUPABASE_SERVICE_ROLE_KEY!
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
