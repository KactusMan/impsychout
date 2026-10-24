"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { GumButton } from "./GumButton";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

// Deterministic pseudo-random so the server and browser draw the same meadow.
// Integer-only hashing: Math.sin differs in its last digits between Node and browsers.
const rand = (i: number, n: number) => {
  let h = (Math.imul(i + 1, 374761393) + Math.imul(n + 1, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

type FlowerKind = "daisy" | "tulip" | "bell" | "forget";
const KINDS: FlowerKind[] = ["daisy", "forget", "tulip", "daisy", "bell", "forget", "daisy", "tulip"];

const FLOWERS = Array.from({ length: 34 }, (_, i) => {
  const x = 330 + (i / 33) * 940 + (rand(i, 1) - 0.5) * 34;
  // leave the path in the middle mostly clear
  const nearPath = Math.abs(x - 800) < 70;
  return {
    x,
    base: 860 + rand(i, 2) * 30,
    h: (nearPath ? 50 : 80) + rand(i, 3) * 90,
    lean: (rand(i, 4) - 0.5) * 30,
    kind: KINDS[i % KINDS.length],
    s: 0.85 + rand(i, 5) * 0.5,
  };
});

// Where each bird starts (small, far away in the sky) and where it settles (near the reader).
// face 1 = head on the left (flying left), -1 = flipped (flying right). Feet sit 22 units below the origin.
const BIRDS = [
  { from: [560, 170], via: [470, 420], to: [356, 690], s0: 0.3, s1: 1, face: 1 },
  { from: [900, 150], via: [660, 430], to: [452, 691], s0: 0.26, s1: 0.95, face: 1 },
  { from: [1040, 190], via: [720, 470], to: [556, 689], s0: 0.28, s1: 1.05, face: 1 },
  { from: [640, 160], via: [1040, 400], to: [1370, 615], s0: 0.24, s1: 0.9, face: -1 },
  { from: [1180, 170], via: [1180, 480], to: [1364, 756], s0: 0.28, s1: 0.95, face: -1 },
];

function Flower({ f, i }: { f: (typeof FLOWERS)[number]; i: number }) {
  const top = f.base - f.h;
  const tipX = f.x + f.lean;
  const stem = `M${f.x} ${f.base} C ${f.x} ${f.base - f.h * 0.4}, ${tipX - f.lean * 0.2} ${top + f.h * 0.3}, ${tipX} ${top}`;
  const leafY = f.base - f.h * 0.38;
  return (
    <g className="flower" data-i={i}>
      <path className="flower__stem" d={stem} fill="none" stroke="#6f9a86" strokeWidth="3" strokeLinecap="round" />
      <path
        className="flower__leaf"
        d={`M${f.x} ${leafY} c ${12 * f.s} -10 ${26 * f.s} -8 ${30 * f.s} -2 c -10 8 -22 10 -30 2 Z`}
        fill="#9cc0ae"
      />
      <g transform={`translate(${tipX} ${top}) scale(${f.s})`}>
      <g className="flower__head">
        {f.kind === "daisy" && (
          <>
            {Array.from({ length: 10 }, (_, k) => (
              <ellipse key={k} cx="0" cy="-11" rx="4.2" ry="10" fill="#fffdf8" stroke="#e7dfd3" strokeWidth=".8" transform={`rotate(${k * 36})`} />
            ))}
            <circle r="5.5" fill="#efb9c4" />
          </>
        )}
        {f.kind === "tulip" && (
          <path d="M-11 -2c-2-12 2-22 6-24 1 6 3 8 5 8s4-2 5-8c4 2 8 12 6 24-3 7-19 7-22 0Z" fill="#eaa6b6" stroke="#d98b9d" strokeWidth="1" />
        )}
        {f.kind === "bell" && (
          <>
            <path d="M0 0c-8 0-12 8-11 16 4-2 7 0 11 0s7-2 11 0c1-8-3-16-11-16Z" fill="#8eaedc" transform="rotate(20)" />
            <path d="M14 10c-6 0-9 6-8 12 3-1 5 0 8 0s5-1 8 0c1-6-2-12-8-12Z" fill="#a9c1e6" />
          </>
        )}
        {f.kind === "forget" && (
          <>
            {[
              [0, 0],
              [-12, 8],
              [11, 7],
            ].map(([dx, dy], k) => (
              <g key={k} transform={`translate(${dx} ${dy})`}>
                {Array.from({ length: 5 }, (_, p) => (
                  <circle key={p} cx="0" cy="-5" r="4.4" fill="#b9cfeb" transform={`rotate(${p * 72})`} />
                ))}
                <circle r="2.4" fill="#fffdf8" />
              </g>
            ))}
          </>
        )}
      </g>
      </g>
    </g>
  );
}

function Bird({ b, i }: { b: (typeof BIRDS)[number]; i: number }) {
  return (
    <g className="bird" data-i={i} transform={`translate(${b.from[0]} ${b.from[1]}) scale(${b.s0})`}>
      <g className="bird__body" transform={`scale(${b.face} 1)`}>
        {/* far wing */}
        <g className="bird__wing bird__wing--far">
          <path d="M-2 -6c-10-22-30-34-46-34 6 10 14 26 22 34 8 6 18 6 24 0Z" fill="#5f86c4" />
        </g>
        {/* tail */}
        <path d="M18 2l22-6-6 9 8 6-24-1Z" fill="#4c72ad" />
        {/* body and blush breast */}
        <path d="M-26 0c4-14 22-20 38-14 10 4 14 10 12 16-4 10-22 14-36 10-8-2-14-6-14-12Z" fill="#7fa3d6" />
        <path d="M-24 4c8 8 22 10 32 6-6 6-20 8-30 2Z" fill="#f4c7d0" />
        <path d="M-22 2c6 6 18 8 26 5" fill="none" stroke="#fffdf8" strokeWidth="2" strokeLinecap="round" opacity=".6" />
        {/* head, eye, beak */}
        <circle cx="-26" cy="-8" r="11" fill="#7fa3d6" />
        <circle cx="-30" cy="-10" r="2.2" fill="#1f2f57" />
        <circle cx="-30.8" cy="-10.8" r=".7" fill="#fff" />
        <path d="M-36 -8l-9 2 9 3Z" fill="#3d4a66" />
        {/* legs, only shown once perched */}
        <g className="bird__legs" stroke="#3d4a66" strokeWidth="1.8" strokeLinecap="round">
          <path d="M-8 12v10M-2 12v10M-11 22h6M-5 22h6" />
        </g>
        {/* near wing */}
        <g className="bird__wing bird__wing--near">
          <path d="M-6 -4c8-24 28-38 46-38-6 12-14 28-22 36-8 8-18 8-24 2Z" fill="#4c72ad" />
          <path d="M2 -10c8-10 18-18 28-22" fill="none" stroke="#7fa3d6" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
        </g>
      </g>
    </g>
  );
}

export function Storyteller() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const flowers = gsap.utils.toArray<SVGGElement>(".flower");
      const birds = gsap.utils.toArray<SVGGElement>(".bird");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".story__scene",
            start: "top 80%",
            end: "bottom 75%",
            scrub: 1.4,
          },
        });

        // Flowers sprout left to right across the meadow: stem draws, leaf unfurls, head opens.
        flowers.forEach((fl, i) => {
          const stem = fl.querySelector<SVGPathElement>(".flower__stem")!;
          const len = stem.getTotalLength();
          const at = 0.15 + (i / flowers.length) * 0.55 + rand(i, 9) * 0.08;
          gsap.set(stem, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(stem, { strokeDashoffset: 0, duration: 0.18, ease: "power1.out" }, at)
            .fromTo(fl.querySelector(".flower__leaf"), { scale: 0, transformOrigin: "0% 80%" }, { scale: 1, duration: 0.1, ease: "back.out(2)" }, at + 0.08)
            .fromTo(fl.querySelector(".flower__head"), { scale: 0, rotate: -40, transformOrigin: "50% 50%" }, { scale: 1, rotate: 0, duration: 0.14, ease: "back.out(1.6)" }, at + 0.14);
        });

        // Birds glide down through the scene toward the reader and settle on the fence and branch.
        birds.forEach((bird, i) => {
          const b = BIRDS[i];
          const start = 0.02 + i * 0.07;
          const span = 0.55;
          tl.fromTo(
            bird,
            { x: b.from[0], y: b.from[1], scale: b.s0 },
            {
              motionPath: { path: [{ x: b.from[0], y: b.from[1] }, { x: b.via[0], y: b.via[1] }, { x: b.to[0], y: b.to[1] }], curviness: 1.3 },
              scale: b.s1,
              duration: span,
              ease: "sine.inOut",
            },
            start
          );
        });
        tl.to({}, { duration: 0.12 }); // a moment of stillness at the end

        // Wings beat while flying and fold once a bird has landed.
        const spans = BIRDS.map((_, i) => 0.02 + i * 0.07 + 0.55);
        tl.eventCallback("onUpdate", () => {
          const t = tl.time();
          birds.forEach((bird, i) => bird.classList.toggle("is-perched", t >= spans[i] - 0.01));
        });
      });

      // Reduced motion: show the finished scene, no movement.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        birds.forEach((bird, i) => {
          const b = BIRDS[i];
          gsap.set(bird, { x: b.to[0], y: b.to[1], scale: b.s1 });
          bird.classList.add("is-perched");
        });
      });

      gsap.from(".story__copy > *", {
        y: 18,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: ".story__copy", start: "top 82%" },
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
        <GumButton href="#book" variant="paper">Start your chapter</GumButton>
      </div>

      <div className="story__scene">
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax slice"
          role="img"
          aria-label="A gentle illustrated meadow at dawn: a little cottage on blue hills, a path, a blossom tree, flowers growing and bluebirds landing on a fence"
        >
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fbf7ef" />
              <stop offset=".62" stopColor="#e7eef8" />
              <stop offset="1" stopColor="#dce7f5" />
            </linearGradient>
            <linearGradient id="meadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#cfe2d6" />
              <stop offset="1" stopColor="#b9d3c4" />
            </linearGradient>
          </defs>

          <rect width="1600" height="900" fill="url(#sky)" />

          {/* low dawn sun */}
          <circle cx="1130" cy="470" r="150" fill="#fbe9ec" opacity=".55" />
          <circle cx="1130" cy="470" r="92" fill="#f9dde3" />

          {/* clouds */}
          <g className="cloud cloud--a" fill="#fffdf8">
            <path d="M260 300c-26 0-40-18-30-36 8-14 30-18 44-10 8-24 38-34 62-22 14-18 50-18 64 6 24-4 44 12 40 34 18 4 26 14 22 28Z" opacity=".95" />
            <path d="M262 300h196c-4 6-12 8-22 8H286c-12 0-20-3-24-8Z" fill="#e3ebf6" />
          </g>
          <g className="cloud cloud--b" fill="#fffdf8">
            <path d="M1180 240c-20 0-30-14-22-28 6-10 22-14 34-8 6-18 30-26 48-16 12-14 40-14 50 4 18-2 34 10 30 26 14 4 20 12 16 22Z" opacity=".9" />
          </g>
          <g className="cloud cloud--c" fill="#fffdf8">
            <path d="M700 200c-14 0-22-10-16-20 4-8 16-10 24-6 4-12 22-18 34-10 8-10 28-10 36 4 12 0 22 8 20 18Z" opacity=".85" />
          </g>

          {/* far and mid hills */}
          <path d="M0 560C180 500 360 480 560 500s360 40 560 10 340-60 480-40V900H0Z" fill="#cddcf0" />
          <path d="M0 600c160-40 340-50 520-30 200 22 300 70 470 60 200-12 360-80 610-60V900H0Z" fill="#b6cbe8" />
          <g fill="none" stroke="#a7bfe3" strokeWidth="1.4" opacity=".8">
            <path d="M80 630c140-30 300-36 460-20" />
            <path d="M1040 640c160-14 320-40 480-40" />
          </g>

          {/* trees on the hills */}
          <g>
            <rect x="404" y="548" width="6" height="34" rx="3" fill="#6f8f86" />
            <circle cx="407" cy="538" r="24" fill="#9fbfb3" />
            <rect x="1336" y="562" width="6" height="30" rx="3" fill="#6f8f86" />
            <path d="M1339 500l26 66h-52Z" fill="#8fa9d6" />
            <rect x="1388" y="572" width="5" height="24" rx="2.5" fill="#6f8f86" />
            <path d="M1390 524l20 52h-40Z" fill="#a3bde3" />
          </g>

          {/* cottage */}
          <g transform="translate(748 520)">
            <path d="M6 70V32L40 6l34 26v38Z" fill="#fffdf8" stroke="#9aa8c0" strokeWidth="2" strokeLinejoin="round" />
            <path d="M-4 36 40 0l44 36" fill="none" stroke="#d98b9d" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="31" y="44" width="18" height="26" rx="9" fill="#9fb3d4" />
            <rect x="12" y="38" width="13" height="13" rx="2" fill="#fdf1dc" />
            <rect x="56" y="38" width="13" height="13" rx="2" fill="#fdf1dc" />
            <rect x="58" y="4" width="9" height="20" fill="#b6cbe8" />
            <g className="smoke" fill="none" stroke="#fffdf8" strokeWidth="5" strokeLinecap="round">
              <path d="M62 -2c-6-8 6-12 0-20s6-12 2-18" />
            </g>
          </g>

          {/* sage hill and the winding path */}
          <path d="M0 690c200-50 420-70 640-56 160 10 240 30 420 26 200-4 360-50 540-60V900H0Z" fill="#c4dccf" />
          <path d="M786 590c-4 30 30 48 20 80-12 40-90 70-110 120-8 22-6 70-6 110h220c-4-40-6-80 6-110 20-50 80-90 64-130-12-30-60-40-56-70Z" fill="#f4ede1" />
          <path d="M796 600c-2 26 26 44 16 74M830 610c4 24 40 40 30 70" fill="none" stroke="#e6dccb" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />

          {/* foreground meadow */}
          <path d="M0 760c220-30 460-40 700-26 260 16 520 10 900-30V900H0Z" fill="url(#meadow)" />
          <g fill="none" stroke="#9cc0ae" strokeWidth="2" strokeLinecap="round" opacity=".9">
            {Array.from({ length: 40 }, (_, i) => {
              const x = 40 + i * 39 + rand(i, 7) * 14;
              const y = 820 + rand(i, 8) * 70;
              return <path key={i} d={`M${x} ${y}l-4-12M${x + 5} ${y}l2-14M${x + 10} ${y}l5-10`} />;
            })}
          </g>

          {/* fence on the left */}
          <g stroke="#9aa8c0" strokeWidth="1.6" strokeLinejoin="round">
            {[300, 400, 500, 600].map((x) => (
              <path key={x} d={`M${x} 704h14v150h-14Z`} fill="#fbf4e8" />
            ))}
            <rect x="270" y="712" width="372" height="10" rx="3" fill="#f3e9d8" />
            <rect x="270" y="760" width="372" height="10" rx="3" fill="#f3e9d8" />
          </g>

          {/* blossom tree on the right */}
          <g className="blossom">
            <path d="M1300 900c-10-90-4-170 20-240M1312 720c-40-30-90-40-140-30M1318 680c30-40 70-60 120-64M1306 780c40-10 80-4 110 16" fill="none" stroke="#8f8089" strokeWidth="12" strokeLinecap="round" />
            {[
              [1180, 680, 46], [1150, 640, 34], [1230, 640, 40], [1290, 600, 52], [1360, 590, 44], [1430, 610, 46],
              [1470, 650, 34], [1250, 690, 30], [1420, 790, 40], [1460, 760, 32], [1380, 640, 30], [1330, 650, 26],
            ].map(([cx, cy, r], k) => (
              <circle key={k} cx={cx} cy={cy} r={r} fill={k % 3 === 0 ? "#f6d1d9" : k % 3 === 1 ? "#f0c1cd" : "#f9dfe5"} />
            ))}
            {/* little five-petal blossoms dotted over the canopy */}
            {Array.from({ length: 34 }, (_, k) => {
              const cx = 1150 + rand(k, 11) * 340;
              const cy = 580 + rand(k, 12) * 230;
              const inCanopy = cy < 700 || cx > 1390;
              if (!inCanopy) return null;
              return (
                <g key={`b${k}`} transform={`translate(${cx} ${cy}) rotate(${rand(k, 13) * 72}) scale(${0.7 + rand(k, 14) * 0.6})`}>
                  {Array.from({ length: 5 }, (_, p) => (
                    <ellipse key={p} cx="0" cy="-4.5" rx="3.4" ry="4.6" fill={k % 2 ? "#fffafb" : "#fbe3e8"} transform={`rotate(${p * 72})`} />
                  ))}
                  <circle r="1.8" fill="#d98b9d" />
                </g>
              );
            })}
            {[0, 1, 2, 3, 4].map((k) => (
              <ellipse key={k} className={`petal petal--${k}`} cx={1200 + k * 60} cy={720} rx="4" ry="2.6" fill="#f1bccb" />
            ))}
          </g>

          {/* the meadow flowers that grow as you scroll */}
          <g className="flowers">
            {FLOWERS.map((f, i) => (
              <Flower key={i} f={f} i={i} />
            ))}
          </g>

          {/* bluebirds */}
          <g className="birds">
            {BIRDS.map((b, i) => (
              <Bird key={i} b={b} i={i} />
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
}
