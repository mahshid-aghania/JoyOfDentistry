"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { useRouter as useIntlRouter } from "@/i18n/navigation";
import { FileField } from "./FileField";
import { saveIssue } from "@/lib/admin/actions";
import { coverUrl } from "@/lib/storage";
import type { ContentLanguage, Issue } from "@/lib/types";

interface FormState {
  issue_number: string;
  title_en: string;
  title_fa: string;
  description_en: string;
  description_fa: string;
  editor_note_en: string;
  editor_note_fa: string;
  contents_en: string;
  contents_fa: string;
  publication_date: string;
  content_language: ContentLanguage;
  cover_path: string | null;
  cover_width: number | null;
  cover_height: number | null;
  cover_alt_en: string;
  cover_alt_fa: string;
  pdf_en_path: string | null;
  pdf_fa_path: string | null;
  is_featured: boolean;
  downloads_enabled: boolean;
}

function fromIssue(issue: Issue | null): FormState {
  return {
    issue_number: issue ? String(issue.issue_number) : "",
    title_en: issue?.title_en ?? "",
    title_fa: issue?.title_fa ?? "",
    description_en: issue?.description_en ?? "",
    description_fa: issue?.description_fa ?? "",
    editor_note_en: issue?.editor_note_en ?? "",
    editor_note_fa: issue?.editor_note_fa ?? "",
    contents_en: (issue?.contents_en ?? []).join("\n"),
    contents_fa: (issue?.contents_fa ?? []).join("\n"),
    publication_date: issue?.publication_date ?? "",
    content_language: issue?.content_language ?? "bilingual",
    cover_path: issue?.cover_path ?? null,
    cover_width: issue?.cover_width ?? null,
    cover_height: issue?.cover_height ?? null,
    cover_alt_en: issue?.cover_alt_en ?? "",
    cover_alt_fa: issue?.cover_alt_fa ?? "",
    pdf_en_path: issue?.pdf_en_path ?? null,
    pdf_fa_path: issue?.pdf_fa_path ?? null,
    is_featured: issue?.is_featured ?? false,
    downloads_enabled: issue?.downloads_enabled ?? true,
  };
}

