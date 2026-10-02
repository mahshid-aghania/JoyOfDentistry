# seed-assets

Working files for seeding the archive. Both subfolders are **git-ignored**.

- `pdfs/` — your source magazine PDFs (JOD01–JOD12). Large; not committed.
- `covers/` — PNG covers auto-rendered from each PDF's first page via
  `npm run covers`. These are **derived from the PDFs** (true page proportions,
  nothing cropped). They're regenerated on demand and also recreated by the
  seed script when it uploads to Supabase Storage.

Nothing here invents titles, dates, or descriptions — only the issue number is
taken from the filename (`JOD01` → issue 1). Fill in the rest in the dashboard.
