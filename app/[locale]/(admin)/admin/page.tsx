import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getIssuesForAdmin } from "@/lib/admin/data";
import { IssuesTable } from "@/components/admin/IssuesTable";
import type { Locale } from "@/i18n/routing";

export default async function AdminIssuesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin.issues");
  const issues = await getIssuesForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-serif)] text-3xl">
          {t("heading")}
        </h1>
        <Link href="/admin/issues/new" className="btn btn-primary">
          {t("new")}
        </Link>
      </div>

      <IssuesTable issues={issues} locale={locale as Locale} />
    </div>
  );
}
