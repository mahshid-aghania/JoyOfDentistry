import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/auth";
import type { Issue } from "@/lib/types";

/** Fetch all issues (drafts included) for the dashboard. Admin-gated. */
export async function getIssuesForAdmin(): Promise<Issue[]> {
  const ctx = await getAdminContext();
  if (!ctx.isAdmin) return [];
  const admin = createAdminClient();
  if (!admin) return [];
  const { data } = await admin
    .from("issues")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("issue_number", { ascending: false });
  return (data as Issue[]) ?? [];
}

export async function getIssueForAdmin(id: string): Promise<Issue | null> {
  const ctx = await getAdminContext();
  if (!ctx.isAdmin) return null;
  const admin = createAdminClient();
  if (!admin) return null;
  const { data } = await admin.from("issues").select("*").eq("id", id).maybeSingle();
  return (data as Issue) ?? null;
}
