import type { MetadataRoute } from "next";
import { getCopy } from "@/lib/cms";
import { site } from "@/lib/content";
import { services } from "@/lib/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const portrait = (await getCopy()).hero.photo.src;
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1, images: [`${site.url}${portrait}`] },
    { url: `${site.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...["privacy", "cookies", "terms", "accessibility"].map((p) => ({
      url: `${site.url}/${p}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...services.map((s) => ({
      url: `${site.url}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
