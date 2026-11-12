import { NextResponse, type NextRequest } from "next/server";
import { prefersMarkdown } from "@/lib/accept";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

// Two jobs:
// 1. /safehaven is the private backend. Everything under it (and its API) needs a valid session,
//    except the sign-in page itself, and is never indexed. Put any future backend page under
//    /safehaven and it gets the same protection, plus the noindex rules in next.config.ts and
//    app/robots.ts, automatically.
// 2. Markdown for AI agents: a page request that prefers text/markdown is answered from app/md
//    with Content-Type text/markdown, at the page's own URL. The matcher only lets requests whose
//    Accept header mentions markdown through, so browsers never run this part.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/safehaven") || pathname.startsWith("/api/safehaven")) {
    if (pathname === "/safehaven/login" || pathname === "/api/safehaven/login") return NextResponse.next();
    const ok = await verifySession(req.cookies.get(SESSION_COOKIE)?.value, process.env.SAFEHAVEN_SECRET);
    if (ok) {
      const res = NextResponse.next();
      res.headers.set("Cache-Control", "no-store");
      return res;
    }
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
    const url = req.nextUrl.clone();
    url.pathname = "/safehaven/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!prefersMarkdown(req.headers.get("accept"))) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/md${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/safehaven/:path*",
    "/api/safehaven/:path*",
    {
      source: "/((?!_next|api|md/|safehaven|.*\\..*).*)",
      has: [{ type: "header", key: "accept", value: ".*markdown.*" }],
    },
  ],
};
