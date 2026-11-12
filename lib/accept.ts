// Does this Accept header prefer Markdown over HTML? True when text/markdown is listed with a
// quality at least as high as text/html (or HTML isn't listed at all). Browsers send text/html
// first and never text/markdown, so they always get the normal site.
export function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;
  let md = -1;
  let html = -1;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().toLowerCase().split(";");
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (Number.isNaN(q)) continue;
    if (type === "text/markdown" || type === "text/x-markdown") md = Math.max(md, q);
    else if (type === "text/html" || type === "application/xhtml+xml") html = Math.max(html, q);
  }
  return md > 0 && md >= html;
}
