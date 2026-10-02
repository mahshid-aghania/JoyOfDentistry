"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { clsx } from "clsx";
import { Wordmark } from "./Wordmark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchOverlay } from "./SearchOverlay";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";

const NAV = [
  { href: "/", key: "home" },
  { href: "/magazines", key: "magazines" },
  { href: "/stories", key: "stories" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ivory/90 backdrop-blur-md">
      <div className="container-editorial flex h-[4.5rem] items-center justify-between gap-4">
        <Wordmark />

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Primary"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={clsx(
                "link-underline text-sm tracking-wide transition-colors",
                isActive(item.href)
                  ? "text-burgundy"
                  : "text-charcoal-soft hover:text-charcoal",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xs text-charcoal-soft transition-colors hover:text-burgundy"
            aria-label={t("search")}
          >
            <SearchIcon />
          </button>

          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xs text-charcoal-soft transition-colors hover:text-burgundy lg:hidden"
            aria-label={menuOpen ? t("close") : t("menu")}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "overflow-hidden border-t border-line bg-ivory transition-[max-height] duration-300 ease-out lg:hidden",
          menuOpen ? "max-h-[32rem]" : "max-h-0 border-t-0",
        )}
      >
        <nav
          className="container-editorial flex flex-col gap-1 py-4"
          aria-label="Mobile"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={clsx(
                "py-2.5 text-lg",
                isActive(item.href) ? "text-burgundy" : "text-charcoal-soft",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="mt-3 border-t border-line pt-4">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
