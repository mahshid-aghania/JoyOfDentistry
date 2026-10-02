import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Cover } from "./Cover";
import { formatPublicationDate } from "@/lib/format";
import { localizedTitle, type Issue } from "@/lib/types";
import type { Locale } from "@/i18n/routing";

/** A single issue in the archive grid — a volume on the shelf. */
export async function IssueCard({
  issue,
  locale,
  priority = false,
  sizes,
}: {
  issue: Issue;
  locale: Locale;
  priority?: boolean;
  sizes?: string;
}) {
  const t = await getTranslations("home");
  const ct = await getTranslations("contentLanguage");
  const title = localizedTitle(issue, locale);
  const date = formatPublicationDate(issue.publication_date, locale);

  return (
    <Link href={`/magazines/${issue.slug}`} className="group block">
      <Cover
        issue={issue}
        locale={locale}
        priority={priority}
        sizes={sizes}
        className="card-lift"
      />
      <div className="mt-4">
        <p className="eyebrow">{t("issueLabel", { number: issue.issue_number })}</p>
        <h3 className="mt-1.5 font-[family-name:var(--font-serif)] text-xl leading-tight text-charcoal transition-colors group-hover:text-burgundy">
          {title || t("issueLabel", { number: issue.issue_number })}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-charcoal-mute">
          {date && <span>{date}</span>}
          {date && <span aria-hidden>·</span>}
          <span>{ct(issue.content_language)}</span>
        </div>
      </div>
    </Link>
  );
}
