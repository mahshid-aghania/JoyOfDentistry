import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fa"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Text direction per locale. */
export const direction: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fa: "rtl",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always show the locale in the URL: /en/... and /fa/...
  localePrefix: "always",
});
