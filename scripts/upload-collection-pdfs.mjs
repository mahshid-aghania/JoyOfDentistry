// Upload the two MiNa/JoD collection PDFs to the public "pdfs" bucket.
//   node --env-file=.env.local scripts/upload-collection-pdfs.mjs
import { WebSocket as WS } from "ws";
if (!globalThis.WebSocket) globalThis.WebSocket = WS;
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("✗ Missing Supabase env (use --env-file=.env.local)"); process.exit(1); }

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const uploads = [
  { src: "/Users/mahshid/MiNa-JoD-50-Articles-Combined.pdf", key: "collections/mina-50-articles-combined.pdf" },
  { src: "/Users/mahshid/MiNa-JoD-50-Stories.pdf", key: "collections/mina-50-stories-index.pdf" },
];

const main = async () => {
  const { error: be } = await supabase.storage.createBucket("pdfs", { public: true });
  if (be && !/exists/i.test(be.message)) console.warn("bucket:", be.message);
  for (const u of uploads) {
    if (!existsSync(u.src)) { console.error(`✗ missing ${u.src}`); continue; }
    const { error } = await supabase.storage
      .from("pdfs")
      .upload(u.key, readFileSync(u.src), { contentType: "application/pdf", upsert: true });
    if (error) console.error(`✗ ${u.key}: ${error.message}`);
    else console.log(`✓ ${url}/storage/v1/object/public/pdfs/${u.key}`);
  }
};
main().catch((e) => { console.error(e); process.exit(1); });
