"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { GumButton } from "./GumButton";
import { useSound } from "./SoundProvider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// A flock perched over the clouds. Deterministic so server and client render the same markup.
const BIRDS = Array.from({ length: 26 }, (_, i) => {
  const r = (n: number) => {
    const s = Math.sin(i * 97.13 + n * 13.7) * 43758.5453;
    return s - Math.floor(s);
  };
  return {
    x: 1010 + r(1) * 420,
    y: 70 + r(2) * 170 + (i % 3) * 8,
    s: 0.7 + r(3) * 0.75,
    flyX: 260 + r(4) * 700,
    flyY: -(260 + r(5) * 520),
    delay: r(6) * 0.45,
    flap: 0.28 + r(7) * 0.22,
  };
});

export function Storyteller() {
  const root = useRef<HTMLElement>(null);
  const { play } = useSound();
  const flown = useRef(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Layers drift at different speeds for depth.
        gsap.utils.toArray<SVGGElement>("[data-depth]").forEach((layer) => {
          const depth = Number(layer.dataset.depth);
          gsap.fromTo(
            layer,
            { y: depth * 60 },
            {
              y: depth * -40,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });

        // The flock lifts off as the scene scrolls into view, each bird on its own path.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".story__scene",
            start: "top 65%",
            end: "center 15%",
            scrub: 1.2,
            onUpdate: (self) => {
              if (self.progress > 0.08 && !flown.current) {
                flown.current = true;
                play("wings", { volume: 0.35, maxSeconds: 1.8 });
              } else if (self.progress < 0.02) {
                flown.current = false;
              }
            },
          },
        });
        gsap.utils.toArray<SVGGElement>(".bird").forEach((bird, i) => {
          const b = BIRDS[i];
          tl.to(
            bird,
            {
              x: b.flyX,
              y: b.flyY,
              scale: b.s * 0.45,
              opacity: 0,
              ease: "power1.in",
              duration: 1,
            },
            b.delay
          );
        });

        // A slow breeze for the trees and plant.
        gsap.to(".sway", {
          rotation: 2.2,
          transformOrigin: "50% 100%",
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: 0.6,
        });
        gsap.to(".smoke circle", {
          y: -26,
          opacity: 0,
          scale: 1.6,
          transformOrigin: "50% 50%",
          duration: 3,
          ease: "sine.out",
          repeat: -1,
          stagger: 1,
        });
      });

      // Copy fades up regardless; motion-sensitive visitors just get a shorter fade.
      gsap.from(".story__copy > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".story__copy", start: "top 80%" },
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="story" id="story" ref={root} aria-labelledby="story-title">
      <div className="story__copy">
        <h2 className="display h2" id="story-title">
          Every mind has a <em>story</em>.
        </h2>
        <p>
          Therapy isn&apos;t about being broken. It&apos;s about understanding how your mind navigates the world.
          Together, we can help the heavy things lift, one gentle step at a time.
        </p>
        <GumButton href="#book" variant="ink">Start your chapter</GumButton>
      </div>

      <div className="story__scene">
        <svg viewBox="0 0 1600 820" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Illustrated landscape of soft hills, a little cottage, trees and a flock of birds flying away">
          <defs>
            <pattern id="p-dots-pink" width="11" height="11" patternUnits="userSpaceOnUse">
              <rect width="11" height="11" fill="#fbe6ea" />
              <circle cx="5.5" cy="5.5" r="1.7" fill="#e79aab" />
            </pattern>
            <pattern id="p-dots-butter" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#f3cf6a" />
              <circle cx="5" cy="5" r="2.6" fill="#c99a2e" />
            </pattern>
            <pattern id="p-dots-leaf" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="#b9d29e" />
              <circle cx="8" cy="8" r="3.4" fill="#e4efd6" />
            </pattern>
            <pattern id="p-lines-navy" width="140" height="16" patternUnits="userSpaceOnUse">
              <rect width="140" height="16" fill="#1f2f57" />
              <path d="M0 8c18-6 34-6 52 0s34 6 52 0 26-5 36-2" fill="none" stroke="#f5efe3" strokeWidth="1.3" opacity=".75" />
            </pattern>
            <pattern id="p-lines-sky" width="120" height="14" patternUnits="userSpaceOnUse">
              <rect width="120" height="14" fill="#dfeaf7" />
              <path d="M0 7c15-5 30-5 45 0s30 5 45 0 22-4 30-1" fill="none" stroke="#b9cfeb" strokeWidth="1.4" />
            </pattern>
            <pattern id="p-lines-water" width="90" height="12" patternUnits="userSpaceOnUse">
              <rect width="90" height="12" fill="#cfe0f3" />
              <path d="M0 6c11-4 22-4 33 0s22 4 33 0 16-3 24-1" fill="none" stroke="#fff" strokeWidth="1.4" opacity=".9" />
            </pattern>
          </defs>

          {/* clouds */}
          <g data-depth="1.4">
            <path d="M330 420c-40-6-60-40-40-70 20-30 70-30 92-12 10-46 70-70 116-46 30-60 120-70 170-24 40-40 120-36 150 16 50-30 130-6 140 50 60-8 110 30 104 80Z" fill="url(#p-lines-sky)" />
            <path d="M900 330c-30-40 0-96 58-96 18-56 100-80 150-40 40-44 140-40 170 14 60-12 120 30 116 90 50 6 80 46 66 82H930c-30 0-40-30-30-50Z" fill="url(#p-lines-sky)" />
          </g>

          {/* birds */}
          <g className="flock">
            {BIRDS.map((b, i) => (
              <g key={i} className="bird" transform={`translate(${b.x} ${b.y}) scale(${b.s})`}>
                <g className="bird__wings" style={{ animationDuration: `${b.flap}s`, animationDelay: `${-b.delay}s` }}>
                  <path d="M-14 0c4-6 9-8 14-2 5-6 10-4 14 2" fill="none" stroke="#1f2f57" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
            ))}
          </g>

          {/* back hills */}
          <g data-depth="0.9">
            <path d="M0 360c80-30 180-34 260-10 90 26 180 40 300 30v300H0Z" fill="url(#p-dots-pink)" />
            <path d="M880 470c120-60 260-90 420-70 120 14 220 0 300-30v330H880Z" fill="url(#p-dots-butter)" />
          </g>

          {/* navy striped hill with the cottage */}
          <g data-depth="0.6">
            <path d="M120 520c60-90 200-120 330-118 130 2 200-34 320-40 150-8 250 40 390 30 60-4 80 40 30 76-60 44-200 64-380 72-240 10-480 22-690-20Z" fill="url(#p-lines-navy)" />
            <g transform="translate(720 300)">
              <path d="M8 72V34L40 8l32 26v38Z" fill="#fbf7ef" stroke="#1f2f57" strokeWidth="3" strokeLinejoin="round" />
              <path d="M0 38 40 2l40 36" fill="none" stroke="#d9798d" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="31" y="46" width="18" height="26" rx="8" fill="#f7df8f" stroke="#1f2f57" strokeWidth="2.6" />
              <path d="M40 26c-3-4-9-1-6 4l6 5 6-5c3-5-3-8-6-4Z" fill="#d9798d" />
              <rect x="56" y="6" width="9" height="20" fill="#7fa3d6" stroke="#1f2f57" strokeWidth="2.4" />
              <g className="smoke">
                <circle cx="60" cy="0" r="5" fill="#fff" />
                <circle cx="62" cy="-8" r="6" fill="#fff" />
                <circle cx="58" cy="-16" r="7" fill="#fff" />
              </g>
            </g>
          </g>

          {/* the fern on the left */}
          <g data-depth="0.45">
            <g className="sway" transform="translate(420 300)">
              <path d="M40 260C38 190 42 110 46 30" fill="none" stroke="#7c9b62" strokeWidth="7" strokeLinecap="round" />
              {[0, 1, 2, 3, 4].map((k) => (
                <g key={k}>
                  <path d={`M44 ${200 - k * 38}c-30-6-56 4-66 26 26 6 50-4 66-26Z`} fill="#b9d29e" stroke="#7c9b62" strokeWidth="2.4" />
                  <path d={`M44 ${186 - k * 38}c30-10 56-2 68 18-26 8-50 2-68-18Z`} fill="#b9d29e" stroke="#7c9b62" strokeWidth="2.4" />
                </g>
              ))}
              <path d="M46 34c-14-20-6-40 6-44 10 14 6 34-6 44Z" fill="#b9d29e" stroke="#7c9b62" strokeWidth="2.4" />
            </g>
          </g>

          {/* water */}
          <g data-depth="0.35">
            <path d="M230 600c100-40 260-50 420-30 160 20 300 12 460-20 80-16 160-4 170 30v110H230Z" fill="url(#p-lines-water)" />
          </g>

          {/* foreground */}
          <g data-depth="0.15">
            <path d="M0 610c120-20 260 6 380 50 120 44 200 60 260 160H0Z" fill="url(#p-dots-pink)" />
            <path d="M640 690c140-60 330-90 520-70 180 18 300-10 440-40v240H640Z" fill="url(#p-dots-leaf)" />
            <path d="M1080 760c120-40 300-60 520-50v110h-520Z" fill="url(#p-dots-butter)" />
            <path d="M300 700c20-26 70-30 92-6 14 16 4 44-24 50-34 8-84-14-68-44Z" fill="#b9d29e" />
          </g>

          {/* the big pink tree */}
          <g data-depth="0.1">
            <g className="sway" transform="translate(1080 360)">
              <path d="M150 80c40-50 120-60 150-10 40 0 70 40 50 80 40 20 40 80 0 100 10 50-40 90-90 70-30 40-100 40-130 0-50 20-110-10-110-60-50-10-60-70-20-100-10-50 40-90 90-70 10-20 30-20 60-10Z" fill="#f4b8c4" stroke="#1f2f57" strokeWidth="3" strokeLinejoin="round" />
              <path d="M180 400V200M180 300l-60-60M180 260l56-56M180 210l-36-46M180 340l50-36" fill="none" stroke="#fbf7ef" strokeWidth="9" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </div>
    </section>
  );
}
