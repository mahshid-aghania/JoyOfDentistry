// Combine all 50 MiNa/JoD Story article texts into one PDF.
//   node scripts/build-combined-pdf.mjs [outPath]
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const articlesDir = join(root, "content/mina-stories/articles");
const manifest = JSON.parse(readFileSync(join(root, "content/mina-stories/manifest.json"), "utf8"));
const bySlug = Object.fromEntries(manifest.articles.map((a) => [a.slug, a]));
const out = resolve(process.argv[2] || "/Users/mahshid/MiNa-JoD-50-Articles-Combined.pdf");
const CHROME = process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const PILLARS = {
  P1: "Patient Basics — Questions Before Booking",
  P2: "Myths & Facts",
  P3: "Dental Technology & Modern Dentistry",
  P4: "Oral Health & Lifestyle",
  P5: "Life-Stage Care",
  P6: "Treatment-Decision Guides",
  P7: "Thornhill & GTA Community",
  P8: "Canadian Costs & Coverage",
};
const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function parse(raw) {
  const m = raw.match(/<!--META([\s\S]*?)-->/);
  const meta = { title: "", reading_minutes: null };
  if (m) for (const line of m[1].split("\n")) {
    const kv = line.match(/^\s*(title|excerpt|reading_minutes)\s*:\s*(.+?)\s*$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  return { meta, body: raw.replace(/<!--META[\s\S]*?-->/, "").trim() };
}

const files = readdirSync(articlesDir).filter((f) => f.endsWith(".html"));
const items = files.map((f) => {
  const slug = basename(f, ".html");
  const spec = bySlug[slug] || {};
  const { meta, body } = parse(readFileSync(join(articlesDir, f), "utf8"));
  return { slug, spec, meta, body, n: spec.n || 999 };
}).sort((a, b) => a.n - b.n);

// Table of contents
let toc = "";
let lastP = null;
for (const it of items) {
  if (it.spec.pillar !== lastP) { toc += `<div class="toc-grp">${esc(PILLARS[it.spec.pillar] || "")}</div>`; lastP = it.spec.pillar; }
  toc += `<div class="toc-row"><span class="toc-n">${it.n}</span><a href="#a${it.n}">${esc(it.meta.title)}</a></div>`;
}

// Articles
let articles = "";
lastP = null;
for (const it of items) {
  if (it.spec.pillar !== lastP) {
    articles += `<section class="pillar"><div class="pillar-eyebrow">Joy of Dentistry &middot; MiNa Family Dentistry</div><h1 class="pillar-h">${esc(PILLARS[it.spec.pillar] || "")}</h1></section>`;
    lastP = it.spec.pillar;
  }
  articles += `<article id="a${it.n}">
    <p class="eyebrow">${esc(it.spec.category || "")}${it.spec.author ? " &middot; " + esc(it.spec.author) : ""}</p>
    <h1>${esc(it.meta.title)}</h1>
    <div class="rule"></div>
    ${it.body}
  </article>`;
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
  @page { size: Letter; margin: 20mm 18mm; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html { font-family: Georgia, "Times New Roman", serif; color:#2b2622; font-size: 11pt; line-height:1.6; }
  .cover { text-align:center; padding: 55mm 0 0; page-break-after: always; }
  .cover .eyebrow { font-family:Arial,sans-serif; letter-spacing:.2em; text-transform:uppercase; color:#7a2230; font-size:10pt; }
  .cover h1 { font-size: 32pt; margin:16px 0 6px; color:#211d1a; }
  .cover p { font-family:Arial,sans-serif; color:#6a6058; font-size:11pt; margin:4px 0; }
  .cover .rule { height:3px; width:64px; background:#c9a86a; margin:20px auto; }
  .toc { page-break-after: always; }
  .toc h2 { font-size:18pt; color:#211d1a; margin:0 0 14px; }
  .toc-grp { font-family:Arial,sans-serif; text-transform:uppercase; letter-spacing:.08em; font-size:8.5pt;
             color:#7a2230; font-weight:bold; margin:14px 0 4px; border-bottom:1px solid #c9a86a; padding-bottom:3px; }
  .toc-row { display:flex; gap:10px; font-family:Arial,sans-serif; font-size:9.5pt; padding:2px 0; }
  .toc-n { color:#8a8178; width:22px; text-align:right; }
  .toc-row a { color:#2b2622; text-decoration:none; }
  section.pillar { page-break-before: always; padding-top: 30mm; text-align:center; }
  .pillar-eyebrow { font-family:Arial,sans-serif; letter-spacing:.16em; text-transform:uppercase; color:#7a2230; font-size:9pt; }
  .pillar-h { font-size:26pt; color:#211d1a; margin-top:10px; }
  article { page-break-before: always; }
  article .eyebrow { font-family:Arial,sans-serif; letter-spacing:.12em; text-transform:uppercase; font-size:8.5pt; color:#7a2230; margin:0 0 8px; }
  article h1 { font-size:22pt; line-height:1.15; margin:0 0 8px; color:#211d1a; }
  article .rule { height:2px; width:50px; background:#c9a86a; margin:14px 0 20px; }
  h2 { font-size:15pt; margin:22px 0 8px; color:#211d1a; }
  h3 { font-family:Arial,sans-serif; font-size:11.5pt; font-weight:700; margin:16px 0 5px; color:#211d1a; }
  p { margin:0 0 11px; }
  ul, ol { margin:0 0 12px; padding-left:20px; } li { margin-bottom:5px; }
  a { color:#7a2230; text-decoration:underline; }
  strong { color:#211d1a; }
  table { width:100%; border-collapse:collapse; margin:14px 0; font-size:10pt; }
  th, td { border:1px solid #ddd3c4; padding:6px 8px; text-align:left; vertical-align:top; }
  th { background:#f4efe6; }
  blockquote { border-left:2px solid #c9a86a; padding-left:12px; margin:14px 0; font-style:italic; }
</style></head><body>
  <div class="cover">
    <div class="eyebrow">Joy of Dentistry</div>
    <h1>MiNa Family Dentistry</h1>
    <p>The Complete Story Series &mdash; 50 Patient-Education Articles</p>
    <div class="rule"></div>
    <p>www.jodmagazine.com/en/stories</p>
    <p style="margin-top:16px;color:#8a8178;">7 October 2026 &middot; 8 content pillars</p>
  </div>
  <div class="toc"><h2>Contents</h2>${toc}</div>
  ${articles}
</body></html>`;

mkdirSync("/tmp/jod-combined", { recursive: true });
const tmp = "/tmp/jod-combined/index.html";
writeFileSync(tmp, html);
if (!existsSync(CHROME)) { console.error("Chrome not found: " + CHROME); process.exit(1); }
execFileSync(CHROME, ["--headless=new","--disable-gpu","--no-sandbox","--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw","--virtual-time-budget=5000",
  `--print-to-pdf=${out}`, `file://${tmp}`], { stdio:["ignore","ignore","pipe"] });
console.log("✓ wrote " + out);
