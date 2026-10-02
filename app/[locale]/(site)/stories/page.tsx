import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleCard } from "@/components/magazine/ArticleCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedArticles } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const ts = await getTranslations({ locale, namespace: "stories" });
  return pageMetadata({
    title: ts("title"),
    description: t("storiesDescription"),
    path: "/stories",
    locale: locale as Locale,
  });
}

export default async function StoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeStr } = await params;
  setRequestLocale(localeStr);
  const locale = localeStr as Locale;
  const t = await getTranslations("stories");
  const articles = await getPublishedArticles();

  return (
    <div className="container-editorial py-16 md:py-20">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow mb-3">{t("title")}</p>
        <h1 className="display text-5xl md:text-6xl">{t("title")}</h1>
        <p className="mt-4 text-lg text-charcoal-soft">{t("subtitle")}</p>
      </header>

      {articles.length === 0 ? (
        <EmptyState title={t("empty.title")} body={t("empty.body")} />
      ) : (
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
