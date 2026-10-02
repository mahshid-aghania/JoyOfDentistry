"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { clsx } from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  ExitFullscreenIcon,
  FullscreenIcon,
  SpinnerIcon,
  ZoomIn,
  ZoomOut,
} from "@/components/ui/icons";

// pdf.js is loaded lazily on the client only.
type PdfDoc = {
  numPages: number;
  getPage: (n: number) => Promise<PdfPage>;
};
type RenderTask = { promise: Promise<void>; cancel: () => void };
type PdfPage = {
  getViewport: (o: { scale: number }) => { width: number; height: number };
  render: (o: {
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }) => RenderTask;
};

async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  return pdfjs;
}

/** A single lazily-rendered page canvas. Renders only when needed. */
function PageCanvas({
  doc,
  pageNumber,
  zoom,
  containerWidth,
  columns,
}: {
  doc: PdfDoc;
  pageNumber: number;
  zoom: number;
  containerWidth: number;
  columns: 1 | 2;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let task: RenderTask | null = null;

    (async () => {
      if (!containerWidth) return;
      const page = await doc.getPage(pageNumber);
      if (cancelled) return;

      const unscaled = page.getViewport({ scale: 1 });
      const gap = columns === 2 ? 16 : 0;
      const targetWidth = (containerWidth - gap) / columns;
      const fitScale = targetWidth / unscaled.width;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = fitScale * zoom;
      const viewport = page.getViewport({ scale: scale * dpr });

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
      canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

      task = page.render({ canvasContext: ctx, viewport });
      try {
        await task.promise;
        if (!cancelled) setReady(true);
      } catch {
        /* render cancelled — ignore */
      }
    })();

    return () => {
      cancelled = true;
      try {
        task?.cancel();
      } catch {
        /* no-op */
      }
    };
  }, [doc, pageNumber, zoom, containerWidth, columns]);

  return (
    <canvas
      ref={canvasRef}
      className={clsx(
        "max-w-full bg-white shadow-[var(--shadow-soft)] transition-opacity duration-300",
        ready ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

export function PdfReader({
  url,
  downloadUrl,
}: {
  url: string;
  downloadUrl?: string | null;
}) {
  const t = useTranslations("reader");
  const locale = useLocale();
  const rtl = locale === "fa";

  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PdfDoc | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [columns, setColumns] = useState<1 | 2>(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [fullscreen, setFullscreen] = useState(false);

  // Load the document.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await loadPdfJs();
        const task = pdfjs.getDocument({ url });
        const loaded = (await task.promise) as unknown as PdfDoc;
        if (cancelled) return;
        setDoc(loaded);
        setNumPages(loaded.numPages);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);

  // Track available width for fit-to-width scaling.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [status]);

  // Fullscreen tracking.
  useEffect(() => {
    function onChange() {
      setFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const goPrev = useCallback(
    () => setPage((p) => Math.max(1, p - columns)),
    [columns],
  );
  const goNext = useCallback(
    () => setPage((p) => Math.min(numPages, p + columns)),
    [columns, numPages],
  );

  // Keyboard navigation (direction-aware).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") rtl ? goPrev() : goNext();
      else if (e.key === "ArrowLeft") rtl ? goNext() : goPrev();
    }
    const el = wrapRef.current;
    el?.addEventListener("keydown", onKey as EventListener);
    return () => el?.removeEventListener("keydown", onKey as EventListener);
  }, [goNext, goPrev, rtl]);

  // Touch swipe.
  const touchX = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
    if (Math.abs(dx) > 50) {
      const forward = rtl ? dx > 0 : dx < 0;
      forward ? goNext() : goPrev();
    }
    touchX.current = null;
  }

  async function toggleFullscreen() {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await el.requestFullscreen().catch(() => {});
  }

  if (status === "error") {
    return (
      <div className="border border-line bg-paper p-10 text-center">
        <p className="text-charcoal-soft">{t("error")}</p>
        <a
          href={downloadUrl || url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline mt-5"
        >
          {t("openInNewTab")}
        </a>
      </div>
    );
  }

  const pagesToShow =
    columns === 2 && page < numPages ? [page, page + 1] : [page];

  return (
    <div
      ref={wrapRef}
      tabIndex={-1}
      className={clsx(
        "flex flex-col overflow-hidden rounded-xs border border-line bg-ivory-deep",
        fullscreen && "h-screen",
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-ivory/95 px-3 py-2.5 backdrop-blur">
        <div className="flex items-center gap-1">
          <IconBtn label={t("previousPage")} onClick={goPrev} disabled={page <= 1}>
            <ChevronLeft className="flip-rtl" width={18} height={18} />
          </IconBtn>
          <div className="flex items-center gap-1.5 px-2 text-sm text-charcoal-soft">
            <PageInput
              value={page}
              max={numPages}
              onCommit={(n) => setPage(n)}
              label={t("goToPage")}
            />
            <span className="text-charcoal-mute">
              {t("of")} {numPages || "—"}
            </span>
          </div>
          <IconBtn label={t("nextPage")} onClick={goNext} disabled={page >= numPages}>
            <ChevronRight className="flip-rtl" width={18} height={18} />
          </IconBtn>
        </div>

        <div className="flex items-center gap-1">
          <IconBtn
            label={t("zoomOut")}
            onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))}
            disabled={zoom <= 0.6}
          >
            <ZoomOut width={18} height={18} />
          </IconBtn>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="min-w-14 rounded-xs px-2 py-1 text-sm text-charcoal-soft hover:text-charcoal"
            aria-label={t("resetZoom")}
          >
            {Math.round(zoom * 100)}%
          </button>
          <IconBtn
            label={t("zoomIn")}
            onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(2)))}
            disabled={zoom >= 3}
          >
            <ZoomIn width={18} height={18} />
          </IconBtn>

          <span className="mx-1 hidden h-5 w-px bg-line sm:block" />

          <div className="hidden items-center rounded-xs border border-line sm:flex">
            <ModeBtn active={columns === 1} onClick={() => setColumns(1)}>
              {t("modePages")}
            </ModeBtn>
            <ModeBtn active={columns === 2} onClick={() => setColumns(2)}>
              {t("modeFlip")}
            </ModeBtn>
          </div>

          <IconBtn
            label={fullscreen ? t("exitFullscreen") : t("fullscreen")}
            onClick={toggleFullscreen}
          >
            {fullscreen ? (
              <ExitFullscreenIcon width={18} height={18} />
            ) : (
              <FullscreenIcon width={18} height={18} />
            )}
          </IconBtn>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="inline-flex h-9 w-9 items-center justify-center rounded-xs text-charcoal-soft transition-colors hover:bg-ivory-deep hover:text-burgundy"
              aria-label={t("download")}
            >
              <DownloadIcon width={18} height={18} />
            </a>
          )}
        </div>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={clsx(
          "relative flex items-start justify-center overflow-auto p-4 sm:p-8",
          fullscreen ? "flex-1" : "max-h-[82vh] min-h-[60vh]",
        )}
      >
        {status === "loading" || !doc || !containerWidth ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-charcoal-mute">
            <SpinnerIcon width={28} height={28} />
            <p className="text-sm">{t("loading")}</p>
          </div>
        ) : (
          <div className="flex items-start justify-center gap-4" dir="ltr">
            {pagesToShow.map((n) => (
              <PageCanvas
                key={`${n}-${columns}`}
                doc={doc}
                pageNumber={n}
                zoom={zoom}
                containerWidth={containerWidth - (columns === 2 ? 48 : 32)}
                columns={columns}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xs text-charcoal-soft transition-colors hover:bg-ivory-deep hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function ModeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "px-3 py-1.5 text-xs transition-colors",
        active ? "bg-burgundy text-paper" : "text-charcoal-soft hover:text-charcoal",
      )}
    >
      {children}
    </button>
  );
}

function PageInput({
  value,
  max,
  onCommit,
  label,
}: {
  value: number;
  max: number;
  onCommit: (n: number) => void;
  label: string;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  function commit() {
    const n = Math.min(Math.max(1, Number(draft) || 1), max || 1);
    onCommit(n);
    setDraft(String(n));
  }

  return (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ""))}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      aria-label={label}
      inputMode="numeric"
      className="w-10 rounded-xs border border-line bg-paper px-1.5 py-1 text-center text-sm outline-none focus:border-burgundy"
    />
  );
}
