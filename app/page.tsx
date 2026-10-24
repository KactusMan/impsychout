import { Approach } from "@/components/Approach";
import { Booking } from "@/components/Booking";
import { DoodleSprite } from "@/components/Doodles";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { About, Credentials, Faq, Feed, Focus, Footer, KindWords } from "@/components/Sections";
import { Storyteller } from "@/components/Storyteller";
import { jsonLd } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DoodleSprite />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
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
      </main>
      <Footer />
    </>
  );
}
