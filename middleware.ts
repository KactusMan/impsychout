import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

// Everything under /safehaven (and its API) needs a valid session, except the sign-in page itself.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/safehaven/login" || pathname === "/api/safehaven/login") return NextResponse.next();

  const ok = await verifySession(req.cookies.get(SESSION_COOKIE)?.value, process.env.SAFEHAVEN_SECRET);
  if (ok) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "no-store");
    return res;
  }
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = "/safehaven/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/safehaven/:path*", "/api/safehaven/:path*"] };
