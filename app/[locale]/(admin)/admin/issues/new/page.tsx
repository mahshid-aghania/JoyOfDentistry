import { getTranslations } from "next-intl/server";
import { IssueEditor } from "@/components/admin/IssueEditor";

export default async function NewIssuePage() {
  const t = await getTranslations("admin.nav");
  return (
    <div>
      <h1 className="mb-8 font-[family-name:var(--font-serif)] text-3xl">
        {t("newIssue")}
      </h1>
      <IssueEditor issue={null} />
    </div>
  );
}
