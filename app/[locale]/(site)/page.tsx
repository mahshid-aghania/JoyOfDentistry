import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Cover } from "@/components/magazine/Cover";
import { IssueCard } from "@/components/magazine/IssueCard";
import { IssueActions } from "@/components/magazine/IssueActions";
import { ArticleCard } from "@/components/magazine/ArticleCard";
import { ContentLanguageBadge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Themes } from "@/components/home/Themes";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ArrowRight } from "@/components/ui/icons";
import {
  getFeaturedIssue,
  getPublishedArticles,
  getPublishedIssues,
  getSiteContent,
} from "@/lib/queries";
import { localizedField, localizedTitle } from "@/lib/types";
import { formatPublicationDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const brand = await getTranslations({ locale, namespace: "brand" });
  const meta = pageMetadata({
    title: `${brand("name")} — ${brand("tagline")}`,
    description: t("siteDescription"),
    path: "/",
    locale: locale as Locale,
  });
  // Avoid the "· Joy of Dentistry" template suffix on the home title.
  meta.title = { absolute: `${brand("name")} — ${brand("tagline")}` };
  return meta;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeStr } = await params;
  setRequestLocale(localeStr);
  const locale = localeStr as Locale;

  const t = await getTranslations("home");
  const ta = await getTranslations("actions");

  const [featured, latest, articles, content] = await Promise.all([
    getFeaturedIssue(),
    getPublishedIssues({ limit: 4, sort: "newest" }),
    getPublishedArticles(3),
    getSiteContent(),
  ]);

  const aboutBody =
    localizedField(
      content as unknown as Record<string, unknown>,
      "home_about",
      locale,
    ) || t("aboutBody");

  return (
    <>
      {/* ── Hero: latest issue ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="container-editorial grid items-center gap-12 py-16 md:grid-cols-2 md:gap-16 md:py-24">
          {featured ? (
            <>
              <div className="order-2 md:order-1">
                <p className="eyebrow mb-4">
                  {t("heroEyebrow")} · {t("issueLabel", { number: featured.issue_number })}
                </p>
                <h1 className="display text-5xl leading-[1.02] md:text-7xl">
                  {localizedTitle(featured, locale) ||
                    t("issueLabel", { number: featured.issue_number })}
                </h1>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-charcoal-soft">
                  {featured.publication_date && (
                    <span>
                      {formatPublicationDate(featured.publication_date, locale)}
                    </span>
                  )}
                  <ContentLanguageBadge language={featured.content_language} />
                </div>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-charcoal-soft">
                  {localizedField(
                    featured as unknown as Record<string, unknown>,
                    "description",
                    locale,
                  ) || t("heroIntroFallback")}
                </p>
                <div className="mt-8">
                  <IssueActions issue={featured} readHref="issue" />
                </div>
              </div>
              <div className="order-1 mx-auto w-full max-w-sm md:order-2">
                <Cover
                  issue={featured}
                  locale={locale}
                  priority
                  sizes="(min-width: 768px) 24rem, 80vw"
                />
              </div>
            </>
          ) : (
            <div className="md:col-span-2 py-10 text-center">
              <p className="eyebrow mb-4">{t("heroEyebrow")}</p>
              <h1 className="display mx-auto max-w-4xl text-5xl leading-[1.05] md:text-7xl">
                {t("heroIntroFallback")}
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-charcoal-soft">
                {aboutBody}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── About the publication ──────────────────────────────────────── */}
      <section className="border-b border-line bg-paper">
        <div className="container-editorial py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-5">{t("aboutHeading")}</p>
            <p className="font-[family-name:var(--font-serif)] text-3xl leading-snug text-charcoal md:text-4xl">
              {aboutBody}
            </p>
          </div>
        </div>
      </section>

      {/* ── Magazine archive preview ───────────────────────────────────── */}
      {latest.issues.length > 0 && (
        <section className="container-editorial py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={t("archiveHeading")}
              title={t("archiveHeading")}
              subtitle={t("archiveSubtitle")}
            />
            <Link
              href="/magazines"
              className="link-underline text-sm font-medium text-burgundy"
            >
              {ta("viewAll")}
              <ArrowRight className="flip-rtl" width={16} height={16} />
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {latest.issues.map((issue, i) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                locale={locale}
                priority={i === 0}
                sizes="(min-width: 768px) 20vw, 45vw"
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Editorial themes ───────────────────────────────────────────── */}
      <div className="border-y border-line bg-paper">
        <Themes />
      </div>

      {/* ── Featured stories (hidden until real articles exist) ────────── */}
      {articles.length > 0 && (
        <section className="container-editorial py-20 md:py-28">
          <SectionHeading
            eyebrow={t("featuredHeading")}
            title={t("featuredHeading")}
            subtitle={t("featuredSubtitle")}
          />
          <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* ── Newsletter (hidden unless configured) ──────────────────────── */}
      <NewsletterSection />
    </>
  );
}
