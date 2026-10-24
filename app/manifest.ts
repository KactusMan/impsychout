import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name}: online therapy with ${site.therapist}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ef",
    theme_color: "#1f2f57",
    icons: [{ src: "/images/logo.png", sizes: "300x300", type: "image/png" }],
  };
}
