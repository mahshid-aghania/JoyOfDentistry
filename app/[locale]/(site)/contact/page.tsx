import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/site/ContactForm";
import { getSiteContent } from "@/lib/queries";
import { isContactConfigured } from "@/lib/env";
import { localizedField } from "@/lib/types";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const tc = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({
    title: tc("title"),
    description: t("contactDescription"),
    path: "/contact",
    locale: locale as Locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeStr } = await params;
  setRequestLocale(localeStr);
  const locale = localeStr as Locale;

  const t = await getTranslations("contact");
  const content = await getSiteContent();
  const details = localizedField(
    content as unknown as Record<string, unknown>,
    "contact_info",
    locale,
  );
  const social = (content.social_links ?? []).filter((s) => s.url?.trim());

  return (
    <div className="container-editorial py-16 md:py-24">
      <header className="mb-16 max-w-2xl">
        <p className="eyebrow mb-3">{t("title")}</p>
        <h1 className="display text-5xl md:text-6xl">{t("title")}</h1>
        <p className="mt-4 text-lg text-charcoal-soft">{t("subtitle")}</p>
      </header>

      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <h2 className="eyebrow mb-5">{t("detailsHeading")}</h2>
          {details ? (
            <p className="whitespace-pre-line text-lg leading-relaxed text-charcoal-soft">
              {details}
            </p>
          ) : null}
          {social.length > 0 && (
            <ul className="mt-6 space-y-2">
              {social.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-charcoal-soft hover:text-charcoal"
                  >
                    {s.label || s.url}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="eyebrow mb-5">{t("formHeading")}</h2>
          {isContactConfigured ? (
            <ContactForm />
          ) : (
            <p className="border border-dashed border-line-strong bg-paper/50 p-6 text-charcoal-soft">
              {t("disabled")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
