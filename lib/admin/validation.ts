import { z } from "zod";

export const issueInputSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  issue_number: z.coerce.number().int().min(0),
  title_en: z.string().trim().max(300).optional().nullable(),
  title_fa: z.string().trim().max(300).optional().nullable(),
  description_en: z.string().trim().max(5000).optional().nullable(),
  description_fa: z.string().trim().max(5000).optional().nullable(),
  editor_note_en: z.string().trim().max(5000).optional().nullable(),
  editor_note_fa: z.string().trim().max(5000).optional().nullable(),
  contents_en: z.array(z.string().trim()).optional().nullable(),
  contents_fa: z.array(z.string().trim()).optional().nullable(),
  publication_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  content_language: z.enum(["en", "fa", "bilingual"]).default("bilingual"),
  cover_path: z.string().optional().nullable(),
  cover_width: z.coerce.number().int().positive().optional().nullable(),
  cover_height: z.coerce.number().int().positive().optional().nullable(),
  cover_alt_en: z.string().trim().max(500).optional().nullable(),
  cover_alt_fa: z.string().trim().max(500).optional().nullable(),
  pdf_en_path: z.string().optional().nullable(),
  pdf_fa_path: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  is_featured: z.boolean().default(false),
  downloads_enabled: z.boolean().default(true),
});

export type IssueInput = z.infer<typeof issueInputSchema>;

/** Returns a list of missing-requirement keys for publishing (empty = OK). */
export function publishRequirementErrors(input: IssueInput): string[] {
  const errors: string[] = [];
  if (input.issue_number == null || Number.isNaN(input.issue_number))
    errors.push("issueNumberRequired");
  if (!input.cover_path) errors.push("coverRequired");
  if (!input.pdf_en_path && !input.pdf_fa_path) errors.push("pdfRequired");
  if (!input.title_en?.trim() && !input.title_fa?.trim())
    errors.push("titleRequired");
  if (!input.publication_date) errors.push("dateRequired");
  return errors;
}

export const siteContentSchema = z.object({
  home_about_en: z.string().max(2000).default(""),
  home_about_fa: z.string().max(2000).default(""),
  about_mission_en: z.string().max(5000).default(""),
  about_mission_fa: z.string().max(5000).default(""),
  contact_info_en: z.string().max(2000).default(""),
  contact_info_fa: z.string().max(2000).default(""),
  social_links: z
    .array(
      z.object({
        label: z.string().trim().max(60).default(""),
        url: z.string().trim().max(500).default(""),
      }),
    )
    .default([]),
});

export type SiteContentInput = z.infer<typeof siteContentSchema>;
