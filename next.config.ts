import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      { source: "/services/schizophrenia-spectrum", destination: "/services", permanent: true },
      // The site lives at impsychout.com now: send anyone (and any search engine) on the old
      // vercel.app address to the same page there, so there's only one copy of the site.
      { source: "/:path*", has: [{ type: "host", value: "impsychout.vercel.app" }], destination: "https://impsychout.com/:path*", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/sfx/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
