"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { clsx } from "clsx";
import type { Locale } from "@/i18n/routing";

/**
 * English | فارسی switcher. Replaces the current route in the other locale so
 * the visitor stays on the same page, preserving their place.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // `pathname` from next-intl is the locale-less path with dynamic segments
    // already resolved (e.g. "/magazines/issue-1"). Read the live query string
    // at click time (rather than useSearchParams) to avoid a static-render
    // bailout in the always-present header.
    const qs =
      typeof window !== "undefined" ? window.location.search : "";
    const target = qs ? `${pathname}${qs}` : pathname;
    startTransition(() => {
      router.replace(target, { locale: next });
    });
  }

  const options: { code: Locale; label: string }[] = [
    { code: "en", label: "English" },
    { code: "fa", label: "فارسی" },
  ];

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1 text-sm",
        isPending && "opacity-60",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {options.map((opt, i) => (
        <span key={opt.code} className="inline-flex items-center">
          {i > 0 && (
            <span aria-hidden className="mx-1.5 text-line-strong">
              |
            </span>
          )}
          <button
            type="button"
            onClick={() => switchTo(opt.code)}
            aria-current={opt.code === locale ? "true" : undefined}
            className={clsx(
              "transition-colors",
              opt.code === locale
                ? "text-burgundy"
                : "text-charcoal-mute hover:text-charcoal",
              opt.code === "fa" && "font-[family-name:var(--font-farsi)]",
            )}
            lang={opt.code}
          >
            {opt.label}
          </button>
        </span>
      ))}
    </div>
  );
}
