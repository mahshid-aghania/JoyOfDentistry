import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Cover } from "@/components/magazine/Cover";
import { IssueCard } from "@/components/magazine/IssueCard";
import { ContentLanguageBadge } from "@/components/ui/Badge";
import { IssueReader } from "@/components/reader/IssueReader";
import { ChevronLeft, ChevronRight, DownloadIcon } from "@/components/ui/icons";
import {
  getAdjacentIssues,
  getIssueBySlug,
} from "@/lib/queries";
import { coverUrl, pdfUrl } from "@/lib/storage";
import { formatPublicationDate } from "@/lib/format";
import { localizedField, localizedTitle, type Issue } from "@/lib/types";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/env";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const issue = await getIssueBySlug(slug);
  if (!issue) return {};
  const title =
    localizedTitle(issue, locale as Locale) || `Issue ${issue.issue_number}`;
  const description =
    localizedField(issue as unknown as Record<string, unknown>, "description", locale as Locale) ||
    "";
  return pageMetadata({
    title,
    description,
    path: `/magazines/${slug}`,
    locale: locale as Locale,
    image: coverUrl(issue.cover_path),
  });
}

export default async function IssuePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: localeStr, slug } = await params;
  setRequestLocale(localeStr);
  const locale = localeStr as Locale;
  const sp = await searchParams;

  const issue = await getIssueBySlug(slug);
  if (!issue) notFound();

  const t = await getTranslations("issue");
  const ta = await getTranslations("actions");
  const tr = await getTranslations("reader");
  const tn = await getTranslations("nav");
  const row = issue as unknown as Record<string, unknown>;

  const title = localizedTitle(issue, locale) || t("issueLabel", { number: issue.issue_number });
  const description = localizedField(row, "description", locale);
  const editorNote = localizedField(row, "editor_note", locale);
  const contents =
    (locale === "fa" ? issue.contents_fa : issue.contents_en) ||
    issue.contents_en ||
    issue.contents_fa ||
    [];
  const date = formatPublicationDate(issue.publication_date, locale);

  const pdfEn = pdfUrl(issue.pdf_en_path);
  const pdfFa = pdfUrl(issue.pdf_fa_path);
  // Prefer the edition matching the UI language when both exist.
  const primaryPdf = locale === "fa" ? pdfFa || pdfEn : pdfEn || pdfFa;
  const download = issue.downloads_enabled ? primaryPdf : null;

  const { previous, next } = await getAdjacentIssues(issue);
  const autoOpen = sp.read === "1";

  return (
    <div className="container-editorial py-12 md:py-16">
      <Link
        href="/magazines"
        className="link-underline mb-10 inline-flex items-center gap-1.5 text-sm text-charcoal-soft"
      >
        <ChevronLeft className="flip-rtl" width={16} height={16} />
        {tn("magazines")}
      </Link>

      {/* ── Masthead ───────────────────────────────────────────────────── */}
      <div className="grid gap-10 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-16">
        <div className="mx-auto w-full max-w-xs md:mx-0">
          <Cover issue={issue} locale={locale} priority sizes="(min-width: 768px) 22rem, 80vw" />
        </div>

        <div>
          <p className="eyebrow mb-4">{t("issueLabel", { number: issue.issue_number })}</p>
          <h1 className="display text-4xl leading-[1.05] md:text-6xl">{title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-charcoal-soft">
            {date && <span>{t("publishedOn", { date })}</span>}
            <ContentLanguageBadge language={issue.content_language} />
          </div>

          {description && (
            <div className="mt-8">
              <h2 className="eyebrow mb-2">{t("description")}</h2>
              <p className="max-w-2xl whitespace-pre-line text-lg leading-relaxed text-charcoal-soft">
                {description}
              </p>
            </div>
          )}

          {/* Read + download */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#reader" className="btn btn-primary">
              {ta("readOnline")}
            </a>
            {download && (
              <a href={download} download className="btn btn-outline">
                <DownloadIcon width={18} height={18} />
                {ta("downloadPdf")}
              </a>
            )}
          </div>

          {/* Separate language editions */}
          {pdfEn && pdfFa && (
            <p className="mt-4 text-sm text-charcoal-mute">
              {t("languageEdition")}:{" "}
              <a href={pdfEn} className="link-underline" target="_blank" rel="noopener noreferrer">
                EN
              </a>{" "}
              ·{" "}
              <a href={pdfFa} className="link-underline" target="_blank" rel="noopener noreferrer">
                FA
              </a>
            </p>
          )}
        </div>
      </div>

      {/* ── Editor's note + contents ───────────────────────────────────── */}
      {(editorNote || contents.length > 0) && (
        <div className="mt-16 grid gap-12 border-t border-line pt-12 md:grid-cols-2">
          {editorNote && (
            <div>
              <h2 className="eyebrow mb-4">{t("editorNote")}</h2>
              <p className="whitespace-pre-line text-lg leading-relaxed text-charcoal-soft">
                {editorNote}
              </p>
            </div>
          )}
          {contents.length > 0 && (
            <div>
              <h2 className="eyebrow mb-4">{t("contents")}</h2>
              <ol className="space-y-2.5">
                {contents.map((item, i) => (
                  <li key={i} className="flex gap-4 border-b border-line pb-2.5">
                    <span className="font-[family-name:var(--font-serif)] text-champagne-deep">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-charcoal-soft">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* ── Online reader ──────────────────────────────────────────────── */}
      <section id="reader" className="mt-16 scroll-mt-24 border-t border-line pt-12">
        <h2 className="display mb-6 text-3xl">{tr("title")}</h2>
        <IssueReader pdfUrl={primaryPdf} downloadUrl={download} autoOpen={autoOpen} />
      </section>

      {/* ── Adjacent navigation ────────────────────────────────────────── */}
      {(previous || next) && (
        <nav className="mt-16 flex items-stretch justify-between gap-4 border-t border-line pt-8">
          {previous ? (
            <Link
              href={`/magazines/${previous.slug}`}
              className="group flex items-center gap-3 text-start"
            >
              <ChevronLeft className="flip-rtl text-charcoal-mute group-hover:text-burgundy" />
              <span>
                <span className="block text-xs uppercase tracking-wider text-charcoal-mute">
                  {t("previousIssue")}
                </span>
                <span className="font-[family-name:var(--font-serif)] text-lg group-hover:text-burgundy">
                  {localizedTitle(previous, locale) ||
                    t("issueLabel", { number: previous.issue_number })}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/magazines/${next.slug}`}
              className="group flex items-center gap-3 text-end"
            >
              <span>
                <span className="block text-xs uppercase tracking-wider text-charcoal-mute">
                  {t("nextIssue")}
                </span>
                <span className="font-[family-name:var(--font-serif)] text-lg group-hover:text-burgundy">
                  {localizedTitle(next, locale) ||
                    t("issueLabel", { number: next.issue_number })}
                </span>
              </span>
              <ChevronRight className="flip-rtl text-charcoal-mute group-hover:text-burgundy" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}

      <IssueJsonLd issue={issue} locale={locale} title={title} description={description} slug={slug} />
    </div>
  );
}

function IssueJsonLd({
  issue,
  title,
  description,
  slug,
}: {
  issue: Issue;
  locale: Locale;
  title: string;
  description: string;
  slug: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "PublicationIssue",
    issueNumber: issue.issue_number,
    name: title,
    description: description || undefined,
    datePublished: issue.publication_date || undefined,
    image: coverUrl(issue.cover_path) || undefined,
    url: `${siteUrl}/en/magazines/${slug}`,
    isPartOf: {
      "@type": "Periodical",
      name: "Joy of Dentistry",
      issn: undefined,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
