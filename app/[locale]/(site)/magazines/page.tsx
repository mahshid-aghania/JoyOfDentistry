import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { IssueCard } from "@/components/magazine/IssueCard";
import { ArchiveFilters } from "@/components/magazine/ArchiveFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { getArchiveYears, getPublishedIssues } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import type { ContentLanguage } from "@/lib/types";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const tm = await getTranslations({ locale, namespace: "magazines" });
  return pageMetadata({
    title: tm("title"),
    description: t("magazinesDescription"),
    path: "/magazines",
    locale: locale as Locale,
  });
}

const PAGE_SIZE = 12;

export default async function MagazinesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: localeStr } = await params;
  setRequestLocale(localeStr);
  const locale = localeStr as Locale;
  const sp = await searchParams;

  const t = await getTranslations("magazines");
  const ta = await getTranslations("actions");

  const year = sp.year ? Number(sp.year) : null;
  const language = (sp.language as ContentLanguage) || null;
  const search = (sp.search as string) || null;
  const sort = sp.sort === "oldest" ? "oldest" : "newest";
  const show = Math.max(PAGE_SIZE, Number(sp.show) || PAGE_SIZE);

  const [{ issues, total }, years] = await Promise.all([
    getPublishedIssues({ year, language, search, sort, limit: show, offset: 0 }),
    getArchiveYears(),
  ]);

  const hasFilters = Boolean(year || language || search);
  const hasMore = total > issues.length;

  // Preserve filters when building the "load more" link.
  const moreQuery: Record<string, string> = { show: String(show + PAGE_SIZE) };
  if (year) moreQuery.year = String(year);
  if (language) moreQuery.language = language;
  if (search) moreQuery.search = search;
  if (sort !== "newest") moreQuery.sort = sort;

  return (
    <div className="container-editorial py-16 md:py-20">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow mb-3">{t("title")}</p>
        <h1 className="display text-5xl md:text-6xl">{t("title")}</h1>
        <p className="mt-4 text-lg text-charcoal-soft">{t("subtitle")}</p>
      </header>

      <ArchiveFilters years={years} />

      <div className="mt-6 flex items-center justify-between border-t border-line pt-6 text-sm text-charcoal-mute">
        <span>{t("resultsCount", { count: total })}</span>
      </div>

      {issues.length === 0 ? (
        <EmptyState
          className="mt-8"
          title={t("empty.title")}
          body={hasFilters ? t("empty.bodyFiltered") : t("empty.body")}
        />
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {issues.map((issue, i) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                locale={locale}
                priority={i < 2}
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-16 flex justify-center">
              <Link
                href={{ pathname: "/magazines", query: moreQuery }}
                replace
                scroll={false}
                className="btn btn-outline"
              >
                {ta("loadMore")}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
