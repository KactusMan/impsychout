import Image from "next/image";
import { credentials, faqs, feed, focusAreas, site, testimonials } from "@/lib/content";
import { Doodle } from "./Doodles";
import { GumButton } from "./GumButton";
import { Reveal } from "./Reveal";

export function SectionHead({
  eyebrow,
  title,
  sub,
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  id: string;
}) {
  return (
    <Reveal className="section-head">
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
    <section className="about section--sky" id="about" aria-labelledby="about-title">
      <div className="wave wave--top" aria-hidden="true" />
      <div className="container about__grid">
        <div className="about__visual">
          <Reveal className="about__photo polaroid" rotate={-3}>
            <span className="tape tape--pink" style={{ ["--r" as string]: "-5deg", top: -14, left: "36%" }} />
            <Image
              src="/images/laraib-window.jpg"
              alt="Laraib Fatima Ahmed, clinical psychologist, standing by a sunny café window"
              width={960}
              height={1280}
              sizes="(max-width: 860px) 80vw, 34vw"
            />
            <figcaption className="hand">this is me ♡</figcaption>
          </Reveal>
          <Reveal className="notebook" rotate={2} delay={0.15}>
            <span className="tape tape--blue" style={{ ["--r" as string]: "4deg", top: -12, left: 40 }} />
            <p className="hand notebook__hi">beyond the clinic</p>
            <p>
              Reader of existential philosophy, reflective essayist, musician, cosy gamer, and proud cat mom to two
              delightfully chaotic felines.
            </p>
            <Doodle name="cat" className="notebook__cat" />
          </Reveal>
        </div>

        <div className="about__copy">
          <Reveal>
            <p className="eyebrow">About my practice</p>
            <h2 className="display h2" id="about-title">
              Understanding, <span className="hl">not</span> diagnosing.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p>
              Hi, I&apos;m Laraib Fatima Ahmed. In a world that often demands non-stop productivity and quiet
              suffering, finding a genuinely non-judgmental space can feel transformative. Healing begins when we
              remove the shame and confusion around mental health.
            </p>
            <p>
              My clinical work blends rigorous science, including Cognitive Behavioural Therapy (CBT) and Dialectical
              Behaviour Therapy (DBT), with genuine human warmth and cultural understanding. I&apos;ve worked across
              clinical settings in the UK and in international online therapy.
            </p>
            <p>
              You&apos;ll never be treated like a list of symptoms. Together, we untangle persistent thought loops,
              build a sense of safety in your body, and shape a life that feels like your own.
            </p>
          </Reveal>
          <ul className="stat-row">
            {[
              { b: "MSc", s: "Clinical Psychology, with Merit" },
              { b: "BPS", s: "Graduate Member (MBPsS)" },
              { b: "UK", s: "& international clinical experience" },
            ].map((st, i) => (
              <Reveal as="li" className="stat" key={st.b} delay={0.1 + i * 0.08} rotate={i === 1 ? 1.5 : -1}>
                <b>{st.b}</b>
                <span>{st.s}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Focus() {
  return (
    <section className="focus" id="focus" aria-labelledby="focus-title">
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
          {focusAreas.map((f, i) => (
            <Reveal
              as="li"
              key={f.title}
              className={`card card--${f.tone}`}
              delay={(i % 4) * 0.07}
              rotate={[-1.5, 1, -0.8, 1.6][i % 4]}
              whileHover={{ rotate: 0, y: -8, transition: { type: "spring", stiffness: 300, damping: 15 } }}
              data-sfx-hover="kalimba"
            >
              <Doodle name={f.icon} className="card__ico" />
              <h3>{f.title}</h3>
              <p>{f.body}</p>
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
    <section className="creds section--sky" id="credentials" aria-labelledby="creds-title">
      <div className="wave wave--top" aria-hidden="true" />
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
    <section className="kind-words" aria-labelledby="kind-title">
      <div className="container">
        <SectionHead id="kind-title" eyebrow="Kind words" title="From people who've sat in the chair." />
        <div className="kind-words__row">
          {testimonials.map((t, i) => (
            <Reveal
              as="figure"
              key={t.who}
              className={`sticky-note${i % 2 ? " sticky-note--pink" : ""}`}
              rotate={i % 2 ? 1.6 : -2}
              delay={i * 0.12}
              whileHover={{ rotate: 0, scale: 1.02 }}
            >
              <span
                className={`tape ${i % 2 ? "tape--butter" : "tape--blue"}`}
                style={{ ["--r" as string]: i % 2 ? "4deg" : "-3deg", top: -12, left: "40%" }}
              />
              <blockquote>“{t.quote}”</blockquote>
              <figcaption className="hand">{t.who}</figcaption>
            </Reveal>
          ))}
        </div>
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
            <Reveal as="li" key={p.src} rotate={[-3, 2, -1, 3][i]} delay={i * 0.08} y={60}>
              <a className="polaroid" href={site.instagram} target="_blank" rel="noopener noreferrer" data-sfx-hover="kalimba">
                <span
                  className={`tape ${["tape--pink", "tape--blue", "tape--butter", "tape--pink"][i]}`}
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

export function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="container container--narrow">
        <SectionHead id="faq-title" eyebrow="Good questions" title="Before you reach out" />
        <div className="faq__list">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <details className="faq__item" name="faq">
                <summary>
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
      <div className="container footer__grid">
        <div>
          <a className="brand brand--light" href="#top">
            <span className="brand__text">
              <span className="brand__name">im psych out</span>
              <span className="brand__tag">your safe space to talk</span>
            </span>
          </a>
          <p className="footer__blurb">
            Online therapy with clinical psychologist Laraib Fatima Ahmed. Uncomplicating psychology, one gentle
            conversation at a time.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="footer__h">Explore</p>
          <a href="#about">About</a>
          <a href="#focus">How I help</a>
          <a href="#approach">Approach</a>
          <a href="#process">How it works</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div>
          <p className="footer__h">Connect</p>
          <a href="#book">Request a consultation</a>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </div>
      <div className="container footer__base">
        <p>© {new Date().getFullYear()} ImPsychOut. Not an emergency service.</p>
        <Doodle name="cat" className="footer__cat" />
      </div>
    </footer>
  );
}
