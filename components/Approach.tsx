"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import type { Copy } from "@/lib/copy";
import { SectionHead } from "./Sections";
import { useSound } from "./SoundProvider";

// A literal file folder: coloured index dividers stick out of the top, the chosen sheet is
// pulled up out of the folder (with a paper sound), and the front cover keeps the rest tucked in.
const ease = [0.22, 1, 0.36, 1] as const;

export function Approach({ c }: { c: Copy["approach"] }) {
  const approaches = c.items;
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
          eyebrow={c.eyebrow}
          title={
            <>
              {c.title} <em>{c.titleEmphasis}</em>
            </>
          }
          sub={c.sub}
        />

        <div className="file">
          {/* back of the folder, with its own tab */}
          <div className="file__back" aria-hidden="true">
            <span className="file__back-tab hand">{c.folderTab}</span>
          </div>

          {/* index dividers */}
          <div className="file__tabs" role="tablist" aria-label="Therapy approaches">
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
                className="file__tab"
                style={{ ["--c" as string]: ap.color }}
                onClick={() => select(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                {ap.tab}
              </button>
            ))}
          </div>

          {/* paper edges peeking out, so it reads as a full folder */}
          <div className="file__stack" aria-hidden="true">
            <span />
            <span />
          </div>

          <div className="file__slot">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={a.id}
                className="file__sheet"
                role="tabpanel"
                id={`panel-${a.id}`}
                aria-labelledby={`tab-${a.id}`}
                style={{ ["--c" as string]: a.color }}
                initial={{ y: "62%", rotate: -1.5 }}
                animate={{ y: "0%", rotate: -0.6 }}
                exit={{ y: "62%", rotate: 1 }}
                transition={{ duration: 0.5, ease }}
              >
                <span className="file__clip" aria-hidden="true" />
                <p className="file__kicker">{a.name}</p>
                <h3>{a.title}</h3>
                <p className="file__body">{a.body}</p>
                <p className="file__note hand">{a.note}</p>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* front cover */}
          <div className="file__front" aria-hidden="true">
            <span className="file__label hand">{c.folderLabel}</span>
            <span className="file__label-sub">{c.folderHint}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
