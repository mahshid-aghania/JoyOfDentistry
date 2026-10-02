"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import { SearchIcon } from "@/components/ui/icons";

/**
 * Archive controls: bilingual search, year + language filters, and sort.
 * Each change rewrites the URL query, which re-renders the server list and
 * resets the "load more" window.
 */
export function ArchiveFilters({ years }: { years: number[] }) {
  const t = useTranslations("magazines.filters");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function update(next: Record<string, string | null>) {
    const q = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === "") q.delete(key);
      else q.set(key, value);
    }
    // Any filter change resets pagination.
    q.delete("show");
    const query = Object.fromEntries(q.entries());
    startTransition(() => {
      router.push({ pathname: pathname as "/magazines", query });
    });
  }

  const current = {
    search: params.get("search") ?? "",
    year: params.get("year") ?? "",
    language: params.get("language") ?? "",
    sort: params.get("sort") ?? "newest",
  };

  const selectClass =
    "appearance-none border border-line-strong bg-paper px-4 py-2.5 pe-9 text-sm text-charcoal transition-colors hover:border-charcoal focus:border-burgundy outline-none";

  return (
    <div
      className={isPending ? "opacity-70 transition-opacity" : "transition-opacity"}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const value = new FormData(e.currentTarget).get("search");
            update({ search: (value as string)?.trim() || null });
          }}
          className="flex w-full items-center gap-2 border-b border-charcoal-soft pb-2 lg:max-w-sm"
        >
          <SearchIcon className="shrink-0 text-charcoal-mute" width={18} height={18} />
          <input
            name="search"
            defaultValue={current.search}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-charcoal-mute"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              aria-label={t("year")}
              value={current.year}
              onChange={(e) => update({ year: e.target.value || null })}
              className={selectClass}
            >
              <option value="">{t("allYears")}</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <Chevron />
          </div>

          <div className="relative">
            <select
              aria-label={t("language")}
              value={current.language}
              onChange={(e) => update({ language: e.target.value || null })}
              className={selectClass}
            >
              <option value="">{t("allLanguages")}</option>
              <option value="en">EN</option>
              <option value="fa">FA</option>
              <option value="bilingual">EN · FA</option>
            </select>
            <Chevron />
          </div>

          <div className="relative">
            <select
              aria-label={t("sort")}
              value={current.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className={selectClass}
            >
              <option value="newest">{t("newest")}</option>
              <option value="oldest">{t("oldest")}</option>
            </select>
            <Chevron />
          </div>
        </div>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-y-0 end-3 my-auto text-charcoal-mute"
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
