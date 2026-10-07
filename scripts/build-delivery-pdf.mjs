// Build a single delivery PDF listing all 50 MiNa/JoD Stories with their live
// URL, downloadable PDF link, and MiNa target.
//   node scripts/build-delivery-pdf.mjs [outPath]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const manifest = JSON.parse(readFileSync(join(root, "content/mina-stories/manifest.json"), "utf8"));
const SITE = "https://www.jodmagazine.com/en/stories";
const PDFBASE = "https://zdqsafuzbsfhrvsjaygc.supabase.co/storage/v1/object/public/pdfs/stories";
const MINA = manifest.mina_base;
const out = resolve(process.argv[2] || "/Users/mahshid/MiNa-JoD-50-Stories.pdf");
const CHROME = process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const PILLARS = {
  P1: "Patient basics — questions before booking",
  P2: "Myths & facts",
  P3: "Dental technology & modern dentistry",
  P4: "Oral health & lifestyle",
  P5: "Life-stage care",
  P6: "Treatment-decision guides",
  P7: "Thornhill & GTA community",
  P8: "Canadian costs & coverage",
};
const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let rows = "";
for (const code of Object.keys(PILLARS)) {
  const items = manifest.articles.filter((a) => a.pillar === code);
  rows += `<tr class="grp"><td colspan="2">${esc(PILLARS[code])}</td></tr>`;
  for (const a of items) {
    rows += `<tr>
      <td class="n">${a.n}</td>
      <td>
        <div class="title">${esc(a.title)}</div>
        <div class="links">
          <a href="${SITE}/${a.slug}">${SITE}/${a.slug}</a><br>
          <span class="lbl">PDF:</span> <a href="${PDFBASE}/${a.slug}.pdf">${PDFBASE}/${a.slug}.pdf</a><br>
          <span class="lbl">Links to:</span> ${MINA}${esc(a.mina_url)} &nbsp;<span class="anchor">(anchor: &ldquo;${esc(a.anchor)}&rdquo;)</span>
        </div>
      </td>
    </tr>`;
  }
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
  @page { size: Letter; margin: 16mm 14mm; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html { font-family: Arial, Helvetica, sans-serif; color: #2b2622; font-size: 9.5pt; }
  .cover { text-align:center; padding: 40mm 0 20mm; page-break-after: always; }
  .cover .eyebrow { letter-spacing:.2em; text-transform:uppercase; color:#7a2230; font-size:10pt; }
  .cover h1 { font-family: Georgia, serif; font-size: 30pt; margin: 14px 0 6px; color:#211d1a; }
  .cover p { color:#6a6058; font-size: 11pt; margin: 4px 0; }
  .cover .rule { height:3px; width:60px; background:#c9a86a; margin:18px auto; }
  h2.sec { font-family: Georgia, serif; font-size: 14pt; color:#211d1a; margin: 0 0 8px; }
  table { width:100%; border-collapse: collapse; }
  td { border-bottom: 1px solid #e4dccd; padding: 7px 6px; vertical-align: top; }
  tr.grp td { background:#f4efe6; font-weight:bold; color:#7a2230; border-bottom:2px solid #c9a86a;
              text-transform:uppercase; letter-spacing:.06em; font-size:8.5pt; padding-top:12px; }
  td.n { width: 26px; color:#8a8178; font-weight:bold; }
  .title { font-weight:bold; color:#211d1a; font-size:10pt; margin-bottom:3px; }
  .links a { color:#7a2230; word-break: break-all; text-decoration:none; }
  .lbl { color:#8a8178; }
  .anchor { color:#8a8178; font-style:italic; }
  .foot { margin-top:14px; color:#8a8178; font-size:8pt; }
</style></head><body>
  <div class="cover">
    <div class="eyebrow">Joy of Dentistry &middot; Content Delivery</div>
    <h1>MiNa Family Dentistry</h1>
    <p>Story Series — 50 Patient-Education Articles</p>
    <div class="rule"></div>
    <p>Published on Joy of Dentistry &middot; www.jodmagazine.com/en/stories</p>
    <p>Each article is a live web page with a downloadable PDF and one contextual link to minafamilydentistry.com</p>
    <p style="margin-top:18px;color:#8a8178;">Prepared 7 October 2026 &middot; 50 articles across 8 content pillars</p>
  </div>
  <h2 class="sec">All 50 Stories — live URLs &amp; PDF downloads</h2>
  <table>${rows}</table>
  <p class="foot">Educational content published by Joy of Dentistry (jodmagazine.com). Not a substitute for a professional dental examination.</p>
</body></html>`;

mkdirSync("/tmp/jod-delivery", { recursive: true });
const tmp = "/tmp/jod-delivery/index.html";
writeFileSync(tmp, html);
if (!existsSync(CHROME)) { console.error("Chrome not found: " + CHROME); process.exit(1); }
execFileSync(CHROME, ["--headless=new","--disable-gpu","--no-sandbox","--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw","--virtual-time-budget=3000",
  `--print-to-pdf=${out}`, `file://${tmp}`], { stdio:["ignore","ignore","pipe"] });
console.log("✓ wrote " + out);
