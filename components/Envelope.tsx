"use client";

import { motion } from "framer-motion";

// A testimonial as a handwritten note tucked in an envelope: as it scrolls into view the
// flap opens and the letter slides up out of it.
const ease = [0.22, 1, 0.36, 1] as const;

export function Envelope({ quote, who, index, greeting }: { quote: string; who: string; index: number; greeting: string }) {
  const tone = index % 2 ? "pink" : "sky";
  return (
    <motion.figure
      className={`envelope envelope--${tone}`}
      initial="closed"
      whileInView="open"
      viewport={{ once: true, margin: "0px 0px -120px 0px" }}
      style={{ rotate: index % 2 ? 1.2 : -1.4 }}
    >
      <div className="envelope__back" aria-hidden="true" />
      <motion.div
        className="envelope__letter"
        variants={{ closed: { y: "38%" }, open: { y: "0%", transition: { delay: 0.45 + index * 0.12, duration: 0.9, ease } } }}
      >
        <span className="envelope__stamp" aria-hidden="true">
          <svg viewBox="0 0 48 44">
            <path d="M24 40C13 31 4.5 24 5 14.5 5.4 7.8 11 4 16.2 5c3.6.7 6 3.3 7.8 6.6 1.9-3.4 4.6-6.2 8.5-6.8C38 4 43.6 8.6 43 15.4 42.2 24.5 33.8 31.4 24 40Z" fill="currentColor" />
          </svg>
        </span>
        <p className="envelope__to hand">{greeting}</p>
        <blockquote>{quote}</blockquote>
        <figcaption className="hand">{who}</figcaption>
      </motion.div>
      <div className="envelope__pocket" aria-hidden="true" />
      <motion.div
        className="envelope__flap"
        aria-hidden="true"
        variants={{ closed: { rotateX: 0 }, open: { rotateX: 180, transition: { delay: index * 0.12, duration: 0.6, ease } } }}
      />
    </motion.figure>
  );
}
