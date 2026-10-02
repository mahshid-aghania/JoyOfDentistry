import { Link } from "@/i18n/navigation";
import { clsx } from "clsx";

/**
 * The Joy of Dentistry wordmark. `compact` renders the secondary "JoD" mark.
 * Always set in the Latin serif regardless of UI language, as a brand constant.
 */
export function Wordmark({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={clsx("group inline-flex items-baseline gap-2", className)}
      aria-label="Joy of Dentistry — home"
    >
      {compact ? (
        <span
          className="font-[family-name:var(--font-serif)] text-2xl font-semibold tracking-tight text-charcoal"
          dir="ltr"
        >
          JoD
        </span>
      ) : (
        <span className="flex items-baseline gap-2" dir="ltr">
          <span className="font-[family-name:var(--font-serif)] text-[1.6rem] leading-none font-semibold tracking-tight text-charcoal transition-colors group-hover:text-burgundy">
            Joy of Dentistry
          </span>
          <span
            aria-hidden
            className="hidden text-[0.7rem] uppercase tracking-[0.3em] text-charcoal-mute sm:inline"
          >
            JoD
          </span>
        </span>
      )}
    </Link>
  );
}
