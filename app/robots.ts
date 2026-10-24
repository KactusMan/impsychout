import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

// Open to search engines and to AI assistants/agents, so people asking an AI for a therapist can find Laraib.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"],
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
