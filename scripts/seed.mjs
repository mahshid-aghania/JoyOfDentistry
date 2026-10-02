// Seed the Joy of Dentistry archive from magazine PDFs.
//
//   node --env-file=.env.local scripts/seed.mjs [pdfDir]
//
// For each PDF it:
//   1. renders the first page to a cover (true proportions, never cropped),
//   2. uploads the PDF and the cover to Supabase Storage,
//   3. upserts a PUBLISHED issue row.
//
// Nothing is invented: only the issue number is taken from the filename
// (JOD01 → 1). Titles, descriptions, and publication dates are left EMPTY and
// fully editable in the admin dashboard. Re-running is safe (idempotent upsert).
//
// Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// Optional admin bootstrap: ADMIN_EMAILS + SEED_ADMIN_PASSWORD create the
// editor login(s) if they don't exist yet.

import { createClient } from "@supabase/supabase-js";
import { pdf } from "pdf-to-img";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "✗ Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const pdfDir = resolve(
  process.argv[2] || process.env.JOD_PDF_DIR || join(root, "seed-assets/pdfs"),
);

// Content language of the seeded PDFs. The sample issues are Farsi; adjust per
// issue later in the dashboard if any edition differs.
const DEFAULT_CONTENT_LANGUAGE = process.env.SEED_CONTENT_LANGUAGE || "fa";

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function issueNumberFromFilename(name) {
  const m = name.match(/jod0*?(\d+)/i);
  return m ? Number(m[1]) : null;
}

function pngSize(buf) {
  if (buf.length < 24) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function ensureBucket(id) {
  const { error } = await supabase.storage.createBucket(id, { public: true });
  if (error && !/exists/i.test(error.message)) {
    console.warn(`  · bucket ${id}: ${error.message}`);
  }
}

async function bootstrapAdmins() {
  const emails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!emails.length || !password) return;

  for (const email of emails) {
    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error && !/already/i.test(error.message)) {
      console.warn(`  · admin ${email}: ${error.message}`);
    } else if (!error) {
      console.log(`  ✓ admin user created: ${email}`);
    }
  }
}

async function main() {
  console.log("Seeding Joy of Dentistry\n");

  await ensureBucket("covers");
  await ensureBucket("pdfs");
  await bootstrapAdmins();

  let files;
  try {
    files = readdirSync(pdfDir).filter((f) => f.toLowerCase().endsWith(".pdf"));
  } catch {
    console.error(`✗ Could not read PDF directory: ${pdfDir}`);
    process.exit(1);
  }
  if (!files.length) {
    console.error(`✗ No PDFs found in ${pdfDir}`);
    process.exit(1);
  }
  files.sort();

  const numbers = files
    .map(issueNumberFromFilename)
    .filter((n) => n != null);
  const maxNumber = Math.max(...numbers);

  console.log(`Found ${files.length} PDF(s) in ${pdfDir}\n`);

  let seeded = 0;
  let order = 0;
  for (const file of files) {
    const number = issueNumberFromFilename(file);
    if (number == null) {
      console.warn(`  · skipped ${file} (no issue number)`);
      continue;
    }

    const srcPath = join(pdfDir, file);
    const slug = `issue-${number}`;

    try {
      // Render cover from page 1.
      const document = await pdf(srcPath, { scale: 2 });
      let cover = null;
      for await (const page of document) {
        cover = page;
        break;
      }
      if (!cover) throw new Error("no pages");
      const dims = pngSize(cover) || {};

      // Upload PDF.
      const { readFileSync } = await import("node:fs");
      const pdfBytes = readFileSync(srcPath);
      const pdfKey = `${slug}.pdf`;
      const up1 = await supabase.storage
        .from("pdfs")
        .upload(pdfKey, pdfBytes, { contentType: "application/pdf", upsert: true });
      if (up1.error) throw up1.error;

      // Upload cover.
      const coverKey = `${slug}.png`;
      const up2 = await supabase.storage
        .from("covers")
        .upload(coverKey, cover, { contentType: "image/png", upsert: true });
      if (up2.error) throw up2.error;

      // Upsert the published issue row (empty, editable metadata).
      const row = {
        issue_number: number,
        slug,
        content_language: DEFAULT_CONTENT_LANGUAGE,
        cover_path: coverKey,
        cover_width: dims.width ?? null,
        cover_height: dims.height ?? null,
        pdf_en_path: pdfKey,
        status: "published",
        is_featured: number === maxNumber,
        downloads_enabled: true,
        sort_order: order++,
      };
      const { error } = await supabase
        .from("issues")
        .upsert(row, { onConflict: "slug" });
      if (error) throw error;

      seeded++;
      console.log(
        `  ✓ Issue ${number}${number === maxNumber ? " (featured)" : ""} ` +
          `— cover ${dims.width || "?"}×${dims.height || "?"}, PDF ${(
            pdfBytes.length /
            1024 /
            1024
          ).toFixed(1)} MB`,
      );
    } catch (e) {
      console.error(`  ✗ Issue ${number}: ${e.message}`);
    }
  }

  console.log(
    `\nDone. ${seeded}/${files.length} issue(s) published.\n` +
      `Titles, descriptions, and publication dates are empty and editable at /en/admin.`,
  );
}

main();
