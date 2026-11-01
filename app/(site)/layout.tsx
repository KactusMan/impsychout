import { A11yProvider, A11yToolbar } from "@/components/A11y";
import { ConsentProvider } from "@/components/Consent";
import { DoodleSprite } from "@/components/Doodles";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";
import { SoundProvider } from "@/components/SoundProvider";
import { getCopy } from "@/lib/cms";

// The public site: header, footer, sound, accessibility toolbar and cookie consent.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const copy = await getCopy();
  return (
    <SoundProvider>
      <A11yProvider>
        <ConsentProvider>
          <DoodleSprite />
          <a className="skip" href="#main">
            Skip to content
          </a>
          <Header services={copy.services.map((s) => ({ slug: s.slug, name: s.name, icon: s.icon }))} />
          <main id="main">{children}</main>
          <Footer c={copy.footer} instagram={copy.site.instagram} />
          <A11yToolbar />
        </ConsentProvider>
      </A11yProvider>
    </SoundProvider>
  );
}
