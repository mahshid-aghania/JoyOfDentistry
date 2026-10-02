import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { IssueEditor } from "@/components/admin/IssueEditor";
import { getIssueForAdmin } from "@/lib/admin/data";

export default async function EditIssuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = await getIssueForAdmin(id);
  if (!issue) notFound();

  const t = await getTranslations("admin.issues");
  return (
    <div>
      <h1 className="mb-8 font-[family-name:var(--font-serif)] text-3xl">
        {t("edit")} · {t("number")} {issue.issue_number}
      </h1>
      <IssueEditor issue={issue} />
    </div>
  );
}
