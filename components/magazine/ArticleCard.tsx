import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { coverUrl } from "@/lib/storage";
import { localizedField, type Article } from "@/lib/types";
import type { Locale } from "@/i18n/routing";

export async function ArticleCard({
  article,
  locale,
}: {
  article: Article;
  locale: Locale;
}) {
  const t = await getTranslations("stories");
  const row = article as unknown as Record<string, unknown>;
  const title = localizedField(row, "title", locale);
  const excerpt = localizedField(row, "excerpt", locale);
  const cover = coverUrl(article.cover_path);

  return (
    <Link href={`/stories/${article.slug}`} className="group block">
      {cover ? (
        <div className="cover-frame card-lift aspect-[4/3]">
          <Image
            src={cover}
            alt={localizedField(row, "cover_alt", locale) || title}
            width={800}
            height={600}
            sizes="(min-width: 1024px) 24rem, 90vw"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="cover-frame card-lift flex aspect-[4/3] items-center justify-center bg-ivory-deep">
          <span className="font-[family-name:var(--font-serif)] text-4xl text-champagne-deep">
            JoD
          </span>
        </div>
      )}

      <div className="mt-4">
        {article.category && <p className="eyebrow">{article.category}</p>}
        <h3 className="mt-1.5 font-[family-name:var(--font-serif)] text-xl leading-tight text-charcoal transition-colors group-hover:text-burgundy">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-charcoal-soft">{excerpt}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-charcoal-mute">
          {article.author && <span>{t("by", { author: article.author })}</span>}
          {article.author && article.reading_minutes && <span aria-hidden>·</span>}
          {article.reading_minutes && (
            <span>{t("readingTime", { minutes: article.reading_minutes })}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
