import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";
import { locales, type Locale } from "@/i18n/routing";

/**
 * Build canonical + hreflang alternates for a path that exists in both locales.
 * `path` is the locale-less path, e.g. "/magazines" or "/magazines/issue-1".
 */
export function buildAlternates(path: string, locale: Locale) {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l === "fa" ? "fa-IR" : "en-US"] = `${siteUrl}/${l}${clean}`;
  }
  // x-default points at the default locale.
  languages["x-default"] = `${siteUrl}/en${clean}`;
  return {
    canonical: `${siteUrl}/${locale}${clean}`,
    languages,
  };
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  image?: string | null;
}

/** Compose a complete Metadata object for a page, with OG + hreflang. */
export function pageMetadata({
  title,
  description,
  path,
  locale,
  image,
}: PageMetaInput): Metadata {
  const alternates = buildAlternates(path, locale);
  // When no explicit image is provided, omit it so the file-based
  // opengraph-image (app/[locale]/opengraph-image.tsx) is used automatically.
  const ogImages = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: "Joy of Dentistry",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "website",
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImages ? { images: ogImages.map((i) => i.url) } : {}),
    },
  };
}
