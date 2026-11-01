"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Copy } from "@/lib/copy";
import { Doodle } from "./Doodles";
import { SectionHead } from "./Sections";
import { useSound } from "./SoundProvider";

const ICONS = ["plane", "sun", "flower", "heart"] as const;
const TONES = ["paper", "sky", "pink", "butter"] as const;

// A carousel built on native scroll-snap: swipe on touch, drag with a mouse,
// arrow buttons, keyboard arrows, and dots that follow along.
export function Process({ c }: { c: Copy["process"] }) {
  const steps = c.steps;
  const track = useRef<HTMLOListElement>(null);
  const [index, setIndex] = useState(0);
  const { play } = useSound();

  const cards = () => Array.from(track.current?.children ?? []) as HTMLElement[];

  const goTo = useCallback((i: number) => {
    const list = cards();
    const n = Math.max(0, Math.min(list.length - 1, i));
    const el = list[n];
    if (!el || !track.current) return;
    track.current.scrollTo({ left: el.offsetLeft - track.current.offsetLeft - (track.current.clientWidth - el.clientWidth) / 2, behavior: "smooth" });
  }, []);

  // Which card is centred.
  useEffect(() => {
    const t = track.current!;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = t.scrollLeft + t.clientWidth / 2;
        let best = 0;
        let bestD = Infinity;
        cards().forEach((c, i) => {
          const d = Math.abs(c.offsetLeft - t.offsetLeft + c.clientWidth / 2 - mid);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        setIndex((prev) => {
          if (prev !== best) play("slide");
          return best;
        });
      });
    };
    t.addEventListener("scroll", onScroll, { passive: true });
    return () => t.removeEventListener("scroll", onScroll);
  }, [play]);

  // Drag to scroll with a mouse (touch already scrolls natively).
  useEffect(() => {
    const t = track.current!;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = t.scrollLeft;
      t.classList.add("is-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      t.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      t.classList.remove("is-dragging");
    };
    const onClick = (e: MouseEvent) => {
      if (moved) e.preventDefault();
    };
    t.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    t.addEventListener("click", onClick, true);
    return () => {
      t.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      t.removeEventListener("click", onClick, true);
    };
  }, []);

  return (
    <section className="process section--wash" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead
          id="process-title"
          eyebrow={c.eyebrow}
          title={c.title}
          sub={c.sub}
        />
      </div>

      <div
        className="carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Four steps to starting therapy"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(index + 1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(index - 1);
          }
        }}
      >
        <ol className="carousel__track" ref={track} tabIndex={0} aria-label="Steps, use the arrow keys to move between them">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className={`step-card step-card--${TONES[i]}${i === index ? " is-current" : ""}`}
              aria-roledescription="slide"
              aria-label={`Step ${i + 1} of ${steps.length}`}
            >
              <span className="step-card__pin" aria-hidden="true" />
              <div className="step-card__top">
                <span className="step-card__num">0{i + 1}</span>
                <Doodle name={ICONS[i]} className="step-card__ico" />
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {i < steps.length - 1 ? (
                <span className="step-card__next hand" aria-hidden="true">
                  {c.between}
                </span>
              ) : (
                <a className="step-card__cta" href="#book" data-sfx-hover="tick">
                  {c.lastLink}
                </a>
              )}
            </li>
          ))}
        </ol>

        <div className="carousel__controls container">
          <button className="carousel__btn" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous step">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="carousel__dots" role="group" aria-label="Choose a step">
            {steps.map((s, i) => (
              <button
                key={s.title}
                className={`carousel__dot${i === index ? " is-on" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to step ${i + 1}: ${s.title}`}
                aria-current={i === index ? "step" : undefined}
              >
                <span className="hand">{i + 1}</span>
              </button>
            ))}
          </div>
          <button className="carousel__btn" onClick={() => goTo(index + 1)} disabled={index === steps.length - 1} aria-label="Next step">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
