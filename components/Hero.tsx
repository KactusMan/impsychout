"use client";

import Image from "next/image";
import { animate, motion, useMotionValue } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useSound } from "./SoundProvider";
import type { Copy } from "@/lib/copy";
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

// Shared between the collage and its pieces: a counter that sends every piece home when it
// changes, and a callback so the collage knows something has been moved.
const Tidy = createContext<{ round: number; moved: () => void }>({ round: 0, moved: () => {} });

// A collage piece you can pick up and move around, but only inside the collage box.
function Piece({
  box,
  className,
  style,
  rest = 0,
  z,
  children,
}: {
  box: RefObject<HTMLDivElement | null>;
  className: string;
  style?: CSSProperties;
  rest?: number;
  z: number;
  children: ReactNode;
}) {
  const { play } = useSound();
  const { round, moved } = useContext(Tidy);
  const [lift, setLift] = useState(z);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    if (round === 0) return;
    const opts = { type: "spring" as const, stiffness: 160, damping: 22 };
    const a = animate(x, 0, opts);
    const b = animate(y, 0, opts);
    setLift(z);
    return () => {
      a.stop();
      b.stop();
    };
  }, [round, x, y, z]);
  return (
    <motion.div
      className={`piece ${className}`}
      style={{ ...style, x, y, rotate: rest, zIndex: lift }}
      drag
      dragConstraints={box}
      dragElastic={0.08}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, rotate: rest * 0.4, cursor: "grabbing" }}
      onDragStart={() => {
        setLift(20); // whatever you pick up comes to the top of the pile
        play("pick");
        moved();
      }}
      onDragEnd={() => {
        setLift(z + 10);
        play("place");
      }}
    >
      {children}
    </motion.div>
  );
}

export function Hero({ c }: { c: Copy["hero"] }) {
  const box = useRef<HTMLDivElement>(null);
  const [round, setRound] = useState(0);
  const [messy, setMessy] = useState(false);
  const { play } = useSound();
  const tidyUp = () => {
    setRound((r) => r + 1);
    setMessy(false);
    play("place");
  };
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__blob" aria-hidden="true" />
      <div className="hero__grid-paper" aria-hidden="true" />

      <div className="hero__copy">
        <motion.p className="hand hero__hello" {...rise(0)}>
          {c.hello} <Doodle name="sparkle" className="ico" />
        </motion.p>

        <h1 className="display hero__title" id="hero-title">
          <motion.span className="hero__line" {...rise(0.08)}>
            {c.line1}
          </motion.span>
          <motion.span className="hero__line hero__line--soft" {...rise(0.18)}>
            {c.line2}{" "}
            <em className="marked">
              {c.underlined}
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
          {c.lead}
        </motion.p>

        <motion.div className="hero__ctas" {...rise(0.4)}>
          <GumButton href="#book" size="lg">{c.primaryButton}</GumButton>
          <GumButton href="#focus" size="lg" variant="paper">{c.secondaryButton}</GumButton>
        </motion.div>

        <motion.ul className="hero__trust" {...rise(0.5)}>
          {c.trust.map((text, i) => (
            <li key={text}>
              <Doodle name={(["heart", "star", "flower"] as const)[i % 3]} />
              {text}
            </li>
          ))}
        </motion.ul>
      </div>

      <Tidy.Provider value={{ round, moved: () => setMessy(true) }}>
      <motion.div className="hero__collage" ref={box} {...fade(0.2)}>
        <div className="hero__tidy">
          {messy ? (
            <button type="button" className="hero__reset" onClick={tidyUp}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {c.tidyButton}
            </button>
          ) : (
            <p className="hero__drag-hint hand" aria-hidden="true">
              {c.dragHint}
            </p>
          )}
        </div>
        <Piece box={box} className="hero__polaroid" rest={2.5} z={3}>
          <figure className="polaroid">
            <span className="tape tape--pink" style={{ ["--r" as string]: "-6deg", top: -16, left: "38%" }} />
            <Image
              src="/images/laraib-portrait.jpg"
              alt="Laraib Fatima Ahmed, clinical psychologist"
              width={960}
              height={781}
              priority
              draggable={false}
              sizes="(max-width: 860px) 80vw, 34vw"
            />
            <figcaption className="hand">{c.photoCaption}</figcaption>
          </figure>
        </Piece>

        <Piece box={box} className="hero__note" rest={-4} z={4}>
          <div className="note">
            <span className="tape tape--blue" style={{ ["--r" as string]: "5deg", top: -12, left: 22 }} />
            <p className="hand">{c.note}</p>
          </div>
        </Piece>

        <Piece box={box} className="hero__sticker" style={{ top: "6%", right: "4%" }} rest={5} z={6}>
          <span className="sticker sticker--blue">{c.stickers[0]}</span>
        </Piece>
        <Piece box={box} className="hero__sticker" style={{ top: "58%", left: "2%" }} rest={-6} z={6}>
          <span className="sticker sticker--pink">{c.stickers[1]}</span>
        </Piece>
        <Piece box={box} className="hero__sticker" style={{ bottom: "8%", right: "8%" }} rest={3} z={6}>
          <span className="sticker sticker--butter">{c.stickers[2]}</span>
        </Piece>

        <Piece box={box} className="hero__doodle" style={{ top: "4%", left: "14%", width: "clamp(36px, 3vw, 54px)" }} z={5}>
          <Doodle name="star" style={{ color: "var(--butter)" }} />
        </Piece>
        <Piece box={box} className="hero__doodle" style={{ top: "34%", right: "-1%", width: "clamp(52px, 4vw, 76px)" }} z={5}>
          <Doodle name="cat" className="doodle--float" />
        </Piece>
        <Piece box={box} className="hero__doodle" style={{ top: "30%", left: "0%", width: "clamp(26px, 2vw, 40px)" }} z={5}>
          <Doodle name="sparkle" style={{ color: "var(--cornflower)" }} />
        </Piece>
      </motion.div>
      </Tidy.Provider>
    </section>
  );
}
