import { Approach } from "@/components/Approach";
import { Booking } from "@/components/Booking";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { About, Credentials, Faq, Feed, Focus, KindWords } from "@/components/Sections";
import { Untangle } from "@/components/Untangle";
import { getCopy } from "@/lib/cms";
import { jsonLd } from "@/lib/schema";

export default async function Home() {
  const c = await getCopy();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero c={c.hero} />
      <Untangle c={c.untangle} />
      <About c={c.about} />
      <Focus c={c.care} services={c.services} />
      <Approach c={c.approach} />
      <Process c={c.process} />
      <Credentials c={c.credentials} />
      <KindWords c={c.kindWords} />
      <Feed c={c.feed} instagram={c.site.instagram} />
      <Faq items={c.faq.items} title={c.faq.title} eyebrow={c.faq.eyebrow} />
      <Booking c={c.booking} instagram={c.site.instagram} />
    </>
  );
}
