import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAdminContext } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState } from "@/components/ui/EmptyState";

// Admin is always rendered on demand — it depends on the request session.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ctx = await getAdminContext();
  const t = await getTranslations("admin");

  if (!ctx.configured) {
    return (
      <div className="container-editorial py-24">
        <EmptyState
          title={t("notConfigured.title")}
          body={t("notConfigured.body")}
        />
      </div>
    );
  }

  if (!ctx.isAdmin) {
    return <AdminLogin signedInNotAdmin={ctx.signedIn} />;
  }

  return <AdminShell email={ctx.email}>{children}</AdminShell>;
}
