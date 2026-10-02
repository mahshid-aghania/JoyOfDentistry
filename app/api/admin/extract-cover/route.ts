import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getAdminContext } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUCKET_COVERS, BUCKET_PDFS } from "@/lib/env";
import { pngDimensions } from "@/lib/image-dims";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Render the first page of an uploaded PDF to a PNG and store it as a cover.
 * The true page proportions are preserved (nothing is cropped or stretched).
 */
export async function POST(request: Request) {
  const ctx = await getAdminContext();
  if (!ctx.configured)
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!ctx.isAdmin)
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const admin = createAdminClient();
  if (!admin)
    return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const { pdfPath } = (await request.json().catch(() => ({}))) as {
    pdfPath?: string;
  };
  if (!pdfPath)
    return NextResponse.json({ error: "no_pdf" }, { status: 400 });

  const { data: blob, error: dlError } = await admin.storage
    .from(BUCKET_PDFS)
    .download(pdfPath);
  if (dlError || !blob)
    return NextResponse.json({ error: "download_failed" }, { status: 404 });

  try {
    const { pdf } = await import("pdf-to-img");
    const buffer = Buffer.from(await blob.arrayBuffer());
    // scale 2 gives a crisp cover without excessive weight.
    const document = await pdf(buffer, { scale: 2 });
    let firstPage: Buffer | null = null;
    for await (const page of document) {
      firstPage = page as Buffer;
      break;
    }
    if (!firstPage)
      return NextResponse.json({ error: "render_failed" }, { status: 500 });

    const path = `${randomUUID()}.png`;
    const { error: upError } = await admin.storage
      .from(BUCKET_COVERS)
      .upload(path, firstPage, { contentType: "image/png", upsert: false });
    if (upError)
      return NextResponse.json({ error: upError.message }, { status: 500 });

    const dims = pngDimensions(new Uint8Array(firstPage));
    return NextResponse.json({
      path,
      width: dims?.width ?? null,
      height: dims?.height ?? null,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "render_failed", detail: (e as Error).message },
      { status: 500 },
    );
  }
}
