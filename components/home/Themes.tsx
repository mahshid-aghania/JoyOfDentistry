import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";

const THEMES = [
  "dentistLife",
  "mindWellbeing",
  "patientStories",
  "behindScenes",
  "ideasInnovation",
  "marketingGrowth",
  "lifeBeyond",
] as const;

/**
 * The editorial themes — the recurring threads of the magazine. Presentational
 * tiles (no fabricated links), numbered like a contents page.
 */
export async function Themes() {
  const t = await getTranslations("home");
  const tt = await getTranslations("themes");

  return (
    <section className="container-editorial py-20 md:py-28">
      <SectionHeading
        eyebrow={t("themesHeading")}
        title={t("themesHeading")}
        subtitle={t("themesSubtitle")}
      />
      <ul className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((key, i) => (
          <li
            key={key}
            className="group flex flex-col justify-between bg-ivory p-7 transition-colors hover:bg-paper"
          >
            <div className="mb-8 flex items-baseline justify-between">
              <span className="font-[family-name:var(--font-serif)] text-2xl text-champagne-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className="h-px w-10 bg-line-strong transition-all duration-500 group-hover:w-16 group-hover:bg-burgundy"
              />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-serif)] text-2xl leading-tight text-charcoal transition-colors group-hover:text-burgundy">
                {tt(`${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                {tt(`${key}.description`)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
