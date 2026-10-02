import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, isSupabaseConfigured } from "@/lib/env";

export interface AdminContext {
  configured: boolean;
  signedIn: boolean;
  isAdmin: boolean;
  email: string | null;
}

/**
 * Resolve the current admin context from the request session. This is the
 * single source of truth for gating the dashboard and server actions.
 */
export async function getAdminContext(): Promise<AdminContext> {
  if (!isSupabaseConfigured) {
    return { configured: false, signedIn: false, isAdmin: false, email: null };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { configured: false, signedIn: false, isAdmin: false, email: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? null;
  return {
    configured: true,
    signedIn: Boolean(user),
    isAdmin: isAdminEmail(email),
    email,
  };
}

/** Throwable guard for server actions: ensures the caller is an admin. */
export async function assertAdmin(): Promise<AdminContext> {
  const ctx = await getAdminContext();
  if (!ctx.configured) throw new Error("Backend not configured.");
  if (!ctx.isAdmin) throw new Error("Not authorized.");
  return ctx;
}
