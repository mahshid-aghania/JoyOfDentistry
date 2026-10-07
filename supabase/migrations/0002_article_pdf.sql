-- Add a downloadable-PDF pointer to standalone Stories (articles).
-- pdf_path is a storage object key in the public "pdfs" bucket
-- (e.g. "stories/<slug>.pdf"); null when no PDF is attached.

alter table public.articles
  add column if not exists pdf_path text;
