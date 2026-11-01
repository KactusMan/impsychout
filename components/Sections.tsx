import Image from "next/image";
import Link from "next/link";
import { credentials, faqs, feed, nav, site, testimonials, type Tone } from "@/lib/content";
import { services } from "@/lib/services";
import { CareIcon } from "./CareIcon";
import { Doodle } from "./Doodles";
import { Envelope } from "./Envelope";
import { GumButton } from "./GumButton";
import { PlayRoom } from "./PlayRoom";
import { Reveal } from "./Reveal";

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

export function About() {
  return (
    <section className="about section--paper" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__copy">
          <Reveal>
            <p className="eyebrow">About my practice</p>
            <h2 className="display h2" id="about-title">
              Understanding, not diagnosing.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="about__lede">
              Hi, I&apos;m Laraib Fatima Ahmed. In a world that often demands non-stop productivity and quiet
              suffering, finding a genuinely non-judgmental space can feel transformative.
            </p>
            <p>
              Healing begins when we remove the shame and confusion around mental health. My clinical work blends
              rigorous science, including Cognitive Behavioural Therapy (CBT) and Dialectical Behaviour Therapy (DBT),
              with genuine human warmth and cultural understanding. I&apos;ve worked across clinical settings in the UK
              and in international online therapy.
            </p>
            <p>
              You&apos;ll never be treated like a list of symptoms. Together, we untangle persistent thought loops,
              build a sense of safety in your body, and shape a life that feels like your own.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="about__chips">
              <li>
                <b>MSc</b> Clinical Psychology, with Merit
              </li>
              <li>
                <b>BPS</b> Graduate Member (MBPsS)
              </li>
              <li>
                <b>UK</b> &amp; international clinical experience
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal className="about__room" delay={0.08}>
          <div className="about__pinned note">
            <span className="tape tape--pink" style={{ ["--r" as string]: "-4deg", top: -12, left: 30 }} />
            <p className="hand">beyond the clinic</p>
            <p>
              Reader of existential philosophy, reflective essayist, musician, cosy gamer, and proud cat mom to two
              delightfully chaotic felines.
            </p>
          </div>
          <PlayRoom />
          <dl className="about__cats">
            <div>
              <dt className="hand">Pumpkin</dt>
              <dd>Chases everything. Zero chill. Will pounce on your cursor.</dd>
            </div>
            <div>
              <dt className="hand">Daisy</dt>
              <dd>Supervises. Gets there eventually, then has a little lie down.</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

const TONES: Tone[] = ["sky", "blue", "pink", "paper", "butter", "sky", "paper", "blue"];

export function Focus() {
  return (
    <section className="focus section--dots" id="focus" aria-labelledby="focus-title">
      <div className="container">
        <SectionHead
          id="focus-title"
          eyebrow="Specialised care"
          title={
            <>
              Pull up a chair, here&apos;s what we can work on{" "}
              <Doodle name="sparkle" className="ico ico--lg" style={{ color: "var(--cornflower)" }} />
            </>
          }
          sub="Tailored, collaborative care designed around your neurotype, life stage and lived experience."
        />
        <ul className="cards">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 4) * 0.06} rotate={[-1.5, 1, -0.8, 1.6][i % 4]}>
              <Link href={`/services/${s.slug}`} className={`card card--${TONES[i]}`} data-sfx-hover="thock">
                <span className="card__ico">
                  <CareIcon name={s.icon} />
                </span>
                <h3>{s.name}</h3>
                <p>{s.short}</p>
                <span className="card__more">
                  Read more <span aria-hidden="true">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
        <Reveal className="focus__cta">
          <p className="hand">not sure where you fit? that&apos;s okay, that&apos;s what the free consultation is for</p>
          <Doodle name="arrow" className="focus__arrow" />
          <GumButton href="#book" size="lg">Request a free consultation</GumButton>
        </Reveal>
      </div>
    </section>
  );
}

