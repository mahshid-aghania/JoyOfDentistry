import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match everything except Next internals, API routes, and files with an
  // extension (static assets). Locale handling applies to page routes only.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
