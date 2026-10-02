/**
 * Central, typed access to environment configuration.
 *
 * The site is designed to run in a safe "not yet configured" state: when
 * Supabase credentials are absent, data reads return empty results and the
 * admin area shows a setup notice instead of crashing.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
export const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

/** True when the public Supabase client can be constructed. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** True when trusted server operations (uploads, seed) are possible. */
export const isServiceRoleConfigured = Boolean(
  supabaseUrl && supabaseServiceRoleKey,
);

/** Admin allowlist. Only these emails may enter /admin. */
export const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails.includes(email.toLowerCase());
}

/** Canonical public origin, no trailing slash. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

/** Upload limits (MB), configurable. */
export const maxCoverMb = Number(process.env.NEXT_PUBLIC_MAX_COVER_MB || 10);
export const maxPdfMb = Number(process.env.NEXT_PUBLIC_MAX_PDF_MB || 60);

/** Contact delivery is only offered when a real service is configured. */
export const isContactConfigured = Boolean(
  process.env.RESEND_API_KEY &&
    process.env.CONTACT_TO_EMAIL &&
    process.env.CONTACT_FROM_EMAIL,
);

/** Newsletter signup is only shown when a provider is configured. */
export const newsletterProvider = (
  process.env.NEWSLETTER_PROVIDER || ""
).trim().toLowerCase();
export const isNewsletterConfigured =
  newsletterProvider === "resend" &&
  Boolean(process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID);

/** Storage bucket names. */
export const BUCKET_COVERS = "covers";
export const BUCKET_PDFS = "pdfs";
