"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Wordmark } from "@/components/site/Wordmark";
import { SpinnerIcon } from "@/components/ui/icons";

export function AdminLogin({
  signedInNotAdmin = false,
}: {
  signedInNotAdmin?: boolean;
}) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;
    setState("loading");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setState("error");
      return;
    }
    // Re-run the server layout so it re-reads the session and admin status.
    router.refresh();
  }

  const inputClass =
    "w-full border border-line-strong bg-paper px-4 py-3 outline-none transition-colors focus:border-burgundy";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Wordmark />
          <h1 className="mt-6 font-[family-name:var(--font-serif)] text-3xl">
            {t("signInTitle")}
          </h1>
          <p className="mt-2 text-sm text-charcoal-soft">{t("signInSubtitle")}</p>
        </div>

        {signedInNotAdmin && (
          <p className="mb-4 border border-line-strong bg-paper p-3 text-sm text-burgundy">
            {t("notAuthorized")}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="a-email" className="eyebrow mb-2 block">
              {t("email")}
            </label>
            <input
              id="a-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="a-password" className="eyebrow mb-2 block">
              {t("password")}
            </label>
            <input
              id="a-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
              autoComplete="current-password"
            />
          </div>

          {state === "error" && (
            <p className="text-sm text-burgundy" role="alert">
              {t("signInError")}
            </p>
          )}

          <button
            type="submit"
            disabled={state === "loading"}
            className="btn btn-primary w-full disabled:opacity-60"
          >
            {state === "loading" ? (
              <>
                <SpinnerIcon width={18} height={18} />
                {t("signingIn")}
              </>
            ) : (
              t("signIn")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
