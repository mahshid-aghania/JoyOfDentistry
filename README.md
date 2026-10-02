# Joy of Dentistry (JoD)

A bilingual (English · فارسی) dental **lifestyle magazine** — an editorial
publication about the people behind dentistry. Built with Next.js (App Router),
next-intl, Supabase (auth · database · storage), and a custom pdf.js reader.

> Beyond the smile, there is a story.

---

## What's inside

- **Editorial design** — warm ivory, charcoal, muted burgundy, champagne; serif
  display headings (Cormorant Garamond), clean sans body (Inter), and Vazirmatn
  for Farsi. Covers are the hero; their true proportions are always preserved.
- **Full bilingual system** — `/en` (LTR) and `/fa` (RTL). Every string, menu,
  form, validation message, and empty state is translated. Dates format per
  locale (Gregorian / Jalali). hreflang + canonical URLs + localized sitemap.
- **Magazine archive** — filter by year & language, bilingual search, sort,
  "load more", responsive 1–4 column grid, polished loading/empty/error states.
- **Issue pages + reader** — permanent shareable pages and a reliable pdf.js
  reader (prev/next, page jump, zoom, fullscreen, single/two-page spread, touch
  swipe, keyboard, lazy streaming). Direct "open PDF" fallback always available.
- **Admin dashboard** — secure (Supabase Auth + email allowlist). Upload cover
  + PDF with progress, auto-extract a cover from the PDF's first page, all
  bilingual fields, draft/publish, reorder, feature, delete-with-confirmation.
  Publishing is blocked until the required cover, PDF, title, date & number
  exist; incomplete drafts always save.
- **Stories**, **About**, **Contact** (real delivery via Resend, shown only when
  configured), optional **Newsletter** (shown only when configured).
- **SEO** — per-page titles/descriptions, canonical + hreflang, generated OG
  image, `sitemap.xml`, `robots.txt`, and JSON-LD for the publication/issues.

---

## Prerequisites

- Node.js **20.9+**
- A **Supabase** project (free tier is fine)
- Optional: a **Resend** account (contact form + newsletter)

---

## 1. Install

```bash
npm install
cp .env.example .env.local
```

The site runs immediately in a safe **"not configured"** state (beautiful empty
states, admin shows a setup notice) until you add Supabase credentials.

## 2. Configure the backend (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the migration `supabase/migrations/0001_init.sql`.
   This creates the tables, row-level security, and the public `covers` / `pdfs`
   storage buckets.
3. In **Settings → API**, copy these into `.env.local`:

   ```ini
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...          # server only — never exposed
   ADMIN_EMAILS=you@example.com           # who may enter /admin
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

## 3. Create your editor login

Either create a user in **Supabase → Authentication → Users**, or let the seed
do it by also setting:

```ini
SEED_ADMIN_PASSWORD=choose-a-strong-password
```

The email(s) must match `ADMIN_EMAILS`. Admin privileges are enforced
server-side on every mutation.

## 4. Seed the 11 issues (optional)

The 11 provided PDFs (JOD01–JOD10, JOD12) can be loaded as **published** issues.
Covers are auto-extracted from each PDF's first page; titles, descriptions, and
publication dates are left **empty and editable** (nothing is invented).

```bash
# Point at your PDF folder (or copy them to ./seed-assets/pdfs first):
node --env-file=.env.local scripts/seed.mjs "/path/to/your/pdfs"
# or, if PDFs are in ./seed-assets/pdfs:
npm run seed
```

To preview covers locally without a backend:

```bash
npm run covers -- "/path/to/your/pdfs"   # writes ./seed-assets/covers/*.png
```

## 5. Run

```bash
npm run dev      # http://localhost:3000  → redirects to /en
npm run build    # production build
npm start        # serve the production build
```

---

## Admin workflow

`/en/admin` → sign in → **New issue**:

1. Upload the **PDF** (progress shown; type & size validated).
2. **Auto-extract cover** from the PDF, or upload your own cover image.
3. Enter the issue details (bilingual titles, descriptions, editor's note,
   contents list, content language, date, alt text).
4. **Save draft** any time; **Preview** the live page; **Save & publish** when
   the required fields are present.
5. Manage existing issues: edit, reorder, feature, unpublish, delete.

**Site content** tab edits the homepage intro, About mission, contact details,
and social links — all bilingual.

---

## Optional integrations

### Contact form (Resend)
Shown only when all three are set; otherwise the page shows contact details only.

```ini
RESEND_API_KEY=...
CONTACT_TO_EMAIL=hello@yourdomain.com
CONTACT_FROM_EMAIL=magazine@yourdomain.com   # a verified Resend sender
```

### Newsletter (Resend Audience)
Shown only when configured; never a form that silently discards submissions.

```ini
NEWSLETTER_PROVIDER=resend
RESEND_AUDIENCE_ID=...
```

### Upload limits

```ini
NEXT_PUBLIC_MAX_COVER_MB=10
NEXT_PUBLIC_MAX_PDF_MB=60
```

---

## Deploy (Vercel)

1. Push this repo to GitHub and import it in Vercel.
2. Add every variable from `.env.local` to the Vercel project (set
   `NEXT_PUBLIC_SITE_URL` to your production URL).
3. Deploy. Run the seed once from your machine against the production Supabase
   project (same env), or upload issues through the dashboard.

Files live in Supabase Storage, so published issues keep working across
deployments.

---

## Project structure

```
app/[locale]/(site)     Public pages (home, magazines, issue, stories, about, contact)
app/[locale]/(admin)    Editorial dashboard (login, issues, editor, site content)
app/api                 upload, extract-cover, contact, newsletter
components/              site · magazine · reader · home · admin · ui
i18n/                    routing, request config, navigation, middleware
lib/                     env, supabase clients, queries, admin actions, seo, format
messages/               en.json · fa.json  (complete UI translations)
supabase/migrations/    0001_init.sql  (schema · RLS · storage buckets)
scripts/                generate-covers.mjs · seed.mjs
```

## Security notes

- The service-role key is used only on the server (seed + trusted admin
  actions) and is never sent to the browser.
- RLS exposes **published** content to anonymous visitors only; all writes go
  through the service role, gated by the `ADMIN_EMAILS` allowlist.
- Reading public issues never requires an account.
- `/admin` and `/api` are disallowed in `robots.txt`.
