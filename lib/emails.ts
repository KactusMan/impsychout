import "server-only";
import { site } from "./content";

// The two emails a consultation request sends, styled like the site: cream paper, navy ink,
// a butter-yellow sticky note and a little washi tape. Email apps don't load web fonts, so
// Georgia stands in for Fraunces (and its italic for the handwriting) and the system sans for
// Onest. Everything is tables and inline styles, which is what Gmail, Apple Mail and Outlook
// all agree on. House style: no em dashes.

export type Request = {
  name: string;
  email: string;
  pronouns: string;
  phone: string;
  for: string;
  focus: string;
  message: string;
};

const C = {
  paper: "#fbf7ef",
  card: "#fffdf8",
  sky: "#dfeaf7",
  skyDeep: "#b9cfeb",
  denim: "#4c72ad",
  navy: "#1f2f57",
  body: "#3a4562",
  muted: "#55607a",
  pink: "#f4c7d0",
  note: "#fdf0bf",
  coral: "#ef8b7b",
};
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const firstName = (name: string) => name.trim().split(/\s+/)[0] || name.trim();

// Shared frame: logo, a sheet of paper with a strip of tape on top, and a quiet footer.
function frame({ preheader, body, footer }: { preheader: string; body: string; footer: string }) {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>ImPsychOut</title>
</head>
<body style="margin:0;padding:0;background:${C.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.paper};">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};">
  <tr><td align="center" style="padding:32px 16px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
      <tr><td style="padding:0 4px 22px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="vertical-align:middle;padding-right:12px;">
            <img src="${site.url}/images/logo.png" width="52" height="52" alt="" style="display:block;border-radius:50%;border:2px solid ${C.navy};">
          </td>
          <td style="vertical-align:middle;">
            <div style="font-family:${SERIF};font-size:24px;line-height:1;font-weight:bold;color:${C.navy};letter-spacing:-.01em;">im psych out</div>
            <div style="font-family:${SANS};font-size:10px;line-height:1;letter-spacing:.3em;text-transform:uppercase;color:${C.denim};padding-top:6px;">your safe space to talk</div>
          </td>
        </tr></table>
      </td></tr>
      <tr><td align="center" style="font-size:0;line-height:0;">
        <div style="width:96px;height:20px;background:${C.pink};opacity:.95;margin:0 auto -10px;"></div>
      </td></tr>
      <tr><td style="background:${C.card};border:2px solid ${C.navy};border-radius:22px;padding:34px 30px 30px;box-shadow:6px 8px 0 ${C.navy};">
        ${body}
      </td></tr>
      <tr><td style="padding:26px 6px 0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted};text-align:center;">
        ${footer}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const p = (html: string, extra = "") => `<p style="margin:0 0 16px;font-family:${SANS};font-size:16px;line-height:1.6;color:${C.body};${extra}">${html}</p>`;

// ---------------------------------------------------------------------------------------------
// 1. To the person who asked: a warm note that their request arrived and what happens next.

