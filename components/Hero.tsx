"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Doodle } from "./Doodles";
import { GumButton } from "./GumButton";

const ease = [0.22, 1, 0.36, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.8, ease },
});
const fade = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: 0.9, ease },
});

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__blob" aria-hidden="true" />
      <div className="hero__grid-paper" aria-hidden="true" />

      <div className="hero__copy">
        <motion.p className="hand hero__hello" {...rise(0)}>
          hi, welcome to ImPsychOut <Doodle name="sparkle" className="ico" />
        </motion.p>

        <h1 className="display hero__title" id="hero-title">
          <motion.span className="hero__line" {...rise(0.08)}>
            Stop navigating it alone.
          </motion.span>
          <motion.span className="hero__line hero__line--soft" {...rise(0.18)}>
            Let&apos;s make sense of it{" "}
            <em className="marked">
              together.
              <svg className="marked__line" aria-hidden="true" viewBox="0 0 200 16" preserveAspectRatio="none">
                <motion.path
                  d="M4 11c40-6 90-8 140-6 18 1 34 2 52 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.9, duration: 0.9, ease }}
                />
              </svg>
            </em>
          </motion.span>
        </h1>

        <motion.p className="lead" {...rise(0.3)}>
          Online therapy for teens, young adults and adults with clinical psychologist Laraib Fatima Ahmed.
          Psychology, uncomplicated: compassionate, evidence-based care for real minds living in a complex world.
        </motion.p>

        <motion.div className="hero__ctas" {...rise(0.4)}>
          <GumButton href="#book" size="lg">Request a free consultation</GumButton>
          <GumButton href="#focus" size="lg" variant="paper">See how I can help</GumButton>
        </motion.div>

        <motion.ul className="hero__trust" {...rise(0.5)}>
          {[
            { icon: "heart" as const, text: "Confidential online sessions" },
            { icon: "star" as const, text: "Evidence-based: CBT, DBT, ACT" },
            { icon: "flower" as const, text: "BPS Graduate Member" },
          ].map((t) => (
            <li key={t.text}>
              <Doodle name={t.icon} />
              {t.text}
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.div className="hero__collage" aria-hidden="true" {...fade(0.2)}>
        <figure className="polaroid hero__polaroid">
          <span className="tape tape--pink" style={{ ["--r" as string]: "-6deg", top: -16, left: "38%" }} />
          <Image
            src="/images/laraib-portrait.jpg"
            alt=""
            width={960}
            height={781}
            priority
            sizes="(max-width: 860px) 80vw, 34vw"
          />
          <figcaption className="hand">hi, I&apos;m Laraib ♡</figcaption>
        </figure>

        <div className="note hero__note">
          <span className="tape tape--blue" style={{ ["--r" as string]: "5deg", top: -12, left: 22 }} />
          <p className="hand">a place to uncomplicate your thoughts &amp; heal at your own pace</p>
        </div>

        <span className="sticker sticker--blue" style={{ top: "6%", right: "4%" }}>Trauma-informed</span>
        <span className="sticker sticker--pink" style={{ top: "58%", left: "2%" }}>Safe &amp; seen</span>
        <span className="sticker sticker--butter" style={{ bottom: "8%", right: "8%" }}>Emotion regulation</span>

        <Doodle name="star" className="doodle" style={{ top: "4%", left: "14%", width: "clamp(36px, 3vw, 54px)", color: "var(--butter)" }} />
        <Doodle name="cat" className="doodle doodle--float" style={{ top: "34%", right: "-1%", width: "clamp(52px, 4vw, 76px)" }} />
        <Doodle name="sparkle" className="doodle" style={{ top: "30%", left: "0%", width: "clamp(26px, 2vw, 40px)", color: "var(--cornflower)" }} />
      </motion.div>
    </section>
  );
}
