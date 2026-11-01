import type { Metadata, Viewport } from "next";
import { Chewy, Fraunces, Gochi_Hand, Onest } from "next/font/google";
import { site } from "@/lib/content";
import { DoodleSprite } from "@/components/Doodles";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";
import { SoundProvider } from "@/components/SoundProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const onest = Onest({ subsets: ["latin"], variable: "--font-onest", display: "swap" });
const chewy = Chewy({ subsets: ["latin"], weight: "400", variable: "--font-chewy", display: "swap" });
const gochi = Gochi_Hand({ subsets: ["latin"], weight: "400", variable: "--font-gochi", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.title} | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.therapist }],
  creator: site.therapist,
  keywords: [
    "online therapy",
    "clinical psychologist",
    "online psychologist",
    "CBT therapist online",
    "DBT therapy",
    "anxiety therapy",
    "OCD therapy",
    "neurodiversity affirming therapist",
    "therapy for young adults",
    "Laraib Fatima Ahmed",
    "ImPsychOut",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: `${site.name}: your safe space to talk`,
    description: site.description,
    locale: "en_GB",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "ImPsychOut: online therapy with Laraib Fatima Ahmed" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: your safe space to talk`,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "health",
};

export const viewport: Viewport = {
  themeColor: "#fbf7ef",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${fraunces.variable} ${onest.variable} ${chewy.variable} ${gochi.variable}`}>
      <body>
        <SoundProvider>
          <DoodleSprite />
          <a className="skip" href="#main">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </SoundProvider>
      </body>
    </html>
  );
}
