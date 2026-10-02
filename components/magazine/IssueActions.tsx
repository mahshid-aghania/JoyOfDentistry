import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pdfUrl } from "@/lib/storage";
import { BookOpenIcon, DownloadIcon } from "@/components/ui/icons";
import type { Issue } from "@/lib/types";

/**
 * Primary read + download actions for an issue. "Read" links to the issue page
 * (or directly to its reader). "Download" appears only when downloads are
 * enabled and a PDF exists — never a broken button.
 */
export async function IssueActions({
  issue,
  readHref,
  readLabelKey = "readIssue",
}: {
  issue: Issue;
  readHref: "issue" | "reader";
  readLabelKey?: "readIssue" | "readOnline";
}) {
  const t = await getTranslations("actions");
  const pdf = pdfUrl(issue.pdf_en_path);
  const showDownload = issue.downloads_enabled && Boolean(pdf);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={
          readHref === "reader"
            ? `/magazines/${issue.slug}?read=1`
            : `/magazines/${issue.slug}`
        }
        className="btn btn-primary"
      >
        <BookOpenIcon width={18} height={18} />
        {t(readLabelKey)}
      </Link>

      {showDownload && (
        <a href={pdf!} download className="btn btn-outline">
          <DownloadIcon width={18} height={18} />
          {t("downloadPdf")}
        </a>
      )}
    </div>
  );
}
