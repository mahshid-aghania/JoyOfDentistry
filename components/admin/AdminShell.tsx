import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Wordmark } from "@/components/site/Wordmark";
import { SignOutButton } from "./SignOutButton";
import { AdminNav } from "./AdminNav";

export async function AdminShell({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  const t = await getTranslations("admin");

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-line bg-paper">
        <div className="container-editorial flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Wordmark compact />
            <span className="hidden text-sm text-charcoal-mute sm:inline">
              {t("title")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden text-sm text-charcoal-soft hover:text-burgundy sm:inline"
            >
              ↗ Site
            </Link>
            {email && (
              <span className="hidden text-sm text-charcoal-mute md:inline">
                {email}
              </span>
            )}
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="container-editorial py-10">
        <AdminNav />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
