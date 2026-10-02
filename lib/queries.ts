import { createReadClient } from "@/lib/supabase/read";
import type { Article, ContentLanguage, Issue, SiteContent } from "@/lib/types";

/** Default, editable site content shown before an editor customizes it. */
export const DEFAULT_SITE_CONTENT: SiteContent = {
  home_about_en:
    "Beyond the smile, there is a story. Joy of Dentistry explores the people, ideas, and everyday moments that make dentistry meaningful.",
  home_about_fa:
    "فراتر از لبخند، داستانی هست. Joy of Dentistry به سراغ آدم‌ها، ایده‌ها و لحظه‌های روزمره‌ای می‌رود که دندان‌پزشکی را معنادار می‌کنند.",
  about_mission_en:
    "Joy of Dentistry is a bilingual lifestyle magazine about the people behind dentistry — their daily lives, their psychology and creativity, their relationships with patients, and the world they inhabit beyond the clinic.",
  about_mission_fa:
    "Joy of Dentistry یک مجلهٔ سبک‌زندگیِ دوزبانه دربارهٔ آدم‌هایی است که پشتِ دندان‌پزشکی هستند — زندگی روزمره، روان‌شناسی و خلاقیت‌شان، رابطه‌شان با بیماران و جهانی که بیرون از مطب در آن زندگی می‌کنند.",
  contact_info_en: "",
  contact_info_fa: "",
  social_links: [],
};

const ISSUE_COLUMNS = "*";

export interface ArchiveQuery {
  year?: number | null;
  language?: ContentLanguage | null;
  search?: string | null;
  sort?: "newest" | "oldest";
  limit?: number;
  offset?: number;
}

/** Published issues for the public archive, with optional filters. */
export async function getPublishedIssues(
  opts: ArchiveQuery = {},
): Promise<{ issues: Issue[]; total: number }> {
  const supabase = createReadClient();
  if (!supabase) return { issues: [], total: 0 };

  const {
    year = null,
    language = null,
    search = null,
    sort = "newest",
    limit = 12,
    offset = 0,
  } = opts;

  let query = supabase
    .from("issues")
    .select(ISSUE_COLUMNS, { count: "exact" })
    .eq("status", "published");

  if (language) query = query.eq("content_language", language);

  if (year) {
    query = query
      .gte("publication_date", `${year}-01-01`)
      .lte("publication_date", `${year}-12-31`);
  }

  if (search && search.trim()) {
    const q = `%${search.trim()}%`;
    query = query.or(
      [
        `title_en.ilike.${q}`,
        `title_fa.ilike.${q}`,
        `description_en.ilike.${q}`,
        `description_fa.ilike.${q}`,
      ].join(","),
    );
  }

  // Order by the explicit publication date, then issue number as a tiebreaker.
  const ascending = sort === "oldest";
  query = query
    .order("publication_date", { ascending, nullsFirst: false })
    .order("issue_number", { ascending })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) throw error;
  return { issues: (data as Issue[]) ?? [], total: count ?? 0 };
}

/** The featured issue, or the newest published issue if none is flagged. */
export async function getFeaturedIssue(): Promise<Issue | null> {
  const supabase = createReadClient();
  if (!supabase) return null;

  const featured = await supabase
    .from("issues")
    .select(ISSUE_COLUMNS)
    .eq("status", "published")
    .eq("is_featured", true)
    .limit(1)
    .maybeSingle();

  if (featured.data) return featured.data as Issue;

  const latest = await supabase
    .from("issues")
    .select(ISSUE_COLUMNS)
    .eq("status", "published")
    .order("publication_date", { ascending: false, nullsFirst: false })
    .order("issue_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (latest.data as Issue) ?? null;
}

export async function getIssueBySlug(slug: string): Promise<Issue | null> {
  const supabase = createReadClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("issues")
    .select(ISSUE_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as Issue) ?? null;
}

/** Adjacent published issues by issue number, for prev/next navigation. */
export async function getAdjacentIssues(
  issue: Issue,
): Promise<{ previous: Issue | null; next: Issue | null }> {
  const supabase = createReadClient();
  if (!supabase) return { previous: null, next: null };

  const previous = await supabase
    .from("issues")
    .select(ISSUE_COLUMNS)
    .eq("status", "published")
    .lt("issue_number", issue.issue_number)
    .order("issue_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const next = await supabase
    .from("issues")
    .select(ISSUE_COLUMNS)
    .eq("status", "published")
    .gt("issue_number", issue.issue_number)
    .order("issue_number", { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    previous: (previous.data as Issue) ?? null,
    next: (next.data as Issue) ?? null,
  };
}

/** All published slugs — for sitemap and static params. */
export async function getAllPublishedIssueSlugs(): Promise<string[]> {
  const supabase = createReadClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("issues")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

/** Distinct years present in the published archive, newest first. */
export async function getArchiveYears(): Promise<number[]> {
  const supabase = createReadClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("issues")
    .select("publication_date")
    .eq("status", "published")
    .not("publication_date", "is", null);
  const years = new Set<number>();
  for (const row of data ?? []) {
    const y = Number((row as { publication_date: string }).publication_date.slice(0, 4));
    if (Number.isFinite(y)) years.add(y);
  }
  return [...years].sort((a, b) => b - a);
}

// ── Articles (Stories) ───────────────────────────────────────────────────────

export async function getPublishedArticles(limit?: number): Promise<Article[]> {
  const supabase = createReadClient();
  if (!supabase) return [];
  let query = supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) return [];
  return (data as Article[]) ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = createReadClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as Article) ?? null;
}

export async function getAllPublishedArticleSlugs(): Promise<string[]> {
  const supabase = createReadClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("articles")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

// ── Site content ─────────────────────────────────────────────────────────────

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = createReadClient();
  if (!supabase) return DEFAULT_SITE_CONTENT;
  const { data } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", "singleton")
    .maybeSingle();
  if (!data?.data) return DEFAULT_SITE_CONTENT;
  return { ...DEFAULT_SITE_CONTENT, ...(data.data as Partial<SiteContent>) };
}
