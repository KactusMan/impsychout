import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      { source: "/services/schizophrenia-spectrum", destination: "/services", permanent: true },
      // The site lives at www.impsychout.com now (Vercel sends impsychout.com there too): send
      // anyone, and any search engine, on the old vercel.app address straight to the same page.
      { source: "/:path*", has: [{ type: "host", value: "impsychout.vercel.app" }], destination: "https://www.impsychout.com/:path*", permanent: true },
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
