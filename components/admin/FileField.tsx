"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { maxCoverMb, maxPdfMb } from "@/lib/env";

type Kind = "cover" | "pdf";

async function imageDimensions(file: File) {
  return new Promise<{ width: number; height: number } | null>((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export function FileField({
  kind,
  label,
  hint,
  currentPath,
  currentName,
  required = false,
  onUploaded,
  onRemove,
}: {
  kind: Kind;
  label: string;
  hint?: string;
  currentPath: string | null;
  currentName?: string | null;
  required?: boolean;
  onUploaded: (path: string, width?: number | null, height?: number | null) => void;
  onRemove: () => void;
}) {
  const t = useTranslations("admin.form");
  const tv = useTranslations("admin.validation");
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const accept =
    kind === "cover" ? "image/png,image/jpeg,image/webp" : "application/pdf";
  const limitMb = kind === "cover" ? maxCoverMb : maxPdfMb;

  async function handleFile(file: File) {
    setError(null);

    if (file.size > limitMb * 1024 * 1024) {
      setError(tv("fileTooLarge", { name: file.name, max: limitMb }));
      return;
    }

    let dims: { width: number; height: number } | null = null;
    if (kind === "cover") dims = await imageDimensions(file);

    const form = new FormData();
    form.append("file", file);
    form.append("kind", kind);
    if (dims) {
      form.append("width", String(dims.width));
      form.append("height", String(dims.height));
    }

    setProgress(0);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      setProgress(null);
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.path) {
          onUploaded(res.path, res.width, res.height);
        } else if (res.error === "too_large") {
          setError(tv("fileTooLarge", { name: res.name, max: res.max }));
        } else if (res.error === "bad_type") {
          setError(tv("fileType", { name: res.name }));
        } else {
          setError(tv("fileType", { name: file.name }));
        }
      } catch {
        setError(tv("fileType", { name: file.name }));
      }
    };
    xhr.onerror = () => {
      setProgress(null);
      setError(tv("fileType", { name: file.name }));
    };
    xhr.send(form);
  }

  const displayName = currentName || currentPath;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="eyebrow">{label}</span>
        {required && (
          <span className="text-[0.65rem] text-burgundy">
            · {t("requiredForPublish")}
          </span>
        )}
      </div>

      {currentPath ? (
        <div className="flex items-center justify-between gap-3 border border-line bg-paper px-4 py-3">
          <span className="truncate text-sm text-charcoal-soft">
            {displayName}
          </span>
          <div className="flex shrink-0 items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-charcoal-soft hover:text-burgundy"
            >
              {t("replaceFile")}
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="text-burgundy hover:text-burgundy-deep"
            >
              {t("removeFile")}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center border border-dashed border-line-strong bg-paper/50 px-4 py-6 text-sm text-charcoal-soft transition-colors hover:border-burgundy hover:text-burgundy"
        >
          {progress === null
            ? `+ ${label}`
            : t("uploading", { name: "", percent: progress })}
        </button>
      )}

      {progress !== null && (
        <div className="mt-2 h-1 w-full overflow-hidden bg-line">
          <div
            className="h-full bg-burgundy transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {hint && <p className="mt-1.5 text-xs text-charcoal-mute">{hint}</p>}
      {error && (
        <p className="mt-1.5 text-xs text-burgundy" role="alert">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
