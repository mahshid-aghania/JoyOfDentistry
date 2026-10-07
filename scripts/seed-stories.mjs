// Seed the MiNa / Joy of Dentistry Stories into Supabase.
//
//   node --env-file=.env.local scripts/seed-stories.mjs
//
// For each content/mina-stories/articles/<slug>.html it:
//   1. parses the "<!--META-->" header (title, excerpt, reading_minutes),
//   2. uploads content/mina-stories/pdf/<slug>.pdf to the public "pdfs" bucket
//      at stories/<slug>.pdf (if the PDF exists),
//   3. upserts a PUBLISHED article row (English body; Farsi left null).
//
// Idempotent: upsert on the unique slug. Requires NEXT_PUBLIC_SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY. Author, category and the one contextual MiNa link
// come from the article HTML + manifest; nothing is invented here.

// supabase-js constructs a realtime client that expects a global WebSocket;
// Node < 22 lacks one, so polyfill it (install: npm i --no-save ws).
import { WebSocket as WS } from "ws";
if (!globalThis.WebSocket) globalThis.WebSocket = WS;

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (use --env-file=.env.local)");
  process.exit(1);
}

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const articlesDir = join(root, "content/mina-stories/articles");
const pdfDir = join(root, "content/mina-stories/pdf");
const manifest = JSON.parse(readFileSync(join(root, "content/mina-stories/manifest.json"), "utf8"));
const bySlug = Object.fromEntries(manifest.articles.map((a) => [a.slug, a]));

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function parseMeta(raw) {
  const m = raw.match(/<!--META([\s\S]*?)-->/);
  const meta = { title: "", excerpt: "", reading_minutes: null };
  if (m) {
    for (const line of m[1].split("\n")) {
      const kv = line.match(/^\s*(title|excerpt|reading_minutes)\s*:\s*(.+?)\s*$/);
      if (kv) meta[kv[1]] = kv[2];
    }
  }
  const body = raw.replace(/<!--META[\s\S]*?-->/, "").trim();
  return { meta, body };
}

async function ensureBucket(id) {
  const { error } = await supabase.storage.createBucket(id, { public: true });
  if (error && !/exists/i.test(error.message)) console.warn(`  · bucket ${id}: ${error.message}`);
}

async function main() {
  await ensureBucket("pdfs");
  const files = readdirSync(articlesDir).filter((f) => f.endsWith(".html")).sort();
  console.log(`Seeding ${files.length} stories…`);

  // Order published_at so the manifest order is preserved in the Stories feed
  // (feed sorts by published_at desc), oldest "n" gets the earliest timestamp.
  const base = Date.parse("2026-10-07T12:00:00Z");

  let ok = 0;
  for (const f of files) {
    const slug = basename(f, ".html");
    const spec = bySlug[slug];
    if (!spec) { console.warn(`  · ${slug}: not in manifest, skipping`); continue; }
    const { meta, body } = parseMeta(readFileSync(join(articlesDir, f), "utf8"));

    // Upload the PDF if present.
    let pdf_path = null;
    const localPdf = join(pdfDir, `${slug}.pdf`);
    if (existsSync(localPdf)) {
      const key = `stories/${slug}.pdf`;
      const { error: upErr } = await supabase.storage
        .from("pdfs")
        .upload(key, readFileSync(localPdf), { contentType: "application/pdf", upsert: true });
      if (upErr) console.warn(`  · ${slug} pdf upload: ${upErr.message}`);
      else pdf_path = key;
    } else {
      console.warn(`  · ${slug}: no PDF found (run generate-story-pdfs.mjs first)`);
    }

    const published_at = new Date(base - (spec.n - 1) * 60000).toISOString();
    const row = {
      slug,
      title_en: meta.title || spec.title,
      excerpt_en: meta.excerpt || null,
      body_en: body,
      author: spec.author || null,
      category: spec.category || null,
      reading_minutes: meta.reading_minutes ? Number(meta.reading_minutes) : null,
      pdf_path,
      status: "published",
      published_at,
    };

    const { error } = await supabase.from("articles").upsert(row, { onConflict: "slug" });
    if (error) console.error(`  ✗ ${slug}: ${error.message}`);
    else { ok++; process.stdout.write("."); }
  }
  console.log(`\n✓ ${ok}/${files.length} stories upserted (published).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
