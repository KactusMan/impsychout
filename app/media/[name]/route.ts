import { contentType, readMedia } from "@/lib/media";

// Serves the photos Laraib uploads in Safe Haven (see lib/media.ts). File names never change once
// written, so they can be cached for a year.
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const body = await readMedia(name);
  if (!body) return new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
  return new Response(body as BodyInit, {
    headers: {
      "Content-Type": contentType(name),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
