"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { saveSiteContent } from "@/lib/admin/actions";
import type { SiteContent, SocialLink } from "@/lib/types";

export function ContentEditor({ content }: { content: SiteContent }) {
  const t = useTranslations("admin.content");
  const router = useRouter();
  const [form, setForm] = useState<SiteContent>(content);
  const [social, setSocial] = useState<SocialLink[]>(
    content.social_links?.length ? content.social_links : [{ label: "", url: "" }],
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function save() {
    startTransition(async () => {
      const res = await saveSiteContent({
        ...form,
        social_links: social.filter((s) => s.url.trim()),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      }
    });
  }

  const input =
    "w-full border border-line-strong bg-paper px-3 py-2.5 outline-none transition-colors focus:border-burgundy";

  return (
    <div className="max-w-3xl space-y-8">
      <Pair
        labelEn={t("homeAboutEn")}
        labelFa={t("homeAboutFa")}
        valueEn={form.home_about_en}
        valueFa={form.home_about_fa}
        onEn={(v) => set("home_about_en", v)}
        onFa={(v) => set("home_about_fa", v)}
        rows={3}
      />
      <Pair
        labelEn={t("aboutMissionEn")}
        labelFa={t("aboutMissionFa")}
        valueEn={form.about_mission_en}
        valueFa={form.about_mission_fa}
        onEn={(v) => set("about_mission_en", v)}
        onFa={(v) => set("about_mission_fa", v)}
        rows={5}
      />
      <Pair
        labelEn={t("contactInfoEn")}
        labelFa={t("contactInfoFa")}
        valueEn={form.contact_info_en}
        valueFa={form.contact_info_fa}
        onEn={(v) => set("contact_info_en", v)}
        onFa={(v) => set("contact_info_fa", v)}
        rows={3}
      />

      <div>
        <h2 className="mb-1 font-[family-name:var(--font-serif)] text-xl">
          {t("social")}
        </h2>
        <p className="mb-3 text-xs text-charcoal-mute">{t("socialHint")}</p>
        <div className="space-y-2">
          {social.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Instagram"
                value={s.label}
                onChange={(e) => {
                  const next = [...social];
                  next[i] = { ...next[i], label: e.target.value };
                  setSocial(next);
                  setSaved(false);
                }}
                className={`${input} max-w-[12rem]`}
                dir="ltr"
              />
              <input
                placeholder="https://…"
                value={s.url}
                onChange={(e) => {
                  const next = [...social];
                  next[i] = { ...next[i], url: e.target.value };
                  setSocial(next);
                  setSaved(false);
                }}
                className={input}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setSocial(social.filter((_, j) => j !== i))}
                className="shrink-0 px-2 text-burgundy hover:text-burgundy-deep"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSocial([...social, { label: "", url: "" }])}
          className="mt-2 text-sm text-charcoal-soft hover:text-burgundy"
        >
          + Add link
        </button>
      </div>

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="btn btn-primary disabled:opacity-60"
        >
          {t("save")}
        </button>
        {saved && (
          <span className="text-sm text-burgundy" role="status">
            {t("saved")}
          </span>
        )}
      </div>
    </div>
  );
}

function Pair({
  labelEn,
  labelFa,
  valueEn,
  valueFa,
  onEn,
  onFa,
  rows,
}: {
  labelEn: string;
  labelFa: string;
  valueEn: string;
  valueFa: string;
  onEn: (v: string) => void;
  onFa: (v: string) => void;
  rows: number;
}) {
  const input =
    "w-full border border-line-strong bg-paper px-3 py-2.5 outline-none transition-colors focus:border-burgundy resize-y";
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block">
        <span className="eyebrow mb-2 block">{labelEn}</span>
        <textarea
          rows={rows}
          value={valueEn}
          onChange={(e) => onEn(e.target.value)}
          className={input}
          dir="ltr"
        />
      </label>
      <label className="block">
        <span className="eyebrow mb-2 block">{labelFa}</span>
        <textarea
          rows={rows}
          value={valueFa}
          onChange={(e) => onFa(e.target.value)}
          className={`${input} font-[family-name:var(--font-farsi)]`}
          dir="rtl"
        />
      </label>
    </div>
  );
}
