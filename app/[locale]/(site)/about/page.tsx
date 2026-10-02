import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Themes } from "@/components/home/Themes";
import { getSiteContent } from "@/lib/queries";
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
  const ta = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({
    title: ta("title"),
    description: t("aboutDescription"),
    path: "/about",
    locale: locale as Locale,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeStr } = await params;
  setRequestLocale(localeStr);
  const locale = localeStr as Locale;

  const t = await getTranslations("about");
  const tb = await getTranslations("brand");
  const content = await getSiteContent();
  const mission = localizedField(
    content as unknown as Record<string, unknown>,
    "about_mission",
    locale,
  );

  return (
    <>
      <section className="border-b border-line">
        <div className="container-editorial py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">{t("title")}</p>
            <h1 className="display text-5xl leading-[1.05] md:text-7xl">
              {tb("tagline")}
            </h1>
          </div>
        </div>
      </section>

      <section className="container-editorial py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <h2 className="display text-3xl md:text-4xl">{t("missionHeading")}</h2>
          <div className="max-w-2xl whitespace-pre-line text-xl leading-relaxed text-charcoal-soft">
            {mission}
          </div>
        </div>
      </section>

      <div className="border-t border-line bg-paper">
        <Themes />
      </div>
    </>
  );
}
