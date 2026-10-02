import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("errors");
  return (
    <div className="container-editorial flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-[family-name:var(--font-serif)] text-6xl text-champagne-deep">
        JoD
      </p>
      <h1 className="display mt-4 text-4xl">{t("notFoundTitle")}</h1>
      <p className="mt-3 max-w-md text-charcoal-soft">{t("notFoundBody")}</p>
      <Link href="/" className="btn btn-primary mt-8">
        {t("notFoundCta")}
      </Link>
    </div>
  );
}
