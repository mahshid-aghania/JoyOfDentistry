import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { isNewsletterConfigured } from "@/lib/env";

const schema = z.object({ email: z.string().trim().email().max(320) });

export async function POST(request: Request) {
  if (!isNewsletterConfigured) {
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

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const result = await resend.contacts.create({
      email: parsed.data.email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribed: false,
    });
    if (result.error) {
      return NextResponse.json({ error: "failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
