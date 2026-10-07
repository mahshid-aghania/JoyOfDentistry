import type { Locale } from "@/i18n/routing";

export type ContentLanguage = "en" | "fa" | "bilingual";
export type IssueStatus = "draft" | "published";

/** A magazine issue, as stored. Paths are storage object keys (not URLs). */
export interface Issue {
  id: string;
  issue_number: number;
  slug: string;
  title_en: string | null;
  title_fa: string | null;
  description_en: string | null;
  description_fa: string | null;
  editor_note_en: string | null;
  editor_note_fa: string | null;
  contents_en: string[] | null;
  contents_fa: string[] | null;
  publication_date: string | null; // ISO yyyy-mm-dd
  content_language: ContentLanguage;
  cover_path: string | null;
  cover_width: number | null;
  cover_height: number | null;
  cover_alt_en: string | null;
  cover_alt_fa: string | null;
  pdf_en_path: string | null;
  pdf_fa_path: string | null;
  status: IssueStatus;
  is_featured: boolean;
  downloads_enabled: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title_en: string | null;
  title_fa: string | null;
  excerpt_en: string | null;
  excerpt_fa: string | null;
  body_en: string | null;
  body_fa: string | null;
  author: string | null;
  category: string | null;
  reading_minutes: number | null;
  cover_path: string | null;
  cover_alt_en: string | null;
  cover_alt_fa: string | null;
  pdf_path: string | null;
  status: IssueStatus;
  published_at: string | null;
  created_at: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

/** Key/value editable site content, stored as a single JSON row. */
export interface SiteContent {
  home_about_en: string;
  home_about_fa: string;
  about_mission_en: string;
  about_mission_fa: string;
  contact_info_en: string;
  contact_info_fa: string;
  social_links: SocialLink[];
}

/** Pick the title for the active UI locale, falling back to the other. */
export function localizedTitle(issue: Issue, locale: Locale): string {
  const primary = locale === "fa" ? issue.title_fa : issue.title_en;
  const fallback = locale === "fa" ? issue.title_en : issue.title_fa;
  return (primary || fallback || "").trim();
}

export function localizedField<T extends Record<string, unknown>>(
  row: T,
  base: string,
  locale: Locale,
): string {
  const primary = row[`${base}_${locale}`] as string | null | undefined;
  const other = locale === "fa" ? "en" : "fa";
  const fallback = row[`${base}_${other}`] as string | null | undefined;
  return (primary || fallback || "").toString().trim();
}
