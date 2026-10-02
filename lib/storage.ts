import { BUCKET_COVERS, BUCKET_PDFS, supabaseUrl } from "@/lib/env";

/**
 * Build a public URL for a storage object key. Public buckets serve objects at
 * a stable, predictable path, so we can construct URLs without a round-trip.
 */
function publicUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path || !supabaseUrl) return null;
  // Already an absolute URL (e.g. legacy data) — pass through.
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.replace(/^\/+/, "");
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${clean}`;
}

export function coverUrl(path: string | null | undefined): string | null {
  return publicUrl(BUCKET_COVERS, path);
}

export function pdfUrl(path: string | null | undefined): string | null {
  return publicUrl(BUCKET_PDFS, path);
}
