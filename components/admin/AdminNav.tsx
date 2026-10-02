"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { clsx } from "clsx";

const LINKS = [
  { href: "/admin", key: "issues", exact: true },
  { href: "/admin/content", key: "content", exact: false },
] as const;

export function AdminNav() {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  function active(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <nav className="flex items-center gap-1 border-b border-line">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={clsx(
            "border-b-2 px-4 py-3 text-sm transition-colors",
            active(l.href, l.exact)
              ? "border-burgundy text-burgundy"
              : "border-transparent text-charcoal-soft hover:text-charcoal",
          )}
        >
          {t(l.key)}
        </Link>
      ))}
    </nav>
  );
}
