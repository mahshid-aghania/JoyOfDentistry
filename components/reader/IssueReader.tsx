"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { BookOpenIcon, SpinnerIcon } from "@/components/ui/icons";

// pdf.js must never render on the server.
const PdfReader = dynamic(
  () => import("./PdfReader").then((m) => m.PdfReader),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[40vh] items-center justify-center border border-line bg-paper">
        <SpinnerIcon width={28} height={28} />
      </div>
    ),
  },
);

export function IssueReader({
  pdfUrl,
  downloadUrl,
  autoOpen = false,
}: {
  pdfUrl: string | null;
  downloadUrl: string | null;
  autoOpen?: boolean;
}) {
  const t = useTranslations("reader");
  const [open, setOpen] = useState(autoOpen);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoOpen && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [autoOpen]);

  if (!pdfUrl) {
    return (
      <p className="border border-dashed border-line-strong bg-paper/50 p-6 text-center text-charcoal-soft">
        {t("noPdf")}
      </p>
    );
  }

  return (
    <div ref={ref} className="scroll-mt-24">
      {open ? (
        <PdfReader url={pdfUrl} downloadUrl={downloadUrl} />
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn btn-primary"
          >
            <BookOpenIcon width={18} height={18} />
            {t("title")}
          </button>
          <a
            href={downloadUrl || pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            {t("openInNewTab")}
          </a>
        </div>
      )}
    </div>
  );
}
