import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { isContactConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  subject: z.string().trim().max(300).optional().default(""),
  message: z.string().trim().min(10).max(5000),
});

export async function POST(request: Request) {
  if (!isContactConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }
  const { name, email, subject, message } = parsed.data;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const result = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL!,
      to: process.env.CONTACT_TO_EMAIL!,
      replyTo: email,
      subject: subject
        ? `JoD contact — ${subject}`
        : `JoD contact from ${name}`,
      text: `From: ${name} <${email}>\nSubject: ${subject || "(none)"}\n\n${message}`,
    });

    if (result.error) {
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }

    // Best-effort log; never block the user response on it.
    const admin = createAdminClient();
    if (admin) {
      await admin
        .from("contact_messages")
        .insert({ name, email, subject: subject || null, message });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
