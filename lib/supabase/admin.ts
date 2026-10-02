import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  isServiceRoleConfigured,
  supabaseServiceRoleKey,
  supabaseUrl,
} from "@/lib/env";

/**
 * Service-role Supabase client. SERVER ONLY — bypasses RLS and must never be
 * imported into client code. Used by trusted admin actions and the seed script
 * for storage uploads and privileged writes.
 */
export function createAdminClient() {
  if (!isServiceRoleConfigured) return null;
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
