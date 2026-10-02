import type { Locale } from "@/i18n/routing";

/**
 * Format an explicit stored publication date for the active locale.
 * Farsi uses the Persian (Jalali) calendar with Persian digits; English uses a
 * long Gregorian date. Returns an empty string for missing dates.
 */
export function formatPublicationDate(
  iso: string | null | undefined,
  locale: Locale,
): string {
  if (!iso) return "";
  // Parse as a plain calendar date (avoid timezone drift).
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  const date = new Date(Date.UTC(y, m - 1, d));

  const formatter = new Intl.DateTimeFormat(
    locale === "fa" ? "fa-IR" : "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  );
  return formatter.format(date);
}

/** Year of a publication date, as a number (or null). */
export function publicationYear(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const y = Number(iso.split("-")[0]);
  return Number.isFinite(y) ? y : null;
}
