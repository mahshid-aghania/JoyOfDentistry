import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function StoryNotFound() {
  const t = await getTranslations("stories.notFound");
  return (
    <div className="container-editorial py-28 text-center">
      <h1 className="display text-4xl">{t("title")}</h1>
      <p className="mx-auto mt-3 max-w-md text-charcoal-soft">{t("body")}</p>
      <Link href="/stories" className="btn btn-primary mt-8">
        {t("cta")}
      </Link>
    </div>
  );
}
