// Safe Haven sessions: a signed, httpOnly cookie "<expiry>.<signature>".
// The signature is an HMAC of the expiry using SAFEHAVEN_SECRET, so it can't be forged or extended.
// Uses Web Crypto so it works in both middleware (edge) and route handlers (node).

export const SESSION_COOKIE = "sh_session";
export const SESSION_DAYS = 7;

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createSession(secret: string) {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${exp}.${await hmac(secret, `safehaven:${exp}`)}`;
}

export async function verifySession(value: string | undefined, secret: string | undefined) {
  if (!value || !secret) return false;
  const [expStr, sig] = value.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  const expected = await hmac(secret, `safehaven:${exp}`);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export const authConfigured = () => Boolean(process.env.SAFEHAVEN_PASSWORD && process.env.SAFEHAVEN_SECRET);
