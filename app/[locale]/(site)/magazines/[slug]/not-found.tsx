import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function IssueNotFound() {
  const t = await getTranslations("issue.notFound");
  return (
    <div className="container-editorial py-28 text-center">
      <p className="font-[family-name:var(--font-serif)] text-6xl text-champagne-deep">
        JoD
      </p>
      <h1 className="display mt-4 text-4xl">{t("title")}</h1>
      <p className="mx-auto mt-3 max-w-md text-charcoal-soft">{t("body")}</p>
      <Link href="/magazines" className="btn btn-primary mt-8">
        {t("cta")}
      </Link>
    </div>
  );
}
