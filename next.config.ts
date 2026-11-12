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
      // The backend, the API and the Markdown copies for agents never belong in search results,
      // including the Safe Haven sign-in page and anything added under /safehaven later.
      {
        source: "/:prefix(safehaven|api|md)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      { source: "/safehaven", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      // Only www.impsychout.com belongs in search: preview deployments stay out of it.
      {
        source: "/:path*",
        missing: [{ type: "host", value: "www.impsychout.com" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/sfx/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
