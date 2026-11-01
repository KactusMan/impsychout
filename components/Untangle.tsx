"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { GumButton } from "./GumButton";
import { useSound } from "./SoundProvider";
import type { Copy } from "@/lib/copy";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// "Untangling it, together": while the section holds still, a tangled thread of thought slowly
// smooths into a calm line as you scroll. Each worried thought pinned along it flips over to a
// kinder reframe as the thread reaches it, with a soft marimba note that rises each time.

// The thread lives in a 1000 x 300 box. Same number of points in both states, so we can blend.
const N = 72;
const W = 1000;
const H = 300;
const rnd = (i: number, k: number) => {
  let h = (Math.imul(i + 1, 374761393) + Math.imul(k + 1, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const TANGLED = Array.from({ length: N }, (_, i) => {
  const t = i / (N - 1);
  const loop = 34 + 46 * rnd(i, 1); // loops of different sizes, like a scribble
  const a = i * 1.85 + rnd(i, 2) * 0.8;
  return {
    x: 30 + t * (W - 60) + Math.cos(a) * loop * (0.5 + 0.5 * Math.sin(t * Math.PI)),
    y: H / 2 + Math.sin(a) * loop * 1.25 + (rnd(i, 3) - 0.5) * 40,
  };
});
const CALM = Array.from({ length: N }, (_, i) => {
  const t = i / (N - 1);
  return { x: 30 + t * (W - 60), y: H / 2 + Math.sin(t * Math.PI * 3) * 26 };
});

// Smooth curve through points (Catmull-Rom to cubic Bezier).
function toPath(pts: { x: number; y: number }[]) {
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const blend = (u: number) => {
  const e = ease(u);
  return TANGLED.map((p, i) => ({ x: p.x + (CALM[i].x - p.x) * e, y: p.y + (CALM[i].y - p.y) * e }));
};

export function Untangle({ c }: { c: Copy["untangle"] }) {
  const root = useRef<HTMLElement>(null);
  const thread = useRef<SVGPathElement>(null);
  const shadow = useRef<SVGPathElement>(null);
  const { play } = useSound();

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".thought");
      const flipped = cards.map(() => false);
      const ball = root.current!.querySelector<SVGGElement>(".untangle__ball")!;
      const meter = root.current!.querySelector<HTMLElement>(".untangle__meter span")!;

      const render = (u: number) => {
        const d = toPath(blend(u));
        thread.current!.setAttribute("d", d);
        shadow.current!.setAttribute("d", d);
        // the ball of yarn winds up as the thread calms down
        ball.style.transform = `scale(${0.35 + 0.65 * u}) rotate(${u * 540}deg)`;
        meter.style.transform = `scaleX(${u})`;
        cards.forEach((c, i) => {
          const on = u > (i + 1) / (cards.length + 1);
          if (on !== flipped[i]) {
            flipped[i] = on;
            c.classList.toggle("is-reframed", on);
            if (on) play("marimba");
          }
        });
      };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        render(0);
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "+=170%",
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => render(Math.min(1, Math.max(0, (self.progress - 0.08) / 0.8))),
        });
        return () => st.kill();
      });
      mm.add("(prefers-reduced-motion: reduce)", () => render(1));

      gsap.from(".untangle__copy > *", {
        y: 18,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="untangle section--wash" id="story" ref={root} aria-labelledby="untangle-title">
      <div className="untangle__stage container">
        <div className="untangle__copy">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="display h2" id="untangle-title">
            {c.title} <em>{c.titleEmphasis}</em>.
          </h2>
          <p>
            {c.body}
          </p>
        </div>

        <div className="untangle__board">
          <svg className="untangle__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <path ref={shadow} className="untangle__shadow" d={toPath(TANGLED)} />
            <path ref={thread} className="untangle__thread" d={toPath(TANGLED)} />
          </svg>
          <svg className="untangle__yarn" viewBox="0 0 80 80" aria-hidden="true">
            <g className="untangle__ball">
              <circle cx="40" cy="40" r="30" fill="var(--pink)" stroke="var(--ink)" strokeWidth="2.6" />
              <path d="M16 30c14 6 34 6 48 0M12 42c18 8 38 8 56 0M18 54c14 6 30 6 44 0M30 12c-6 14-6 40 2 56M48 12c8 16 8 40-2 56" fill="none" stroke="var(--pink-deep)" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>

          <ol className="untangle__thoughts">
            {c.thoughts.map((t, i) => (
              <li key={t.worry} className={`thought thought--${i}`}>
                <div className="thought__card">
                  <p className="thought__face thought__face--worry">
                    <span className="thought__label">{c.loopLabel}</span>
                    <span className="hand">{t.worry}</span>
                  </p>
                  <p className="thought__face thought__face--reframe">
                    <span className="thought__label">{c.reframeLabel}</span>
                    <span className="hand">{t.reframe}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="untangle__foot">
          <div className="untangle__meter" aria-hidden="true">
            <span />
          </div>
          <GumButton href="#book" variant="paper">{c.button}</GumButton>
        </div>
      </div>
    </section>
  );
}
