import { getTranslations } from "next-intl/server";
import { isNewsletterConfigured } from "@/lib/env";
import { NewsletterForm } from "./NewsletterForm";

/**
 * Renders the newsletter signup ONLY when a real provider is configured.
 * We never show a form that would silently discard submissions.
 */
export async function NewsletterSection() {
  if (!isNewsletterConfigured) return null;
  const t = await getTranslations("newsletter");

  return (
    <section className="border-y border-line bg-paper">
      <div className="container-editorial flex flex-col items-start gap-8 py-20 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <h2 className="display text-3xl md:text-4xl">{t("heading")}</h2>
          <p className="mt-3 text-charcoal-soft">{t("body")}</p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