export function followUpEmail(r: Request) {
  const first = esc(firstName(r.name));
  const step = (n: string, html: string) => `
    <tr>
      <td valign="top" style="width:34px;padding:0 0 12px;font-family:${SERIF};font-size:20px;line-height:1.3;font-weight:bold;color:${C.denim};">${n}</td>
      <td valign="top" style="padding:0 0 12px;font-family:${SANS};font-size:15px;line-height:1.55;color:${C.navy};">${html}</td>
    </tr>`;
  const detail = (label: string, value: string) =>
    value ? `<tr><td style="padding:3px 14px 3px 0;font-family:${SANS};font-size:13px;color:${C.muted};white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:3px 0;font-family:${SANS};font-size:13px;color:${C.navy};vertical-align:top;">${esc(value)}</td></tr>` : "";

  const body = `
    <p style="margin:0 0 6px;font-family:${SERIF};font-style:italic;font-size:19px;color:${C.denim};">hi ${first},</p>
    <h1 style="margin:0 0 18px;font-family:${SERIF};font-size:28px;line-height:1.15;font-weight:bold;color:${C.navy};letter-spacing:-.01em;">Thank you for reaching out. Your request <span style="font-style:italic;color:${C.denim};">reached me</span>.</h1>
    ${p("Reaching out can be the hardest part, so I'm really glad you did. I read every request myself, and I'll get back to you personally.")}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 22px;">
      <tr><td style="background:${C.note};border-radius:4px 4px 22px 4px;padding:22px 22px 10px;">
        <p style="margin:0 0 14px;font-family:${SERIF};font-style:italic;font-size:19px;color:${C.denim};">what happens next</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${step("1", "I'll reply <b>within one working day</b> with a few times for your <b>free 15-minute fit check</b>, by video or audio.")}
          ${step("2", "You pick whatever suits you. If none of them work, just say so and we'll find another.")}
          ${step("3", "On the call, ask anything. It's a short, relaxed conversation about starting therapy, not a session, and there's no pressure to decide on the spot.")}
        </table>
      </td></tr>
    </table>

    ${r.focus || r.for ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr><td style="border-top:1.5px dashed ${C.skyDeep};padding-top:16px;">
        <p style="margin:0 0 8px;font-family:${SANS};font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${C.denim};font-weight:bold;">What you told me</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          ${detail("Help with", r.focus)}
          ${detail("For", r.for)}
        </table>
      </td></tr>
    </table>` : ""}

    ${p("Want to add something, or change your mind? Just reply to this email. It comes straight to me.")}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 24px;">
      <tr><td style="border-left:3px solid ${C.coral};padding:2px 0 2px 14px;font-family:${SANS};font-size:13px;line-height:1.55;color:${C.muted};">
        <b style="color:${C.navy};">In crisis?</b> My inbox isn't monitored around the clock. If you or someone else is in immediate danger, please call your local emergency number or go to your nearest emergency department.
      </td></tr>
    </table>

    <p style="margin:0;font-family:${SERIF};font-style:italic;font-size:22px;color:${C.navy};">with care, Laraib</p>
    <p style="margin:4px 0 0;font-family:${SANS};font-size:13px;color:${C.muted};">Laraib Fatima Ahmed · Clinical Psychologist, MBPsS</p>`;

  const footer = `
    <a href="${site.url}" style="color:${C.denim};text-decoration:none;font-weight:bold;">ImPsychOut</a> · psychology, uncomplicated ·
    <a href="${site.instagram}" style="color:${C.denim};text-decoration:none;">Instagram</a><br>
    You're getting this one-off email because you asked for a free consultation on our website. It's not a mailing list.<br>
    <a href="${site.url}/privacy" style="color:${C.muted};">Privacy Policy</a>`;

  const text = [
    `hi ${firstName(r.name)},`,
    "",
    "Thank you for reaching out. Your request reached me.",
    "Reaching out can be the hardest part, so I'm really glad you did. I read every request myself, and I'll get back to you personally.",
    "",
    "What happens next",
    "1. I'll reply within one working day with a few times for your free 15-minute fit check, by video or audio.",
    "2. You pick whatever suits you. If none of them work, just say so and we'll find another.",
    "3. On the call, ask anything. It's a short, relaxed conversation about starting therapy, not a session, and there's no pressure to decide on the spot.",
    "",
    r.focus ? `Help with: ${r.focus}` : "",
    r.for ? `For: ${r.for}` : "",
    "",
    "Want to add something, or change your mind? Just reply to this email. It comes straight to me.",
    "",
    "In crisis? My inbox isn't monitored around the clock. If you or someone else is in immediate danger, please call your local emergency number or go to your nearest emergency department.",
    "",
    "with care, Laraib",
    "Laraib Fatima Ahmed, Clinical Psychologist, MBPsS",
    "",
    `ImPsychOut · ${site.url}`,
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");

  return {
    subject: `Thank you, ${firstName(r.name)}. Your request reached me`,
    html: frame({ preheader: "I'll reply within one working day with times for your free 15-minute fit check.", body, footer }),
    text,
  };
}

// ---------------------------------------------------------------------------------------------
// 2. To Laraib: everything they shared, laid out to read at a glance, with a one-tap reply.

export function notificationEmail(r: Request) {
  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:10px 0;border-top:1.5px dashed ${C.skyDeep};">
          <div style="font-family:${SANS};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${C.denim};font-weight:bold;padding-bottom:3px;">${label}</div>
          <div style="font-family:${SANS};font-size:15px;line-height:1.55;color:${C.navy};">${esc(value).replace(/\n/g, "<br>")}</div>
        </td></tr>`
      : "";
  const first = esc(firstName(r.name));
  const replyHref = `mailto:${encodeURIComponent(r.email)}?subject=${encodeURIComponent("Your free consultation with ImPsychOut")}`;

  const body = `
    <p style="margin:0 0 6px;font-family:${SERIF};font-style:italic;font-size:19px;color:${C.denim};">a new request ♡</p>
    <h1 style="margin:0 0 18px;font-family:${SERIF};font-size:26px;line-height:1.2;font-weight:bold;color:${C.navy};">${esc(r.name)} would like a free consultation</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">
      ${row("Name", r.name)}
      ${row("Pronouns", r.pronouns)}
      ${row("Email", r.email)}
      ${row("WhatsApp / phone", r.phone)}
      ${row("Who it's for", r.for)}
      ${row("Help with", r.focus)}
      ${row("What brings them here", r.message)}
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="background:${C.navy};border-radius:12px;">
        <a href="${replyHref}" style="display:inline-block;padding:14px 22px;font-family:${SANS};font-size:15px;font-weight:bold;color:${C.paper};text-decoration:none;">Reply to ${first}</a>
      </td>
    </tr></table>
    <p style="margin:16px 0 0;font-family:${SANS};font-size:13px;line-height:1.55;color:${C.muted};">Hitting reply on this email works too: it goes straight to ${first}. They were promised a reply within one working day.</p>`;

  const footer = `Sent by the consultation form on <a href="${site.url}" style="color:${C.denim};">${site.url.replace(/^https?:\/\//, "")}</a>. This holds health information, so please keep it private.`;

  const text = [
    `New consultation request from ${r.name}`,
    "",
    `Name: ${r.name}`,
    r.pronouns && `Pronouns: ${r.pronouns}`,
    `Email: ${r.email}`,
    r.phone && `WhatsApp / phone: ${r.phone}`,
    r.for && `Who it's for: ${r.for}`,
    r.focus && `Help with: ${r.focus}`,
    r.message && `\nWhat brings them here:\n${r.message}`,
    "",
    "Reply to this email to answer them directly. They were promised a reply within one working day.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `New consultation request from ${r.name}`,
    html: frame({ preheader: `${r.name}${r.focus ? `, ${r.focus}` : ""}. Reply within one working day.`, body, footer }),
    text,
  };
}
