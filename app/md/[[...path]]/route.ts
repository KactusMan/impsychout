import { notFoundMarkdown, pageMarkdown } from "@/lib/agent";

// Markdown versions of the pages. Not linked anywhere: middleware.ts rewrites a page request here
// when the client asks for text/markdown, so agents get Markdown at the page's own URL.
const HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
  "X-Robots-Tag": "noindex",
};

export async function GET(_req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const pathname = `/${path.join("/")}`;
  const body = await pageMarkdown(pathname);
  if (body) return new Response(body, { headers: HEADERS });
  return new Response(notFoundMarkdown(pathname), { status: 404, headers: HEADERS });
}
