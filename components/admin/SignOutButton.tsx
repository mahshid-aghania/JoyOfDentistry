"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const t = useTranslations("admin");
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="text-sm text-charcoal-soft transition-colors hover:text-burgundy"
    >
      {t("signOut")}
    </button>
  );
}
