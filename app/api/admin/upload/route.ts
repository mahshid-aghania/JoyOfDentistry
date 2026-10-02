import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getAdminContext } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  BUCKET_COVERS,
  BUCKET_PDFS,
  maxCoverMb,
  maxPdfMb,
} from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 60;

const COVER_TYPES = ["image/png", "image/jpeg", "image/webp"];
const PDF_TYPES = ["application/pdf"];

function extFor(type: string): string {
  switch (type) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    case "application/pdf":
      return "pdf";
    default:
      return "bin";
  }
}

export async function POST(request: Request) {
  const ctx = await getAdminContext();
  if (!ctx.configured)
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!ctx.isAdmin)
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const admin = createAdminClient();
  if (!admin)
    return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const form = await request.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") || "");
  const width = Number(form.get("width")) || null;
  const height = Number(form.get("height")) || null;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }

  const isCover = kind === "cover";
  const bucket = isCover ? BUCKET_COVERS : BUCKET_PDFS;
  const allowed = isCover ? COVER_TYPES : PDF_TYPES;
  const limitMb = isCover ? maxCoverMb : maxPdfMb;

  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "bad_type", name: file.name },
      { status: 400 },
    );
  }
  if (file.size > limitMb * 1024 * 1024) {
    return NextResponse.json(
      { error: "too_large", name: file.name, max: limitMb },
      { status: 400 },
    );
  }

  const path = `${randomUUID()}.${extFor(file.type)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await admin.storage.from(bucket).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ path, width, height });
}