export function IssueEditor({ issue }: { issue: Issue | null }) {
  const t = useTranslations("admin.form");
  const tv = useTranslations("admin.validation");
  const tnav = useTranslations("admin.nav");
  const router = useRouter();
  const intlRouter = useIntlRouter();
  const [form, setForm] = useState<FormState>(() => fromIssue(issue));
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [extracting, setExtracting] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function buildPayload(status: "draft" | "published") {
    return {
      id: issue?.id ?? null,
      issue_number: Number(form.issue_number || 0),
      title_en: form.title_en,
      title_fa: form.title_fa,
      description_en: form.description_en,
      description_fa: form.description_fa,
      editor_note_en: form.editor_note_en,
      editor_note_fa: form.editor_note_fa,
      contents_en: form.contents_en.split("\n").map((s) => s.trim()).filter(Boolean),
      contents_fa: form.contents_fa.split("\n").map((s) => s.trim()).filter(Boolean),
      publication_date: form.publication_date || null,
      content_language: form.content_language,
      cover_path: form.cover_path,
      cover_width: form.cover_width,
      cover_height: form.cover_height,
      cover_alt_en: form.cover_alt_en,
      cover_alt_fa: form.cover_alt_fa,
      pdf_en_path: form.pdf_en_path,
      pdf_fa_path: form.pdf_fa_path,
      status,
      is_featured: form.is_featured,
      downloads_enabled: form.downloads_enabled,
    };
  }

  function save(status: "draft" | "published") {
    if (!form.issue_number) {
      setMessage({ kind: "err", text: tv("issueNumberRequired") });
      return;
    }
    startTransition(async () => {
      const res = await saveIssue(buildPayload(status));
      if (res.ok) {
        setMessage({
          kind: "ok",
          text: status === "published" ? tv("published") : tv("saved"),
        });
        if (!issue?.id && res.id) {
          router.replace(
            window.location.pathname.replace(/\/new$/, `/${res.id}`),
          );
        }
        router.refresh();
      } else if (res.missing) {
        setMessage({
          kind: "err",
          text: res.missing.map((m) => tv(m as never)).join(" "),
        });
      } else {
        setMessage({ kind: "err", text: tv("fileType", { name: "" }) });
      }
    });
  }

  async function extractCover() {
    if (!form.pdf_en_path) return;
    setExtracting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/extract-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfPath: form.pdf_en_path }),
      });
      const data = await res.json();
      if (res.ok && data.path) {
        setForm((f) => ({
          ...f,
          cover_path: data.path,
          cover_width: data.width,
          cover_height: data.height,
        }));
      } else {
        setMessage({ kind: "err", text: "Cover extraction failed." });
      }
    } catch {
      setMessage({ kind: "err", text: "Cover extraction failed." });
    } finally {
      setExtracting(false);
    }
  }

  const input =
    "w-full border border-line-strong bg-paper px-3 py-2.5 outline-none transition-colors focus:border-burgundy";
  const coverPreview = coverUrl(form.cover_path);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-10">
        {/* Identity */}
        <Section title={t("sectionIdentity")}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("issueNumber")}>
              <input
                type="number"
                min={0}
                value={form.issue_number}
                onChange={(e) => set("issue_number", e.target.value)}
                className={input}
              />
            </Field>
            <Field label={t("publicationDate")}>
              <input
                type="date"
                value={form.publication_date}
                onChange={(e) => set("publication_date", e.target.value)}
                className={input}
              />
            </Field>
            <Field label={t("titleEn")}>
              <input
                value={form.title_en}
                onChange={(e) => set("title_en", e.target.value)}
                className={input}
                dir="ltr"
              />
            </Field>
            <Field label={t("titleFa")}>
              <input
                value={form.title_fa}
                onChange={(e) => set("title_fa", e.target.value)}
                className={`${input} font-[family-name:var(--font-farsi)]`}
                dir="rtl"
              />
            </Field>
          </div>
          <Field label={t("contentLanguage")} hint={t("contentLanguageHint")}>
            <select
              value={form.content_language}
              onChange={(e) =>
                set("content_language", e.target.value as ContentLanguage)
              }
              className={input}
            >
              <option value="en">English</option>
              <option value="fa">فارسی / Farsi</option>
              <option value="bilingual">Bilingual</option>
            </select>
          </Field>
        </Section>

        {/* Content */}
        <Section title={t("sectionContent")}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("descriptionEn")}>
              <textarea
                rows={4}
                value={form.description_en}
                onChange={(e) => set("description_en", e.target.value)}
                className={`${input} resize-y`}
                dir="ltr"
              />
            </Field>
            <Field label={t("descriptionFa")}>
              <textarea
                rows={4}
                value={form.description_fa}
                onChange={(e) => set("description_fa", e.target.value)}
                className={`${input} resize-y font-[family-name:var(--font-farsi)]`}
                dir="rtl"
              />
            </Field>
            <Field label={t("editorNoteEn")}>
              <textarea
                rows={4}
                value={form.editor_note_en}
                onChange={(e) => set("editor_note_en", e.target.value)}
                className={`${input} resize-y`}
                dir="ltr"
              />
            </Field>
            <Field label={t("editorNoteFa")}>
              <textarea
                rows={4}
                value={form.editor_note_fa}
                onChange={(e) => set("editor_note_fa", e.target.value)}
                className={`${input} resize-y font-[family-name:var(--font-farsi)]`}
                dir="rtl"
              />
            </Field>
            <Field label={t("contentsEn")} hint={t("contentsHint")}>
              <textarea
                rows={5}
                value={form.contents_en}
                onChange={(e) => set("contents_en", e.target.value)}
                className={`${input} resize-y`}
                dir="ltr"
              />
            </Field>
            <Field label={t("contentsFa")} hint={t("contentsHint")}>
              <textarea
                rows={5}
                value={form.contents_fa}
                onChange={(e) => set("contents_fa", e.target.value)}
                className={`${input} resize-y font-[family-name:var(--font-farsi)]`}
                dir="rtl"
              />
            </Field>
          </div>
        </Section>

        {/* Files */}
        <Section title={t("sectionFiles")}>
          <div className="space-y-6">
            <FileField
              kind="pdf"
              label={t("pdfEn")}
              required
              currentPath={form.pdf_en_path}
              onUploaded={(path) => set("pdf_en_path", path)}
              onRemove={() => set("pdf_en_path", null)}
            />
            <FileField
              kind="pdf"
              label={t("pdfFa")}
              hint={t("pdfHint")}
              currentPath={form.pdf_fa_path}
              onUploaded={(path) => set("pdf_fa_path", path)}
              onRemove={() => set("pdf_fa_path", null)}
            />

            <div className="border-t border-line pt-6">
              <FileField
                kind="cover"
                label={t("cover")}
                required
                hint={t("coverHint")}
                currentPath={form.cover_path}
                onUploaded={(path, w, h) =>
                  setForm((f) => ({
                    ...f,
                    cover_path: path,
                    cover_width: w ?? null,
                    cover_height: h ?? null,
                  }))
                }
                onRemove={() =>
                  setForm((f) => ({
                    ...f,
                    cover_path: null,
                    cover_width: null,
                    cover_height: null,
                  }))
                }
              />
              <button
                type="button"
                onClick={extractCover}
                disabled={!form.pdf_en_path || extracting}
                className="btn btn-outline mt-3 text-xs disabled:opacity-50"
              >
                {extracting ? "…" : t("extractCover")}
              </button>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label={t("coverAltEn")}>
                  <input
                    value={form.cover_alt_en}
                    onChange={(e) => set("cover_alt_en", e.target.value)}
                    className={input}
                    dir="ltr"
                  />
                </Field>
                <Field label={t("coverAltFa")}>
                  <input
                    value={form.cover_alt_fa}
                    onChange={(e) => set("cover_alt_fa", e.target.value)}
                    className={`${input} font-[family-name:var(--font-farsi)]`}
                    dir="rtl"
                  />
                </Field>
              </div>
            </div>
          </div>
        </Section>

        {/* Publishing */}
        <Section title={t("sectionPublishing")}>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => set("is_featured", e.target.checked)}
                className="h-4 w-4 accent-[var(--color-burgundy)]"
              />
              {t("featured")}
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.downloads_enabled}
                onChange={(e) => set("downloads_enabled", e.target.checked)}
                className="h-4 w-4 accent-[var(--color-burgundy)]"
              />
              {t("downloadsEnabled")}
            </label>
          </div>
        </Section>
      </div>

      {/* Sticky side panel: preview + actions */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="border border-line bg-paper p-5">
          <div className="mx-auto max-w-[12rem]">
            {coverPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverPreview}
                alt=""
                className="w-full shadow-[var(--shadow-soft)]"
              />
            ) : (
              <div className="flex aspect-[3/4] items-center justify-center bg-ivory-deep">
                <span className="font-[family-name:var(--font-serif)] text-3xl text-champagne-deep">
                  JoD
                </span>
              </div>
            )}
          </div>

          {message && (
            <p
              className={clsx(
                "mt-4 p-2.5 text-sm",
                message.kind === "ok"
                  ? "bg-burgundy/10 text-burgundy"
                  : "border border-burgundy-soft text-burgundy",
              )}
              role="status"
            >
              {message.text}
            </p>
          )}

          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={() => save("draft")}
              disabled={isPending}
              className="btn btn-outline w-full disabled:opacity-60"
            >
              {isPending ? t("saving") : t("save")}
            </button>
            <button
              type="button"
              onClick={() => save("published")}
              disabled={isPending}
              className="btn btn-primary w-full disabled:opacity-60"
            >
              {t("saveAndPublish")}
            </button>
            <button
              type="button"
              onClick={() => intlRouter.push("/admin")}
              className="w-full py-2 text-sm text-charcoal-soft hover:text-charcoal"
            >
              ← {tnav("issues")}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-5 border-b border-line pb-2 font-[family-name:var(--font-serif)] text-xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-charcoal-mute">{hint}</span>}
    </label>
  );
}
