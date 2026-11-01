import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_DAYS, createSession } from "@/lib/auth";

const sha = (s: string) => createHash("sha256").update(s).digest();

export async function POST(req: Request) {
  const password = process.env.SAFEHAVEN_PASSWORD;
  const secret = process.env.SAFEHAVEN_SECRET;
  if (!password || !secret) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  let given = "";
  try {
    given = String((await req.json()).password ?? "");
  } catch {}

  // compare fixed-length hashes in constant time; slow down wrong guesses
  if (!timingSafeEqual(sha(given), sha(password))) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "wrong_password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSession(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return res;
}
