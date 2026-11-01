import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Booking } from "@/components/Booking";
import { CareIcon } from "@/components/CareIcon";
import { GumButton } from "@/components/GumButton";
import { Reveal } from "@/components/Reveal";
import { Faq } from "@/components/Sections";
import { approaches, site } from "@/lib/content";
import { serviceBySlug, services } from "@/lib/services";

const REVIEWED = "2026-11-01"; // update when the clinical content is reviewed again

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  const url = `/services/${s.slug}`;
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: `${s.metaTitle} | ${site.name}`, description: s.metaDescription, images: ["/og.jpg"] },
    twitter: { card: "summary_large_image", title: s.metaTitle, description: s.metaDescription, images: ["/og.jpg"] },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();

  const used = s.approaches.map((id) => approaches.find((a) => a.id === id)!).filter(Boolean);
  const related = s.related.map((r) => serviceBySlug(r)!).filter(Boolean);
  const pageUrl = `${site.url}/services/${s.slug}`;

  // Structured data: the page, who wrote and reviewed it, the service itself, breadcrumbs and FAQs.
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        name: s.h1,
        description: s.metaDescription,
        inLanguage: "en-GB",
        lastReviewed: REVIEWED,
        author: { "@id": `${site.url}/#laraib` },
        reviewedBy: { "@id": `${site.url}/#laraib` },
        about: { "@id": `${pageUrl}#service` },
        isPartOf: { "@id": `${site.url}/#website` },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: s.h1,
        serviceType: s.name,
        description: s.answer,
        provider: { "@id": `${site.url}/#practice` },
        areaServed: "Worldwide (online)",
        availableChannel: { "@type": "ServiceChannel", name: "Secure video sessions", serviceUrl: `${pageUrl}#book` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "How I help", item: `${site.url}/services` },
          { "@type": "ListItem", position: 3, name: s.name, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <article className="svc">
        <header className="svc__hero section--dots">
          <div className="container svc__hero-grid">
            <div>
              <nav className="crumbs" aria-label="Breadcrumb">
                <ol>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/services">How I help</Link>
                  </li>
                  <li aria-current="page">{s.name}</li>
                </ol>
              </nav>
              <h1 className="display svc__title">{s.h1}</h1>
              <p className="svc__answer">{s.answer}</p>
              <div className="svc__byline">
                <img src="/images/logo.png" alt="" width={56} height={56} />
                <p>
                  Written by <b>Laraib Fatima Ahmed</b>, MSc Clinical Psychology, BPS Graduate Member (MBPsS).
                  <br />
                  <span>Last reviewed {new Date(REVIEWED).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                </p>
              </div>
              <div className="svc__ctas">
                <GumButton href="#book" size="lg">Request a free consultation</GumButton>
                <a className="text-link" href="#how" data-sfx-hover="tick">
                  How therapy helps <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
            <div className="svc__art" aria-hidden="true">
              <div className="svc__art-card">
                <CareIcon name={s.icon} />
              </div>
            </div>
          </div>
        </header>

        <section className="svc__section container" aria-labelledby="signs">
          <Reveal className="svc__signs note">
            <span className="tape tape--pink" style={{ ["--r" as string]: "-4deg", top: -12, left: 30 }} />
            <h2 id="signs" className="display">{s.signsTitle}</h2>
            <ul>
              {s.signs.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="svc__signs-foot hand">if any of this feels familiar, you&apos;re not alone</p>
          </Reveal>
        </section>

        <section className="svc__section container" id="how" aria-labelledby="how-title">
          <h2 id="how-title" className="display h2">How therapy can help</h2>
          <div className="svc__help">
            {s.help.map((h, i) => (
              <Reveal as="article" key={h.title} className="svc__help-card" delay={i * 0.06}>
                <span className="svc__help-num hand">0{i + 1}</span>
                <h3>{h.title}</h3>
                <p>{h.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="svc__section section--grid svc__band" aria-labelledby="approach-title">
          <div className="container">
            <h2 id="approach-title" className="display h2">Approaches we might use</h2>
            <div className="svc__approaches">
              {used.map((a) => (
                <Reveal as="article" key={a.id} className="svc__approach" style={{ ["--c" as string]: a.color }}>
                  <p className="svc__approach-tag">{a.tab}</p>
                  <h3>{a.name}</h3>
                  <p>{a.body}</p>
                </Reveal>
              ))}
            </div>
            <p className="svc__more">
              Curious how these work? <Link href="/#approach" className="text-link">See all my frameworks, explained simply</Link>
            </p>
          </div>
        </section>

        <section className="svc__section container svc__sessions" aria-labelledby="sessions-title">
          <div>
            <h2 id="sessions-title" className="display h2">What sessions look like</h2>
            <p>{s.sessions}</p>
            <p>
              It always starts with a free 15-minute fit check, so you can ask questions and see how it feels before
              committing to anything. <Link href="/#process" className="text-link">See the four steps</Link>
            </p>
          </div>
          <aside className="svc__crisis">
            <p>
              <b>Not an emergency service.</b> If you or someone else is in immediate danger, call your local
              emergency number or go to your nearest emergency department.
            </p>
          </aside>
        </section>
      </article>

      <Faq items={s.faqs} title={`Questions about ${s.name.toLowerCase()}`} />

      <section className="svc__related container" aria-labelledby="related-title">
        <h2 id="related-title" className="display">Related support</h2>
        <ul>
          {related.map((r) => (
            <li key={r.slug}>
              <Link href={`/services/${r.slug}`} className="svc__related-card" data-sfx-hover="thock">
                <span className="card__ico">
                  <CareIcon name={r.icon} />
                </span>
                <span>
                  <b>{r.name}</b>
                  <span>{r.short}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Booking />
    </>
  );
}
