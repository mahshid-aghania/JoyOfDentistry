-- ─────────────────────────────────────────────────────────────────────────────
-- Joy of Dentistry — initial schema
--
-- Security model:
--   • Public (anon) visitors may READ published content only.
--   • All writes happen server-side through the service-role key, gated by an
--     application-level admin allowlist (ADMIN_EMAILS). No public write access.
--   • Admin dashboard reads (including drafts) also use the service-role client
--     from trusted server components, so RLS only needs to expose published rows.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- Enums ----------------------------------------------------------------------
do $$ begin
  create type content_language as enum ('en', 'fa', 'bilingual');
exception when duplicate_object then null; end $$;

do $$ begin
  create type publish_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

-- Issues ---------------------------------------------------------------------
create table if not exists public.issues (
  id              uuid primary key default gen_random_uuid(),
  issue_number    integer not null,
  slug            text not null unique,
  title_en        text,
  title_fa        text,
  description_en  text,
  description_fa  text,
  editor_note_en  text,
  editor_note_fa  text,
  contents_en     text[],
  contents_fa     text[],
  publication_date date,
  content_language content_language not null default 'bilingual',
  cover_path      text,
  cover_width     integer,
  cover_height    integer,
  cover_alt_en    text,
  cover_alt_fa    text,
  pdf_en_path     text,
  pdf_fa_path     text,
  status          publish_status not null default 'draft',
  is_featured     boolean not null default false,
  downloads_enabled boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists issues_status_idx on public.issues (status);
create index if not exists issues_pubdate_idx on public.issues (publication_date desc);
create index if not exists issues_number_idx on public.issues (issue_number);

-- Articles (standalone Stories) ----------------------------------------------
create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title_en        text,
  title_fa        text,
  excerpt_en      text,
  excerpt_fa      text,
  body_en         text,
  body_fa         text,
  author          text,
  category        text,
  reading_minutes integer,
  cover_path      text,
  cover_alt_en    text,
  cover_alt_fa    text,
  status          publish_status not null default 'draft',
  published_at    timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists articles_status_idx on public.articles (status);

-- Editable site content (single JSON row) ------------------------------------
create table if not exists public.site_content (
  id          text primary key default 'singleton',
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

insert into public.site_content (id, data)
values ('singleton', '{}'::jsonb)
on conflict (id) do nothing;

-- Contact messages log (optional; populated when the contact form is used) ---
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- updated_at maintenance -----------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists issues_touch on public.issues;
create trigger issues_touch before update on public.issues
  for each row execute function public.touch_updated_at();

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch before update on public.site_content
  for each row execute function public.touch_updated_at();

-- Row Level Security ---------------------------------------------------------
alter table public.issues enable row level security;
alter table public.articles enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_messages enable row level security;

-- Public may read published issues / articles.
drop policy if exists issues_public_read on public.issues;
create policy issues_public_read on public.issues
  for select using (status = 'published');

drop policy if exists articles_public_read on public.articles;
create policy articles_public_read on public.articles
  for select using (status = 'published');

-- Public may read site content.
drop policy if exists site_content_public_read on public.site_content;
create policy site_content_public_read on public.site_content
  for select using (true);

-- No public insert/update/delete anywhere. The service-role key bypasses RLS
-- and is the only path for writes (gated by the app admin allowlist).
-- contact_messages has RLS enabled with no policies → no public access at all;
-- it is written via the service-role client inside the contact action.

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage buckets. Covers and PDFs are publicly readable (no account required
-- to read public issues). Uploads happen via the service-role key only.
-- ─────────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('pdfs', 'pdfs', true)
on conflict (id) do update set public = true;
