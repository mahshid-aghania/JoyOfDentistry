import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Wordmark } from "./Wordmark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getSiteContent } from "@/lib/queries";
import { localizedField } from "@/lib/types";
import type { Locale } from "@/i18n/routing";

const NAV = [
  { href: "/magazines", key: "magazines" },
  { href: "/stories", key: "stories" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const content = await getSiteContent();
  const contactInfo = localizedField(
    content as unknown as Record<string, unknown>,
    "contact_info",
    locale,
  );
  const social = (content.social_links ?? []).filter((s) => s.url?.trim());
  const year = new Date().getUTCFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-ivory-deep">
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Wordmark />
          <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">
            {t("tagline")}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow mb-4">{t("explore")}</h2>
          <ul className="space-y-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="link-underline text-charcoal-soft hover:text-charcoal"
                >
                  {tn(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow mb-4">{t("connect")}</h2>
          {contactInfo ? (
            <p className="whitespace-pre-line text-sm leading-relaxed text-charcoal-soft">
              {contactInfo}
            </p>
          ) : null}
          {social.length > 0 && (
            <ul className="mt-3 space-y-2.5 text-sm">
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
          <h2 className="eyebrow mb-4">{t("language")}</h2>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-editorial flex flex-col items-center justify-between gap-2 py-6 text-xs text-charcoal-mute sm:flex-row">
          <p>
            © {year} {t("builtWith")}. {t("rights")}
          </p>
          <p className="font-[family-name:var(--font-serif)] text-sm tracking-tight">
            JoD
          </p>
        </div>
      </div>
    </footer>
  );
}
