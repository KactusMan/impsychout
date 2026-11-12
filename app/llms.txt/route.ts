import { llmsTxt } from "@/lib/agent";

// The short guide for AI assistants (llmstxt.org), built from the live copy.
export const revalidate = 3600;

export async function GET() {
  return new Response(await llmsTxt(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
