"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Doodle } from "./Doodles";
import { GumButton } from "./GumButton";

const line1 = "Stop navigating it alone.".split(" ");
const line2 = ["Let's", "make", "sense", "of", "it"];

const word = {
  hidden: { y: "110%", rotate: 4 },
  show: (i: number) => ({
    y: "0%",
    rotate: 0,
    transition: { delay: 0.15 + i * 0.07, type: "spring" as const, stiffness: 220, damping: 22 },
  }),
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Pointer parallax for the collage pieces.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const near = { x: useTransform(sx, (v) => v * 18), y: useTransform(sy, (v) => v * 14) };
  const far = { x: useTransform(sx, (v) => v * -10), y: useTransform(sy, (v) => v * -8) };

  // Scroll: the collage drifts up and the blob grows as the hero leaves.
  const collageY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const blobScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  let i = 0;
  return (
    <section className="hero" id="top" ref={ref} onPointerMove={onMove} aria-labelledby="hero-title">
      <motion.div className="hero__blob" style={{ scale: blobScale }} aria-hidden="true" />
      <div className="hero__grid-paper" aria-hidden="true" />

      <div className="hero__copy">
        <motion.p
          className="hand hero__hello"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
        >
          hi, welcome to ImPsychOut <Doodle name="sparkle" className="ico" />
        </motion.p>

        <h1 className="display hero__title" id="hero-title">
          <span className="hero__line">
            {line1.map((w) => (
              <span className="word-mask" key={w + i}>
                <motion.span className="word" custom={i++} variants={word} initial="hidden" animate="show">
                  {w}
                </motion.span>
              </span>
            ))}
          </span>
          <span className="hero__line hero__line--soft">
            {line2.map((w) => (
              <span className="word-mask" key={w + i}>
                <motion.span className="word" custom={i++} variants={word} initial="hidden" animate="show">
                  {w}
                </motion.span>
              </span>
            ))}
            <span className="word-mask">
              <motion.em className="word marked" custom={i++} variants={word} initial="hidden" animate="show">
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
                    transition={{ delay: 1.1, duration: 0.7, ease: "easeInOut" }}
                  />
                </svg>
              </motion.em>
            </span>
          </span>
        </h1>

        <motion.p
          className="lead"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Online therapy for teens, young adults and adults with clinical psychologist Laraib Fatima Ahmed.
          Psychology, uncomplicated: compassionate, evidence-based care for real minds living in a complex world.
        </motion.p>

        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
        >
          <GumButton href="#book" size="lg">Request a free consultation</GumButton>
          <GumButton href="#focus" size="lg" variant="paper">See how I can help</GumButton>
        </motion.div>

        <motion.ul
          className="hero__trust"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { delayChildren: 1.1, staggerChildren: 0.08 } } }}
        >
          {[
            { icon: "heart" as const, text: "Confidential online sessions" },
            { icon: "star" as const, text: "Evidence-based: CBT, DBT, ACT" },
            { icon: "flower" as const, text: "BPS Graduate Member" },
          ].map((t) => (
            <motion.li key={t.text} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
              <Doodle name={t.icon} />
              {t.text}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <motion.div className="hero__collage" style={{ y: collageY }} aria-hidden="true">
        <motion.figure
          className="polaroid hero__polaroid-back"
          style={far}
          initial={{ opacity: 0, rotate: -14, scale: 0.9 }}
          animate={{ opacity: 1, rotate: -8, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 120, damping: 16 }}
        >
          <span className="tape tape--blue" style={{ ["--r" as string]: "8deg", top: -14, left: "28%" }} />
          <Image src="/images/laraib-cafe.jpg" alt="" width={960} height={1280} sizes="(max-width: 860px) 40vw, 18vw" />
        </motion.figure>

        <motion.figure
          className="polaroid hero__polaroid"
          style={near}
          initial={{ opacity: 0, rotate: 10, y: 60 }}
          animate={{ opacity: 1, rotate: 3, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 110, damping: 15 }}
        >
          <span className="tape tape--pink" style={{ ["--r" as string]: "-6deg", top: -16, left: "34%" }} />
          <Image
            src="/images/laraib-portrait.jpg"
            alt=""
            width={960}
            height={1280}
            priority
            sizes="(max-width: 860px) 70vw, 30vw"
          />
          <figcaption className="hand">hi, I&apos;m Laraib ♡</figcaption>
        </motion.figure>

        <motion.div
          className="note hero__note"
          style={far}
          initial={{ opacity: 0, rotate: -12, y: 40 }}
          animate={{ opacity: 1, rotate: -4, y: 0 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 140, damping: 14 }}
        >
          <span className="tape tape--butter" style={{ ["--r" as string]: "5deg", top: -12, left: 22 }} />
          <p className="hand">a place to uncomplicate your thoughts &amp; heal at your own pace</p>
        </motion.div>

        {[
          { text: "Trauma-informed", cls: "sticker--blue", pos: { top: "4%", right: "6%" }, d: 1.1 },
          { text: "Safe & seen", cls: "sticker--pink", pos: { top: "48%", left: "2%" }, d: 1.2 },
          { text: "Emotion regulation", cls: "sticker--butter", pos: { bottom: "4%", right: "14%" }, d: 1.3 },
        ].map((s) => (
          <motion.span
            key={s.text}
            className={`sticker ${s.cls}`}
            style={s.pos}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.08, rotate: -4 }}
            transition={{ delay: s.d, type: "spring", stiffness: 380, damping: 14 }}
          >
            {s.text}
          </motion.span>
        ))}

        <Doodle name="star" className="doodle doodle--spin" style={{ top: "1%", left: "18%", width: "clamp(36px, 3vw, 64px)", color: "var(--butter)" }} />
        <Doodle name="cat" className="doodle doodle--float" style={{ bottom: "20%", right: "0%", width: "clamp(56px, 4.6vw, 96px)" }} />
        <Doodle name="sparkle" className="doodle doodle--twinkle" style={{ top: "26%", right: "2%", width: "clamp(30px, 2.4vw, 50px)", color: "var(--cornflower)" }} />
        <Doodle name="butterfly" className="doodle doodle--flutter hero__butterfly" style={{ top: "8%", left: "4%", width: "clamp(48px, 3.8vw, 80px)", color: "var(--sky-deep)" }} />
      </motion.div>

      <a className="hero__scroll hand" href="#story" aria-label="Scroll to the next section">
        scroll, gently
        <Doodle name="arrow" />
      </a>
    </section>
  );
}
