import { getTranslations } from "next-intl/server";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { getSiteContent } from "@/lib/queries";

export default async function AdminContentPage() {
  const t = await getTranslations("admin.content");
  const content = await getSiteContent();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-serif)] text-3xl">
        {t("heading")}
      </h1>
      <p className="mb-8 mt-1 text-charcoal-soft">{t("subtitle")}</p>
      <ContentEditor content={content} />
    </div>
  );
}
