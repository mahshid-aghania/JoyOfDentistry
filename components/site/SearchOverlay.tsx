"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";

/**
 * Search overlay. Submitting routes to the Magazines archive with the query,
 * which performs the bilingual search across issue titles and descriptions.
 */
export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const t = useTranslations("search");
  const router = useRouter();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    onClose();
    router.push(q ? `/magazines?search=${encodeURIComponent(q)}` : "/magazines");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-charcoal/40 px-6 pt-[18vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl animate-fade-rise">
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm text-paper/90 hover:text-paper"
          >
            <CloseIcon width={18} height={18} />
            {t("title")}
          </button>
        </div>
        <form onSubmit={submit} className="bg-paper p-2 shadow-[var(--shadow-cover)]">
          <div className="flex items-center gap-3 px-4">
            <SearchIcon className="shrink-0 text-charcoal-mute" />
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("placeholder")}
              className="w-full bg-transparent py-4 text-lg outline-none placeholder:text-charcoal-mute"
              aria-label={t("placeholder")}
            />
          </div>
        </form>
        <p className="mt-3 text-center text-sm text-paper/80">{t("hint")}</p>
      </div>
    </div>
  );
}
