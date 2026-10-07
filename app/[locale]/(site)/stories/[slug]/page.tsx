import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "@/components/ui/icons";
import { getArticleBySlug } from "@/lib/queries";
import { coverUrl, pdfUrl } from "@/lib/storage";
import { localizedField } from "@/lib/types";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/env";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  const row = article as unknown as Record<string, unknown>;
  return pageMetadata({
    title: localizedField(row, "title", locale as Locale),
    description: localizedField(row, "excerpt", locale as Locale),
    path: `/stories/${slug}`,
    locale: locale as Locale,
    image: coverUrl(article.cover_path),
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeStr, slug } = await params;
  setRequestLocale(localeStr);
  const locale = localeStr as Locale;

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const t = await getTranslations("stories");
  const row = article as unknown as Record<string, unknown>;
  const title = localizedField(row, "title", locale);
  const body = localizedField(row, "body", locale);
  const cover = coverUrl(article.cover_path);
  const pdf = pdfUrl(article.pdf_path);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: localizedField(row, "excerpt", locale) || undefined,
    author: article.author ? { "@type": "Person", name: article.author } : undefined,
    datePublished: article.published_at || undefined,
    image: cover || undefined,
    url: `${siteUrl}/${locale}/stories/${slug}`,
  };

  return (
    <article className="container-editorial py-12 md:py-16">
      <Link
        href="/stories"
        className="link-underline mb-10 inline-flex items-center gap-1.5 text-sm text-charcoal-soft"
      >
        <ChevronLeft className="flip-rtl" width={16} height={16} />
        {t("notFound.cta")}
      </Link>

      <header className="mx-auto max-w-3xl text-center">
        {article.category && <p className="eyebrow mb-4">{article.category}</p>}
        <h1 className="display text-4xl leading-[1.08] md:text-6xl">{title}</h1>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 text-charcoal-mute">
          {article.author && <span>{t("by", { author: article.author })}</span>}
          {article.author && article.reading_minutes && <span aria-hidden>·</span>}
          {article.reading_minutes && (
            <span>{t("readingTime", { minutes: article.reading_minutes })}</span>
          )}
        </div>
        {pdf && (
          <div className="mt-6">
            <a href={pdf} target="_blank" rel="noopener" className="btn-outline inline-flex">
              {t("downloadPdf")}
            </a>
          </div>
        )}
      </header>

      {cover && (
        <div className="cover-frame mx-auto mt-12 max-w-4xl">
          <Image
            src={cover}
            alt={localizedField(row, "cover_alt", locale) || title}
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 56rem, 90vw"
            className="h-auto w-full"
            priority
          />
        </div>
      )}

      {body && (
        <div
          className="prose-article mx-auto mt-12 max-w-2xl text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
