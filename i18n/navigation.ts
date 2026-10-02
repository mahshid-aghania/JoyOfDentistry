import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation helpers. Using these (instead of next/link) keeps the
// active language in the URL as the visitor moves between pages.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
