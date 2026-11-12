import { llmsFullTxt } from "@/lib/agent";

// Every page in one Markdown file, for agents that want the whole picture at once.
export const revalidate = 3600;

export async function GET() {
  return new Response(await llmsFullTxt(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
