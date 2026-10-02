"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  deleteIssue,
  moveIssue,
  setFeatured,
  setIssueStatus,
} from "@/lib/admin/actions";
import { formatPublicationDate } from "@/lib/format";
import { localizedTitle, type Issue } from "@/lib/types";
import type { Locale } from "@/i18n/routing";

export function IssuesTable({
  issues,
  locale,
}: {
  issues: Issue[];
  locale: Locale;
}) {
  const t = useTranslations("admin.issues");
  const tv = useTranslations("admin.validation");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<Issue | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: boolean; missing?: string[] }>) {
    startTransition(async () => {
      const res = await fn();
      if (!res.ok && res.missing) {
        setNotice(res.missing.map((m) => tv(m as never)).join(" "));
      } else {
        setNotice(null);
      }
      router.refresh();
    });
  }

  if (issues.length === 0) {
    return (
      <EmptyState
        title={t("empty")}
        action={
          <Link href="/admin/issues/new" className="btn btn-primary">
            {t("new")}
          </Link>
        }
      />
    );
  }

  return (
    <div className={clsx(isPending && "pointer-events-none opacity-70")}>
      {notice && (
        <p className="mb-4 border border-burgundy-soft bg-paper p-3 text-sm text-burgundy" role="alert">
          {notice}
        </p>
      )}

      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-start text-xs uppercase tracking-wider text-charcoal-mute">
              <th className="p-3 text-start font-medium">{t("number")}</th>
              <th className="p-3 text-start font-medium">{t("title")}</th>
              <th className="p-3 text-start font-medium">{t("date")}</th>
              <th className="p-3 text-start font-medium">{t("status")}</th>
              <th className="p-3 text-end font-medium">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="border-b border-line last:border-0">
                <td className="p-3 align-top font-[family-name:var(--font-serif)] text-lg text-champagne-deep">
                  {issue.issue_number}
                </td>
                <td className="p-3 align-top">
                  <div className="font-medium text-charcoal">
                    {localizedTitle(issue, locale) || (
                      <span className="text-charcoal-mute">—</span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {issue.is_featured && (
                      <span className="bg-burgundy px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-paper">
                        {t("featured")}
                      </span>
                    )}
                    {!issue.cover_path && (
                      <span className="border border-line-strong px-1.5 py-0.5 text-[0.65rem] text-charcoal-mute">
                        no cover
                      </span>
                    )}
                    {!issue.pdf_en_path && !issue.pdf_fa_path && (
                      <span className="border border-line-strong px-1.5 py-0.5 text-[0.65rem] text-charcoal-mute">
                        no pdf
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 align-top text-charcoal-soft">
                  {formatPublicationDate(issue.publication_date, locale) || "—"}
                </td>
                <td className="p-3 align-top">
                  <span
                    className={clsx(
                      "inline-block px-2 py-0.5 text-xs",
                      issue.status === "published"
                        ? "bg-burgundy/10 text-burgundy"
                        : "bg-ivory-deep text-charcoal-mute",
                    )}
                  >
                    {issue.status === "published" ? t("published") : t("draft")}
                  </span>
                </td>
                <td className="p-3 align-top">
                  <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs">
                    <Link
                      href={`/admin/issues/${issue.id}`}
                      className="text-charcoal-soft hover:text-burgundy"
                    >
                      {t("edit")}
                    </Link>
                    {issue.status === "published" && (
                      <a
                        href={`/${locale}/magazines/${issue.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-charcoal-soft hover:text-burgundy"
                      >
                        {t("preview")}
                      </a>
                    )}
                    {issue.status === "published" ? (
                      <button
                        type="button"
                        onClick={() => run(() => setIssueStatus(issue.id, "draft"))}
                        className="text-charcoal-soft hover:text-burgundy"
                      >
                        {t("unpublish")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          run(() => setIssueStatus(issue.id, "published"))
                        }
                        className="text-charcoal-soft hover:text-burgundy"
                      >
                        {t("publish")}
                      </button>
                    )}
                    {!issue.is_featured && issue.status === "published" && (
                      <button
                        type="button"
                        onClick={() => run(() => setFeatured(issue.id))}
                        className="text-charcoal-soft hover:text-burgundy"
                      >
                        {t("makeFeatured")}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => run(() => moveIssue(issue.id, "up"))}
                      className="text-charcoal-soft hover:text-burgundy"
                      aria-label={t("moveUp")}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => run(() => moveIssue(issue.id, "down"))}
                      className="text-charcoal-soft hover:text-burgundy"
                      aria-label={t("moveDown")}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(issue)}
                      className="text-burgundy hover:text-burgundy-deep"
                    >
                      {t("delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title={t("deleteConfirmTitle")}
          body={t("deleteConfirmBody")}
          confirmLabel={t("confirmDelete")}
          busy={isPending}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => {
            const id = confirmDelete.id;
            setConfirmDelete(null);
            run(() => deleteIssue(id));
          }}
        />
      )}
    </div>
  );
}
