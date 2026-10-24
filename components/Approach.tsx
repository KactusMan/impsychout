"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { approaches } from "@/lib/content";
import { SectionHead } from "./Sections";
import { useSound } from "./SoundProvider";

export function Approach() {
  const [current, setCurrent] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { play } = useSound();
  const a = approaches[current];

  const select = (i: number, focus = false) => {
    if (i === current) return;
    setCurrent(i);
    play("paper");
    if (focus) tabs.current[i]?.focus();
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = approaches.length;
    const next = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (next !== undefined) {
      e.preventDefault();
      select(next, true);
    }
  };

  return (
    <section className="approach section--grid" id="approach" aria-labelledby="approach-title">
      <div className="container">
        <SectionHead
          id="approach-title"
          eyebrow="How I work"
          title={
            <>
              Frameworks, <em>uncomplicated</em>
            </>
          }
          sub="Therapeutic science explained in clear, friendly language. No cold clinical jargon or distant acronyms."
        />

        <div className="folders">
          <div className="folders__tabs" role="tablist" aria-label="Therapy approaches">
            {approaches.map((ap, i) => (
              <button
                key={ap.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`tab-${ap.id}`}
                aria-controls={`panel-${ap.id}`}
                aria-selected={i === current}
                tabIndex={i === current ? 0 : -1}
                style={{ ["--c" as string]: ap.color }}
                onClick={() => select(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                {ap.tab}
              </button>
            ))}
          </div>

          <div className="folders__body" style={{ ["--c" as string]: a.color }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={a.id}
                className="folder"
                role="tabpanel"
                id={`panel-${a.id}`}
                aria-labelledby={`tab-${a.id}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div>
                  <p className="folder__kicker">{a.name}</p>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </div>
                <motion.div
                  className="folder__note hand"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {a.note}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
