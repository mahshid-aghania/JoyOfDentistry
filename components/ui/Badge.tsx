import { getTranslations } from "next-intl/server";
import type { ContentLanguage } from "@/lib/types";

/** Small label marking the actual content language of a magazine's PDF. */
export async function ContentLanguageBadge({
  language,
}: {
  language: ContentLanguage;
}) {
  const t = await getTranslations("contentLanguage");
  return (
    <span className="inline-flex items-center gap-1.5 border border-line-strong px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.12em] text-charcoal-soft">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-champagne-deep" />
      {t(language)}
    </span>
  );
}
