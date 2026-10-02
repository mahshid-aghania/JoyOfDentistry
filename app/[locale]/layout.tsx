import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { clsx } from "clsx";
import { routing, direction, type Locale } from "@/i18n/routing";
import { siteUrl } from "@/lib/env";
import { serif, sans, farsi } from "@/app/fonts";
import "@/app/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const brand = await getTranslations({ locale, namespace: "brand" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${brand("name")} — ${brand("tagline")}`,
      template: `%s · ${brand("name")}`,
    },
    description: t("siteDescription"),
    icons: { icon: "/favicon.svg" },
    openGraph: {
      siteName: brand("name"),
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const dir = direction[locale as Locale];
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={dir}
      className={clsx(serif.variable, sans.variable, farsi.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
