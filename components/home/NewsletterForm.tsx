"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, SpinnerIcon } from "@/components/ui/icons";

type State = "idle" | "loading" | "success" | "error" | "invalid";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setState("invalid");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setState(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <p className="text-lg text-charcoal" role="status">
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-md">
      <div className="flex items-stretch border-b border-charcoal-soft focus-within:border-burgundy">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "invalid" || state === "error") setState("idle");
          }}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          aria-invalid={state === "invalid"}
          className="w-full bg-transparent py-3 outline-none placeholder:text-charcoal-mute"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex items-center gap-2 px-2 text-burgundy transition-colors hover:text-burgundy-deep disabled:opacity-60"
          aria-label={t("heading")}
        >
          {state === "loading" ? (
            <SpinnerIcon width={18} height={18} />
          ) : (
            <ArrowRight className="flip-rtl" width={20} height={20} />
          )}
        </button>
      </div>
      {state === "invalid" && (
        <p className="mt-2 text-sm text-burgundy" role="alert">
          {t("invalid")}
        </p>
      )}
      {state === "error" && (
        <p className="mt-2 text-sm text-burgundy" role="alert">
          {t("error")}
        </p>
      )}
    </form>
  );
}
