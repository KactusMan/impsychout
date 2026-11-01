import { NextResponse } from "next/server";

// Receives consultation requests from the booking form and emails them to Laraib via Resend.
// Needs two environment variables in Vercel: RESEND_API_KEY and CONSULTATION_TO_EMAIL
// (and optionally CONSULTATION_FROM_EMAIL on a verified domain). Without them it answers 503
// so the form can point people to Instagram instead of silently dropping their message.

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Bots fill the hidden field; pretend it worked.
  if (clean(body.company)) return NextResponse.json({ ok: true });

  const fields = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    pronouns: clean(body.pronouns, 60),
    phone: clean(body.phone, 40),
    for: clean(body.for, 60),
    focus: clean(body.focus, 80),
    message: clean(body.message),
  };
  if (!fields.name || !/^\S+@\S+\.\S+$/.test(fields.email) || body.consent !== "on" || body.privacy !== "on") {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONSULTATION_TO_EMAIL;
  if (!key || !to) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `<p><b>${k}</b><br>${escape(v).replace(/\n/g, "<br>")}</p>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONSULTATION_FROM_EMAIL ?? "ImPsychOut <onboarding@resend.dev>",
      to: [to],
      reply_to: fields.email,
      subject: `New consultation request from ${fields.name}`,
      html: rows,
    }),
  });
  if (!res.ok) return NextResponse.json({ error: "send_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
