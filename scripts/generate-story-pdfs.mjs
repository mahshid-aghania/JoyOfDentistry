// Generate a branded PDF for each MiNa/Joy of Dentistry Story.
//
//   node scripts/generate-story-pdfs.mjs
//
// Reads every content/mina-stories/articles/<slug>.html (a "<!--META-->" header
// + body HTML), wraps it in a print-styled Joy of Dentistry template, and uses
// headless Chrome to render content/mina-stories/pdf/<slug>.pdf. Hyperlinks in
// the body (including the one contextual MiNa link) stay clickable in the PDF.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const articlesDir = join(root, "content/mina-stories/articles");
const outDir = join(root, "content/mina-stories/pdf");
const tmpDir = join(root, "content/mina-stories/.pdf-tmp");
const manifest = JSON.parse(readFileSync(join(root, "content/mina-stories/manifest.json"), "utf8"));
const bySlug = Object.fromEntries(manifest.articles.map((a) => [a.slug, a]));

const CHROME =
  process.env.CHROME_BIN ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

if (!existsSync(CHROME)) {
  console.error(`Chrome not found at: ${CHROME}\nSet CHROME_BIN to your Chrome/Chromium binary.`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

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

function esc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function template({ title, author, category, readingMinutes, body }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<style>
  @page { size: Letter; margin: 20mm 18mm 18mm; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html { font-family: Georgia, "Times New Roman", serif; color: #2b2622; font-size: 11.5pt; line-height: 1.6; }
  .eyebrow { font-family: Arial, Helvetica, sans-serif; letter-spacing: .14em; text-transform: uppercase;
             font-size: 8.5pt; color: #7a2230; margin: 0 0 10px; }
  h1 { font-size: 24pt; line-height: 1.15; margin: 0 0 10px; color: #211d1a; }
  .byline { font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; color: #6a6058; margin: 0 0 4px; }
  .rule { height: 2px; background: #c9a86a; width: 54px; margin: 16px 0 22px; }
  h2 { font-size: 15pt; margin: 22px 0 8px; color: #211d1a; }
  h3 { font-family: Arial, Helvetica, sans-serif; font-size: 11.5pt; font-weight: 700; margin: 16px 0 5px; color: #211d1a; }
  p { margin: 0 0 11px; }
  ul, ol { margin: 0 0 12px; padding-left: 20px; }
  li { margin-bottom: 5px; }
  a { color: #7a2230; text-decoration: underline; }
  strong { color: #211d1a; }
  table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 10pt; }
  th, td { border: 1px solid #ddd3c4; padding: 6px 8px; text-align: left; vertical-align: top; }
  th { background: #f4efe6; }
  blockquote { border-left: 2px solid #c9a86a; padding-left: 12px; margin: 14px 0; font-style: italic; }
  .foot { margin-top: 26px; padding-top: 12px; border-top: 1px solid #e4dccd;
          font-family: Arial, Helvetica, sans-serif; font-size: 8.5pt; color: #8a8178; }
</style></head>
<body>
  <p class="eyebrow">Joy of Dentistry${category ? " &middot; " + esc(category) : ""}</p>
  <h1>${esc(title)}</h1>
  ${author ? `<p class="byline">By ${esc(author)}${readingMinutes ? " &middot; " + esc(readingMinutes) + " min read" : ""}</p>` : ""}
  <div class="rule"></div>
  ${body}
  <p class="foot">Published by Joy of Dentistry (jodmagazine.com). Educational content only; it is not a substitute for a professional dental examination and individual advice.</p>
</body></html>`;
}

const files = readdirSync(articlesDir).filter((f) => f.endsWith(".html"));
console.log(`Rendering ${files.length} PDFs via Chrome…`);
let ok = 0;
for (const f of files) {
  const slug = basename(f, ".html");
  const spec = bySlug[slug] || {};
  const { meta, body } = parseMeta(readFileSync(join(articlesDir, f), "utf8"));
  const html = template({
    title: meta.title,
    author: spec.author,
    category: spec.category,
    readingMinutes: meta.reading_minutes,
    body,
  });
  const tmpHtml = join(tmpDir, `${slug}.html`);
  const outPdf = join(outDir, `${slug}.pdf`);
  writeFileSync(tmpHtml, html);
  try {
    execFileSync(
      CHROME,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--no-pdf-header-footer",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=2000",
        `--print-to-pdf=${outPdf}`,
        `file://${tmpHtml}`,
      ],
      { stdio: ["ignore", "ignore", "pipe"] },
    );
    ok++;
    process.stdout.write(".");
  } catch (e) {
    console.error(`\n✗ ${slug}: ${e.message}`);
  }
}
rmSync(tmpDir, { recursive: true, force: true });
console.log(`\n✓ ${ok}/${files.length} PDFs written to ${outDir}`);
