"use client";

import { useTranslations } from "next-intl";

export default function MagazinesError({ reset }: { reset: () => void }) {
  const t = useTranslations("magazines.error");
  const ta = useTranslations("actions");
  return (
    <div className="container-editorial py-24 text-center">
      <h1 className="display text-4xl">{t("title")}</h1>
      <p className="mt-3 text-charcoal-soft">{t("body")}</p>
      <button type="button" onClick={reset} className="btn btn-outline mt-8">
        {ta("retry")}
      </button>
    </div>
  );
}
