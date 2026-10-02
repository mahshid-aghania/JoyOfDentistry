import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { locales } from "@/i18n/routing";
import {
  getAllPublishedArticleSlugs,
  getAllPublishedIssueSlugs,
} from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/magazines", "/stories", "/about", "/contact"];
  const [issueSlugs, articleSlugs] = await Promise.all([
    getAllPublishedIssueSlugs(),
    getAllPublishedArticleSlugs(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  function addForAllLocales(path: string) {
    const languages: Record<string, string> = {};
    for (const l of locales) languages[l] = `${siteUrl}/${l}${path}`;
    for (const l of locales) {
      entries.push({
        url: `${siteUrl}/${l}${path}`,
        lastModified: new Date(),
        alternates: { languages },
      });
    }
  }

  staticPaths.forEach(addForAllLocales);
  issueSlugs.forEach((slug) => addForAllLocales(`/magazines/${slug}`));
  articleSlugs.forEach((slug) => addForAllLocales(`/stories/${slug}`));

  return entries;
}
