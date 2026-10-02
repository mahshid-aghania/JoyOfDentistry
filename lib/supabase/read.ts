import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/env";

/**
 * Lightweight anon read client with no cookie/session dependency. Safe to call
 * from server components, route handlers, sitemaps, and metadata. Only exposes
 * data permitted to anonymous visitors by RLS (published content). Returns null
 * when the backend is not configured.
 */
export function createReadClient() {
  if (!isSupabaseConfigured) return null;
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
