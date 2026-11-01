import Image from "next/image";
import Link from "next/link";
import { nav } from "@/lib/content";
import type { Copy } from "@/lib/copy";
import type { Tone } from "@/lib/content";
import { CareIcon } from "./CareIcon";
import { ConsentLink } from "./Consent";
import { Doodle } from "./Doodles";
import { Envelope } from "./Envelope";
import { GumButton } from "./GumButton";
import { PlayRoom } from "./PlayRoom";
import { Reveal } from "./Reveal";
import { Rich } from "./Rich";

export function SectionHead({
  eyebrow,
  title,
  sub,
  id,
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  id: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={`section-head${align === "left" ? " section-head--left" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display h2" id={id}>
        {title}
      </h2>
      {sub ? <p className="section-head__sub">{sub}</p> : null}
    </Reveal>
  );
}

export function About({ c }: { c: Copy["about"] }) {
  return (
    <section className="about section--paper" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__copy">
          <Reveal>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="display h2" id="about-title">
              {c.title}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="about__lede">
              <Rich text={c.lede} />
            </p>
            {c.paragraphs.map((t, i) => (
              <p key={i}>
                <Rich text={t} />
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="about__chips">
              {c.chips.map((ch) => (
                <li key={ch.label + ch.text}>
                  <b>{ch.label}</b> {ch.text}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="about__room" delay={0.08}>
          <div className="about__pinned note">
            <span className="tape tape--pink" style={{ ["--r" as string]: "-4deg", top: -12, left: 30 }} />
            <p className="hand">{c.noteTitle}</p>
            <p>{c.noteBody}</p>
          </div>
          <PlayRoom hint={c.playHint} />
          <dl className="about__cats">
            <div>
              <dt className="hand">Pumpkin</dt>
              <dd>{c.pumpkin}</dd>
            </div>
            <div>
              <dt className="hand">Daisy</dt>
              <dd>{c.daisy}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

const TONES: Tone[] = ["sky", "blue", "pink", "paper", "butter", "sky", "paper", "blue"];

export function Focus({ c, services }: { c: Copy["care"]; services: Copy["services"] }) {
  return (
    <section className="focus section--dots" id="focus" aria-labelledby="focus-title">
      <div className="container">
        <SectionHead
          id="focus-title"
          eyebrow={c.eyebrow}
          title={
            <>
              {c.title} <Doodle name="sparkle" className="ico ico--lg" style={{ color: "var(--cornflower)" }} />
            </>
          }
          sub={c.sub}
        />
        <ul className="cards">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 4) * 0.06} rotate={[-1.5, 1, -0.8, 1.6][i % 4]}>
              <Link href={`/services/${s.slug}`} className={`card card--${TONES[i % TONES.length]}`} data-sfx-hover="thock">
                <span className="card__ico">
                  <CareIcon name={s.icon} />
                </span>
                <h3>{s.name}</h3>
                <p>{s.short}</p>
                <span className="card__more">
                  {c.readMore} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
        <Reveal className="focus__cta">
          <p className="hand">{c.nudge}</p>
          <Doodle name="arrow" className="focus__arrow" />
          <GumButton href="#book" size="lg">{c.button}</GumButton>
        </Reveal>
      </div>
    </section>
  );
}

export function Credentials({ c }: { c: Copy["credentials"] }) {
  return (
    <section className="creds section--lined" id="credentials" aria-labelledby="creds-title">
      <div className="container">
        <SectionHead id="creds-title" eyebrow={c.eyebrow} title={c.title} />
        <div className="creds__grid">
          {c.groups.map((g, i) => (
            <Reveal as="article" className="paper-sheet" key={g.heading + i} delay={i * 0.1}>
              <h3>
                <Doodle name={g.icon} className="ico" /> {g.heading}
              </h3>
              <ul>
                {g.items.map((it) => (
                  <li key={it.title}>
                    <b>{it.title}</b>
                    <span>{it.detail}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function KindWords({ c }: { c: Copy["kindWords"] }) {
  return (
    <section className="kind-words section--gingham" aria-labelledby="kind-title">
      <div className="container">
        <SectionHead id="kind-title" eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
        <div className="kind-words__row">
          {c.letters.map((t, i) => (
            <Envelope key={t.who + i} quote={t.quote} who={t.who} index={i} greeting={c.greeting} />
          ))}
        </div>
        <Reveal className="kind-words__foot">
          <p>
            {c.footer}{" "}
            <a href="#book" className="text-link" data-sfx-hover="tick">
              {c.footerLink}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Feed({ c, instagram }: { c: Copy["feed"]; instagram: string }) {
  return (
    <section className="feed section--grid" aria-labelledby="feed-title">
      <div className="container">
        <SectionHead id="feed-title" eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
        <ul className="feed__row">
          {c.posts.map((p, i) => (
            <Reveal as="li" key={p.src} rotate={[-3, 2, -1, 3][i % 4]} delay={i * 0.08} y={40}>
              <a className="polaroid" href={instagram} target="_blank" rel="noopener noreferrer" data-sfx-hover="tick">
                <span
                  className={`tape ${["tape--pink", "tape--blue", "tape--pink", "tape--blue"][i % 4]}`}
                  style={{ ["--r" as string]: `${[-6, 5, -3, 4][i % 4]}deg`, top: -12, left: "32%" }}
                />
                <Image src={p.src} alt={p.alt} width={512} height={640} sizes="(max-width: 640px) 45vw, (max-width: 1020px) 45vw, 22vw" />
              </a>
            </Reveal>
          ))}
        </ul>
        <div className="center">
          <GumButton href={instagram} variant="paper" target="_blank" rel="noopener noreferrer">
            {c.button}
          </GumButton>
        </div>
      </div>
    </section>
  );
}

export function Faq({ items, title, eyebrow = "Good questions" }: { items: { q: string; a: string }[]; title: string; eyebrow?: string }) {
  return (
    <section className="faq section--wash" id="faq" aria-labelledby="faq-title">
      <div className="container container--narrow">
        <SectionHead id="faq-title" eyebrow={eyebrow} title={title} />
        <div className="faq__list">
          {items.map((f, i) => (
            <Reveal key={f.q + i} delay={i * 0.05}>
              <details className="faq__item" name="faq">
                <summary data-sfx-press="drop">
                  <span>{f.q}</span>
                  <span className="faq__plus" aria-hidden="true" />
                </summary>
                <p>
                  <Rich text={f.a} />
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer({ c, instagram }: { c: Copy["footer"]; instagram: string }) {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <a className="brand" href="/">
            <span className="brand__text">
              <span className="brand__name">im psych out</span>
              <span className="brand__tag">your safe space to talk</span>
            </span>
          </a>
          <p className="footer__blurb">{c.blurb}</p>
        </div>
        <nav className="footer__col" aria-label="Footer">
          <p className="footer__h">Explore</p>
          {nav.map((n) => (
            <a key={n.href} href={n.href} data-sfx-hover="tick">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="footer__col">
          <p className="footer__h">Connect</p>
          <a href="/#book" data-sfx-hover="tick">
            Request a consultation
          </a>
          <a href={instagram} target="_blank" rel="noopener noreferrer" data-sfx-hover="tick">
            Instagram
          </a>
        </div>
      </div>
      <div className="container footer__base">
        <p>
          <span className="hand footer__sign">{c.sign}</span> © {new Date().getFullYear()} ImPsychOut. {c.legal}
        </p>
        <nav className="footer__legal" aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/accessibility">Accessibility</Link>
          <ConsentLink>Cookie settings</ConsentLink>
          <ConsentLink>Your privacy choices</ConsentLink>
        </nav>
      </div>
    </footer>
  );
}
