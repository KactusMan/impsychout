import { NextResponse } from "next/server";
import { Resend } from "resend";

// Mail sent to any @impsychout.com address arrives at Resend (the domain's MX record points there).
// Resend tells this route about each one with an `email.received` webhook, and the route passes the
// email on to Laraib's Gmail with its text, formatting and attachments. Pressing Reply in Gmail goes
// straight to the person who wrote, not back to impsychout.com.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY          required (the same one the booking form uses)
//   RESEND_WEBHOOK_SECRET   required: the signing secret Resend shows for the webhook (whsec_...)
//   INBOUND_FORWARD_TO      optional, defaults to CONSULTATION_TO_EMAIL, then impsychout@gmail.com
//
// Resend setup: Webhooks → Add webhook → https://www.impsychout.com/api/inbound, event "email.received".

export const maxDuration = 60;

const TO = process.env.INBOUND_FORWARD_TO || process.env.CONSULTATION_TO_EMAIL || "impsychout@gmail.com";
const FROM_ADDRESS = "hello@impsychout.com";
const OWN_DOMAIN = "@impsychout.com";
const MAX_ATTACHMENTS_BYTES = 30 * 1024 * 1024; // Resend allows 40MB per email, base64 adds a third

// "Jane Doe <jane@example.com>" → { name: "Jane Doe", address: "jane@example.com" }
function parseAddress(raw: string) {
  const m = raw.match(/^\s*"?([^"<]*?)"?\s*<([^<>]+)>\s*$/);
  return m ? { name: m[1].trim(), address: m[2].trim() } : { name: "", address: raw.trim() };
}

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!key || !secret) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const resend = new Resend(key);
  const payload = await req.text(); // the raw body: parsing it first would break the signature
  const id = req.headers.get("svix-id");
  const timestamp = req.headers.get("svix-timestamp");
  const signature = req.headers.get("svix-signature");
  if (!id || !timestamp || !signature) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  let event;
  try {
    event = resend.webhooks.verify({ payload, headers: { id, timestamp, signature }, webhookSecret: secret });
  } catch {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }
  if (event.type !== "email.received") return NextResponse.json({ ok: true, skipped: event.type });

  const emailId = event.data.email_id;
  const { data: email, error } = await resend.emails.receiving.get(emailId);
  if (error || !email) {
    console.error(`[inbound] couldn't fetch ${emailId}: ${error?.message}`);
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 }); // Resend retries
  }

  const sender = parseAddress(email.from);
  // Never forward our own mail back to ourselves (that's how loops start).
  if (sender.address.toLowerCase().endsWith(OWN_DOMAIN)) return NextResponse.json({ ok: true, skipped: "own_domain" });

  // Inline images are already inside the HTML (as data URIs); fetch the real attachments.
  const attachments: { filename: string; content: string; content_type: string }[] = [];
  const skipped: string[] = [];
  const list = await resend.emails.receiving.attachments.list({ emailId });
  let total = 0;
  for (const a of list.data?.data ?? []) {
    if (a.content_disposition === "inline" && a.content_id) continue;
    const name = a.filename || "attachment";
    if (total + a.size > MAX_ATTACHMENTS_BYTES) {
      skipped.push(name);
      continue;
    }
    const res = await fetch(a.download_url);
    if (!res.ok) {
      skipped.push(name);
      continue;
    }
    total += a.size;
    attachments.push({ filename: name, content: Buffer.from(await res.arrayBuffer()).toString("base64"), content_type: a.content_type });
  }

  const recipients = email.received_for?.length ? email.received_for : email.to;
  const note = `Sent to ${recipients.join(", ")} by ${email.from}${skipped.length ? `. Too large to forward, open it in Resend: ${skipped.join(", ")}` : ""}`;
  const html = email.html ?? (email.text ? `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(email.text)}</pre>` : "");

  const { error: sendError } = await resend.emails.send(
    {
      from: `${(sender.name || sender.address).replace(/["<>]/g, "")} via ImPsychOut <${FROM_ADDRESS}>`,
      to: [TO],
      replyTo: email.reply_to?.length ? email.reply_to : [sender.address],
      subject: email.subject || "(no subject)",
      html: `<p style="font:12px/1.4 system-ui,sans-serif;color:#6b7280;margin:0 0 16px">${escapeHtml(note)}</p>${html}`,
      text: `${note}\n\n${email.text ?? ""}`,
      attachments: attachments.length ? attachments.map((a) => ({ filename: a.filename, content: a.content, contentType: a.content_type })) : undefined,
    },
    { idempotencyKey: `forward-${emailId}` }, // Resend may deliver a webhook twice: forward once
  );
  if (sendError) {
    console.error(`[inbound] couldn't forward ${emailId}: ${sendError.message}`);
    return NextResponse.json({ error: "forward_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