export function Credentials() {
  return (
    <section className="creds section--lined" id="credentials" aria-labelledby="creds-title">
      <div className="container">
        <SectionHead
          id="creds-title"
          eyebrow="Clinical credentials & training"
          title="Grounded in British & international standards."
        />
        <div className="creds__grid">
          {credentials.map((c, i) => (
            <Reveal as="article" className="paper-sheet" key={c.heading} delay={i * 0.1}>
              <h3>
                <Doodle name={c.icon} className="ico" /> {c.heading}
              </h3>
              <ul>
                {c.items.map((it) => (
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

export function KindWords() {
  return (
    <section className="kind-words section--gingham" aria-labelledby="kind-title">
      <div className="container">
        <SectionHead
          id="kind-title"
          eyebrow="Kind words"
          title="Notes from people who've sat in the chair."
          sub="Names are always kept private, because your story is yours."
        />
        <div className="kind-words__row">
          {testimonials.map((t, i) => (
            <Envelope key={t.who} quote={t.quote} who={t.who} index={i} />
          ))}
        </div>
        <Reveal className="kind-words__foot">
          <p>
            Every first conversation starts the same way: with you being heard.{" "}
            <a href="#book" className="text-link" data-sfx-hover="tick">
              Request a free consultation
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Feed() {
  return (
    <section className="feed section--grid" aria-labelledby="feed-title">
      <div className="container">
        <SectionHead
          id="feed-title"
          eyebrow="@impsychout"
          title="Fresh from the feed"
          sub="Gentle reminders and psychology, minus the jargon, every week on Instagram."
        />
        <ul className="feed__row">
          {feed.map((p, i) => (
            <Reveal as="li" key={p.src} rotate={[-3, 2, -1, 3][i]} delay={i * 0.08} y={40}>
              <a className="polaroid" href={site.instagram} target="_blank" rel="noopener noreferrer" data-sfx-hover="tick">
                <span
                  className={`tape ${["tape--pink", "tape--blue", "tape--pink", "tape--blue"][i]}`}
                  style={{ ["--r" as string]: `${[-6, 5, -3, 4][i]}deg`, top: -12, left: "32%" }}
                />
                <Image src={p.src} alt={p.alt} width={512} height={640} sizes="(max-width: 640px) 45vw, (max-width: 1020px) 45vw, 22vw" />
              </a>
            </Reveal>
          ))}
        </ul>
        <div className="center">
          <GumButton href={site.instagram} variant="paper" target="_blank" rel="noopener noreferrer">
            Follow on Instagram
          </GumButton>
        </div>
      </div>
    </section>
  );
}

export function Faq({ items = faqs, title = "Before you reach out" }: { items?: { q: string; a: string }[]; title?: string }) {
  return (
    <section className="faq section--wash" id="faq" aria-labelledby="faq-title">
      <div className="container container--narrow">
        <SectionHead id="faq-title" eyebrow="Good questions" title={title} />
        <div className="faq__list">
          {items.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <details className="faq__item" name="faq">
                <summary data-sfx-press="paper">
                  <span>{f.q}</span>
                  <span className="faq__plus" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__sky" aria-hidden="true" />
      <div className="container footer__inner">
        <div className="footer__card">
          <span className="tape tape--blue" style={{ ["--r" as string]: "-5deg", top: -14, left: 40 }} />
          <span className="tape tape--pink" style={{ ["--r" as string]: "6deg", top: -12, right: 48 }} />
          <div className="footer__signoff">
            <p className="eyebrow">Whenever you&apos;re ready</p>
            <p className="display footer__line">
              I&apos;ll be here, <em>kettle on.</em>
            </p>
            <p className="footer__blurb">
              Online therapy with clinical psychologist Laraib Fatima Ahmed. A free 15-minute consultation is the
              gentlest way to start. No pressure, no commitment.
            </p>
            <GumButton href="/#book">Request a free consultation</GumButton>
          </div>

          <nav className="footer__col" aria-label="Explore">
            <p className="footer__h">Explore</p>
            {nav.map((n) => (
              <a key={n.href} href={n.href} data-sfx-hover="tick">
                {n.label}
              </a>
            ))}
          </nav>

          <nav className="footer__col" aria-label="Services">
            <p className="footer__h">How I help</p>
            {services.slice(0, 6).map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} data-sfx-hover="tick">
                {s.name}
              </Link>
            ))}
          </nav>

          <div className="footer__col">
            <p className="footer__h">Say hello</p>
            <a href="/#book" data-sfx-hover="tick">
              Request a consultation
            </a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" data-sfx-hover="tick">
              Instagram @impsychout
            </a>
            <p className="footer__note">Online sessions, wherever you are.</p>
          </div>
        </div>

        <div className="footer__ledge">
          <p className="footer__sign">
            <span className="hand">with care, Laraib</span>
            <span>and her two very serious supervisors</span>
          </p>
          <div className="footer__cats" aria-hidden="true">
            <span className="footer__cat footer__cat--daisy">
              <img src="/art/daisy-loaf.webp" alt="" width={520} height={273} loading="lazy" />
              <span className="footer__cat-name hand">Daisy, napping</span>
            </span>
            <span className="footer__cat footer__cat--pumpkin">
              <img src="/art/pumpkin-sit.webp" alt="" width={356} height={520} loading="lazy" />
              <span className="footer__cat-name hand">Pumpkin, on duty</span>
            </span>
          </div>
        </div>

        <div className="footer__base">
          <p>
            © {new Date().getFullYear()} ImPsychOut · Not an emergency service. If you&apos;re in danger, call your
            local emergency number.
          </p>
          <p className="footer__wordmark" aria-hidden="true">
            im psych out
          </p>
        </div>
      </div>
    </footer>
  );
}
