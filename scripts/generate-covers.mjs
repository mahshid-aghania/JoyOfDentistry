// Render the first page of each magazine PDF to a cover image.
//
//   node scripts/generate-covers.mjs [pdfDir]
//
// Reads PDFs from `pdfDir` (or $JOD_PDF_DIR, default ./seed-assets/pdfs),
// writes PNG covers to ./seed-assets/covers. The covers preserve each page's
// true proportions — nothing is cropped or stretched. Nothing is invented:
// only the issue number is inferred from the filename (JOD01 → 1).

import { pdf } from "pdf-to-img";
import { mkdirSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const pdfDir = resolve(
  process.argv[2] || process.env.JOD_PDF_DIR || join(root, "seed-assets/pdfs"),
);
const outDir = join(root, "seed-assets/covers");

export function issueNumberFromFilename(name) {
  const m = name.match(/jod0*?(\d+)/i);
  return m ? Number(m[1]) : null;
}

function pngSize(buf) {
  if (buf.length < 24) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function main() {
  mkdirSync(outDir, { recursive: true });

  let files;
  try {
    files = readdirSync(pdfDir).filter((f) => f.toLowerCase().endsWith(".pdf"));
  } catch {
    console.error(`✗ Could not read PDF directory: ${pdfDir}`);
    process.exit(1);
  }
  if (files.length === 0) {
    console.error(`✗ No PDFs found in ${pdfDir}`);
    process.exit(1);
  }

  files.sort();
  console.log(`Rendering ${files.length} cover(s) from ${pdfDir}\n`);

  for (const file of files) {
    const number = issueNumberFromFilename(file);
    if (number == null) {
      console.warn(`  · skipped ${file} (no issue number in filename)`);
      continue;
    }
    const srcPath = join(pdfDir, file);
    const sizeMb = (statSync(srcPath).size / 1024 / 1024).toFixed(1);
    try {
      const document = await pdf(srcPath, { scale: 2 });
      let first = null;
      for await (const page of document) {
        first = page;
        break;
      }
      if (!first) {
        console.warn(`  · ${file}: no pages`);
        continue;
      }
      const outName = `issue-${number}.png`;
      writeFileSync(join(outDir, outName), first);
      const dims = pngSize(first);
      console.log(
        `  ✓ ${file} (${sizeMb} MB) → ${outName}` +
          (dims ? ` [${dims.width}×${dims.height}]` : ""),
      );
    } catch (e) {
      console.error(`  ✗ ${file}: ${e.message}`);
    }
  }

  console.log(`\nCovers written to ${outDir}`);
}

main();
