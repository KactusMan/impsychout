import { Approach } from "@/components/Approach";
import { Booking } from "@/components/Booking";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { About, Credentials, Faq, Feed, Focus, KindWords } from "@/components/Sections";
import { Storyteller } from "@/components/Storyteller";
import { jsonLd } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Storyteller />
      <About />
      <Focus />
      <Approach />
      <Process />
      <Credentials />
      <KindWords />
      <Feed />
      <Faq />
      <Booking />
    </>
  );
}
