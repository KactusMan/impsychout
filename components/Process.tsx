"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { steps } from "@/lib/content";
import { SectionHead } from "./Sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The dashed thread draws itself as you scroll, and each note gets pinned as the thread reaches it.
        const path = root.current?.querySelector<SVGPathElement>(".process__thread path");
        if (path) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: `${len}`, strokeDashoffset: len });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: ".steps", start: "top 75%", end: "bottom 60%", scrub: 1 },
          });
        }
        gsap.utils.toArray<HTMLElement>(".step").forEach((step, i) => {
          gsap.from(step, {
            y: 70,
            rotation: i % 2 ? 6 : -6,
            opacity: 0,
            duration: 0.9,
            ease: "back.out(1.6)",
            scrollTrigger: { trigger: step, start: "top 88%" },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="process" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead
          id="process-title"
          eyebrow="What to expect"
          title={
            <>
              Starting therapy shouldn&apos;t feel <span className="hl">scary</span>.
            </>
          }
          sub="Here's the gentle, four-step path from first hello to steady growth."
        />
        <div className="process__wrap">
          <svg className="process__thread" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M20 120C140 20 240 180 360 100S560 20 640 110 860 190 940 90 1120 40 1180 120"
              fill="none"
              stroke="var(--cornflower)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <ol className="steps">
            {steps.map((s, i) => (
              <li className={`step${i % 2 ? " step--alt" : ""}`} key={s.title} style={{ ["--tilt" as string]: `${[-2, 1.5, -1, 2][i]}deg` }}>
                <span className="step__num">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
