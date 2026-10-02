import Image from "next/image";
import { clsx } from "clsx";
import { coverUrl } from "@/lib/storage";
import type { Issue } from "@/lib/types";
import type { Locale } from "@/i18n/routing";
import { localizedField } from "@/lib/types";

/**
 * Presents a magazine cover with its true proportions preserved (never cropped,
 * never stretched). Falls back to an elegant typographic placeholder when no
 * cover image exists yet.
 */
export function Cover({
  issue,
  locale,
  sizes = "(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw",
  priority = false,
  className,
}: {
  issue: Pick<
    Issue,
    | "cover_path"
    | "cover_width"
    | "cover_height"
    | "cover_alt_en"
    | "cover_alt_fa"
    | "issue_number"
    | "title_en"
    | "title_fa"
  >;
  locale: Locale;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const url = coverUrl(issue.cover_path);
  const alt =
    localizedField(
      issue as unknown as Record<string, unknown>,
      "cover_alt",
      locale,
    ) ||
    localizedField(issue as unknown as Record<string, unknown>, "title", locale) ||
    `Joy of Dentistry — issue ${issue.issue_number}`;

  if (!url) {
    return (
      <div
        className={clsx(
          "cover-frame flex aspect-[3/4] items-center justify-center bg-ivory-deep",
          className,
        )}
      >
        <div className="text-center">
          <p className="font-[family-name:var(--font-serif)] text-5xl text-champagne-deep">
            JoD
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-charcoal-mute">
            № {issue.issue_number}
          </p>
        </div>
      </div>
    );
  }

  const width = issue.cover_width ?? 900;
  const height = issue.cover_height ?? 1200;

  return (
    <div className={clsx("cover-frame", className)}>
      <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="h-auto w-full"
      />
    </div>
  );
}
