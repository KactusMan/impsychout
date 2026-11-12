import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

// Open to search engines and to AI assistants/agents, so people asking an AI for a therapist can find Laraib.
// The backend (/safehaven, and anything added under it later), the API and the agent-only Markdown
// copies (/md) stay out. next.config.ts also sends X-Robots-Tag: noindex on all of them.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/safehaven", "/md/"] },
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"],
        allow: "/",
        disallow: ["/api/", "/safehaven", "/md/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
