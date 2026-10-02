"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "@/lib/auth";
import { BUCKET_COVERS, BUCKET_PDFS } from "@/lib/env";
import {
  issueInputSchema,
  publishRequirementErrors,
  siteContentSchema,
  type IssueInput,
  type SiteContentInput,
} from "@/lib/admin/validation";

export interface ActionResult {
  ok: boolean;
  id?: string;
  error?: string;
  missing?: string[];
}

function slugForIssue(issueNumber: number): string {
  return `issue-${issueNumber}`;
}

/** Create or update an issue. Enforces publish requirements server-side. */
export async function saveIssue(raw: IssueInput): Promise<ActionResult> {
  try {
    await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const parsed = issueInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }
  const input = parsed.data;

  if (input.status === "published") {
    const missing = publishRequirementErrors(input);
    if (missing.length > 0) return { ok: false, error: "missing", missing };
  }

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "not_configured" };

  const payload = {
    issue_number: input.issue_number,
    slug: slugForIssue(input.issue_number),
    title_en: input.title_en || null,
    title_fa: input.title_fa || null,
    description_en: input.description_en || null,
    description_fa: input.description_fa || null,
    editor_note_en: input.editor_note_en || null,
    editor_note_fa: input.editor_note_fa || null,
    contents_en: input.contents_en?.filter(Boolean) ?? null,
    contents_fa: input.contents_fa?.filter(Boolean) ?? null,
    publication_date: input.publication_date || null,
    content_language: input.content_language,
    cover_path: input.cover_path || null,
    cover_width: input.cover_width || null,
    cover_height: input.cover_height || null,
    cover_alt_en: input.cover_alt_en || null,
    cover_alt_fa: input.cover_alt_fa || null,
    pdf_en_path: input.pdf_en_path || null,
    pdf_fa_path: input.pdf_fa_path || null,
    status: input.status,
    is_featured: input.is_featured,
    downloads_enabled: input.downloads_enabled,
  };

  let id = input.id ?? undefined;

  if (id) {
    const { error } = await admin.from("issues").update(payload).eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await admin
      .from("issues")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    id = data.id as string;
  }

  // A featured issue must be the only one.
  if (input.is_featured && id) {
    await admin.from("issues").update({ is_featured: false }).neq("id", id);
  }

  revalidatePath("/", "layout");
  return { ok: true, id };
}

export async function setIssueStatus(
  id: string,
  status: "draft" | "published",
): Promise<ActionResult> {
  try {
    await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "not_configured" };

  if (status === "published") {
    const { data } = await admin.from("issues").select("*").eq("id", id).single();
    if (data) {
      const missing = publishRequirementErrors(data as IssueInput);
      if (missing.length > 0) return { ok: false, error: "missing", missing };
    }
  }

  const { error } = await admin.from("issues").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true, id };
}

export async function setFeatured(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "not_configured" };
  await admin.from("issues").update({ is_featured: false }).neq("id", id);
  const { error } = await admin
    .from("issues")
    .update({ is_featured: true })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true, id };
}

export async function moveIssue(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  try {
    await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "not_configured" };

  const { data: all } = await admin
    .from("issues")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("issue_number", { ascending: false });
  if (!all) return { ok: false, error: "not_found" };

  // Normalize sort orders to their current index first.
  const ordered = all.map((r, i) => ({ id: r.id as string, order: i }));
  const idx = ordered.findIndex((r) => r.id === id);
  if (idx === -1) return { ok: false, error: "not_found" };
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= ordered.length) return { ok: true, id };

  [ordered[idx].order, ordered[swapWith].order] = [
    ordered[swapWith].order,
    ordered[idx].order,
  ];

  for (const row of ordered) {
    await admin.from("issues").update({ sort_order: row.order }).eq("id", row.id);
  }
  revalidatePath("/", "layout");
  return { ok: true, id };
}

export async function deleteIssue(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "not_configured" };

  const { data } = await admin
    .from("issues")
    .select("cover_path, pdf_en_path, pdf_fa_path")
    .eq("id", id)
    .maybeSingle();

  if (data) {
    if (data.cover_path)
      await admin.storage.from(BUCKET_COVERS).remove([data.cover_path]);
    const pdfs = [data.pdf_en_path, data.pdf_fa_path].filter(Boolean) as string[];
    if (pdfs.length) await admin.storage.from(BUCKET_PDFS).remove(pdfs);
  }

  const { error } = await admin.from("issues").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true, id };
}

export async function saveSiteContent(
  raw: SiteContentInput,
): Promise<ActionResult> {
  try {
    await assertAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const parsed = siteContentSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "validation" };

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "not_configured" };

  const { error } = await admin
    .from("site_content")
    .upsert({ id: "singleton", data: parsed.data });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}
