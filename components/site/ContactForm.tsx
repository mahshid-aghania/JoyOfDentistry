"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SpinnerIcon } from "@/components/ui/icons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const t = useTranslations("contact");
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  function validate(): boolean {
    const e: Errors = {};
    if (!values.name.trim()) e.name = t("validation.nameRequired");
    if (!values.email.trim()) e.email = t("validation.emailRequired");
    else if (!EMAIL_RE.test(values.email.trim()))
      e.email = t("validation.emailInvalid");
    if (!values.message.trim()) e.message = t("validation.messageRequired");
    else if (values.message.trim().length < 10)
      e.message = t("validation.messageShort");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  function field(name: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name as keyof Errors])
      setErrors((e) => ({ ...e, [name]: undefined }));
  }

  if (state === "sent") {
    return (
      <div role="status" className="border border-line bg-paper p-8">
        <h3 className="font-[family-name:var(--font-serif)] text-2xl text-charcoal">
          {t("success.title")}
        </h3>
        <p className="mt-2 text-charcoal-soft">{t("success.body")}</p>
      </div>
    );
  }

  const inputClass =
    "w-full border border-line-strong bg-paper px-4 py-3 text-charcoal outline-none transition-colors focus:border-burgundy placeholder:text-charcoal-mute";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="c-name" className="eyebrow mb-2 block">
          {t("form.name")}
        </label>
        <input
          id="c-name"
          value={values.name}
          onChange={(e) => field("name", e.target.value)}
          className={inputClass}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "c-name-err" : undefined}
        />
        {errors.name && (
          <p id="c-name-err" className="mt-1.5 text-sm text-burgundy" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="c-email" className="eyebrow mb-2 block">
          {t("form.email")}
        </label>
        <input
          id="c-email"
          type="email"
          value={values.email}
          onChange={(e) => field("email", e.target.value)}
          className={inputClass}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "c-email-err" : undefined}
        />
        {errors.email && (
          <p id="c-email-err" className="mt-1.5 text-sm text-burgundy" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="c-subject" className="eyebrow mb-2 block">
          {t("form.subject")}
        </label>
        <input
          id="c-subject"
          value={values.subject}
          onChange={(e) => field("subject", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="c-message" className="eyebrow mb-2 block">
          {t("form.message")}
        </label>
        <textarea
          id="c-message"
          rows={6}
          value={values.message}
          onChange={(e) => field("message", e.target.value)}
          className={`${inputClass} resize-y`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "c-message-err" : undefined}
        />
        {errors.message && (
          <p id="c-message-err" className="mt-1.5 text-sm text-burgundy" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {state === "error" && (
        <p className="text-sm text-burgundy" role="alert">
          {t("error")}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-primary disabled:opacity-60"
      >
        {state === "sending" ? (
          <>
            <SpinnerIcon width={18} height={18} />
            {t("form.sending")}
          </>
        ) : (
          t("form.send")
        )}
      </button>
    </form>
  );
}
