import type { Metadata } from "next";
import Link from "next/link";
import { CareIcon } from "@/components/CareIcon";
import { GumButton } from "@/components/GumButton";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/content";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Online Therapy Services",
  description:
    "Online therapy services with clinical psychologist Laraib Fatima Ahmed: anxiety, depression, OCD, neurodiversity, personality disorders, individual therapy and psychological assessment.",
  alternates: { canonical: "/services" },
};

export default function ServicesIndex() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Online therapy services",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.url}/services/${s.slug}`,
      name: s.h1,
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="svc__hero section--dots">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-current="page">How I help</li>
            </ol>
          </nav>
          <h1 className="display svc__title">How I can help</h1>
          <p className="svc__answer">
            Online therapy for teens, young adults and adults, shaped around your needs. Choose an area to read more, or
            simply request a free 15-minute consultation and we&apos;ll work it out together.
          </p>
          <ul className="cards cards--index">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 4) * 0.05}>
                <Link href={`/services/${s.slug}`} className={`card card--${["sky", "paper", "pink", "paper"][i % 4]}`} data-sfx-hover="thock">
                  <span className="card__ico">
                    <CareIcon name={s.icon} />
                  </span>
                  <h2>{s.name}</h2>
                  <p>{s.short}</p>
                  <span className="card__more">
                    Read more <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <div className="center">
            <GumButton href="/#book" size="lg">Request a free consultation</GumButton>
          </div>
        </div>
      </section>
    </>
  );
}
