import { NextResponse } from "next/server";
import { followUpEmail, notificationEmail, type Request as ConsultationRequest } from "@/lib/emails";

// Receives consultation requests from the booking form and, through Resend:
//   1. emails the request to Laraib (impsychout@gmail.com unless CONSULTATION_TO_EMAIL says otherwise)
//   2. sends the person a warm "your request reached me" follow-up, styled like the site
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY            required
//   CONSULTATION_TO_EMAIL     optional, defaults to impsychout@gmail.com
//   CONSULTATION_FROM_EMAIL   optional, defaults to "Laraib at ImPsychOut <hello@impsychout.com>"
//
// Emails come from impsychout.com once that domain is verified in Resend. Until then Resend
// refuses it, so Laraib's copy is re-sent from Resend's shared onboarding@resend.dev address
// (which only delivers to the Resend account's owner). The follow-up to clients needs the
// verified domain; if Resend refuses it, the request still goes through and Laraib still hears
// about it. Without RESEND_API_KEY the route answers 503 so the form points people to Instagram.

const TO = process.env.CONSULTATION_TO_EMAIL || "impsychout@gmail.com";
const FROM = process.env.CONSULTATION_FROM_EMAIL || "Laraib at ImPsychOut <hello@impsychout.com>";
const FALLBACK_FROM = "ImPsychOut <onboarding@resend.dev>";

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

async function sendFrom(key: string, from: string, email: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...email }),
  });
  if (!res.ok) console.error(`[consultation] Resend ${res.status} from ${from}: ${(await res.text()).slice(0, 300)}`);
  return res;
}

// Try the real address first; if Resend says the domain isn't verified yet (403), use its shared one.
async function send(key: string, email: Record<string, unknown>) {
  const res = await sendFrom(key, FROM, email);
  if (res.ok || res.status !== 403 || FROM === FALLBACK_FROM) return res.ok;
  return (await sendFrom(key, FALLBACK_FROM, email)).ok;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Bots fill the hidden field; pretend it worked.
  if (clean(body.company)) return NextResponse.json({ ok: true });

  const r: ConsultationRequest = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    pronouns: clean(body.pronouns, 60),
    phone: clean(body.phone, 40),
    for: clean(body.for, 60),
    focus: clean(body.focus, 80),
    message: clean(body.message),
  };
  if (!r.name || !/^\S+@\S+\.\S+$/.test(r.email) || body.consent !== "on" || body.privacy !== "on") {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  // Laraib's copy is the one that matters: if it can't be sent, tell the person so they can retry.
  const note = notificationEmail(r);
  const delivered = await send(key, { to: [TO], reply_to: r.email, subject: note.subject, html: note.html, text: note.text });
  if (!delivered) return NextResponse.json({ error: "send_failed" }, { status: 502 });

  // The follow-up is a kindness, not a requirement: never fail the request over it.
  const thanks = followUpEmail(r);
  const followedUp = await send(key, { to: [r.email], reply_to: TO, subject: thanks.subject, html: thanks.html, text: thanks.text }).catch(() => false);

  return NextResponse.json({ ok: true, followUp: followedUp });
}
