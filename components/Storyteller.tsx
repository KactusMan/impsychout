"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { GumButton } from "./GumButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// All positions are percentages of the painted meadow (1776 x 896), measured from the artwork.
// Birds glide down from above the section towards the viewer and settle on the fence,
// a picket, the cottage roof and the blossom tree. Flowers grow up out of the grass as you scroll.
type Bird = { start: [number, number]; via: [number, number]; land: [number, number]; size: number };
const BIRDS: Bird[] = [
  { start: [30, -70], via: [22, 20], land: [9.4, 82.2], size: 4.4 }, // fence rail
  { start: [52, -85], via: [38, 30], land: [27.6, 76.6], size: 4.1 }, // picket tip
  { start: [46, -60], via: [55, 0], land: [63.2, 37.4], size: 3.2 }, // roof ridge
  { start: [70, -80], via: [72, 5], land: [82.5, 39], size: 3.6 }, // blossom branch
];

type Flower = { x: number; h: number; kind: "daisy" | "blush" | "blue"; back?: boolean };
const FLOWERS: Flower[] = [
  { x: 1.5, h: 15, kind: "blush" },
  { x: 6, h: 19, kind: "daisy" },
  { x: 11, h: 13, kind: "blue", back: true },
  { x: 15, h: 17, kind: "daisy" },
  { x: 20, h: 12, kind: "blush", back: true },
  { x: 24.5, h: 16, kind: "blue" },
  { x: 30, h: 14, kind: "daisy" },
  { x: 35, h: 11, kind: "blush", back: true },
  { x: 40, h: 13, kind: "blue" },
  { x: 66, h: 13, kind: "daisy", back: true },
  { x: 70.5, h: 16, kind: "blush" },
  { x: 75, h: 12, kind: "blue", back: true },
  { x: 79, h: 18, kind: "daisy" },
  { x: 85.5, h: 14, kind: "blue" },
  { x: 90, h: 17, kind: "blush" },
  { x: 95, h: 15, kind: "daisy" },
];
const FLOWER_SRC = { daisy: "/art/flower-daisy.webp", blush: "/art/flower-blush.webp", blue: "/art/flower-blue.webp" };

export function Storyteller() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scene = root.current!.querySelector<HTMLElement>(".story__scene")!;
      const birds = gsap.utils.toArray<HTMLElement>(".story-bird");
      const flowers = gsap.utils.toArray<HTMLElement>(".story-flower");
      const mm = gsap.matchMedia();

      const px = ([x, y]: [number, number]) => ({
        x: (x / 100) * scene.clientWidth,
        y: (y / 100) * scene.clientHeight,
      });

      // Position a bird along a soft curve (start, via, landing) for progress t, using the scene's
      // current size so it stays right when the window is resized. It grows as it comes towards you,
      // banks into the turn, and folds its wings in the last moment before landing.
      const placeBird = (el: HTMLElement, b: Bird, t: number) => {
        const a = px(b.start);
        const c = px(b.via);
        const d = px(b.land);
        const u = 1 - t;
        const x = u * u * a.x + 2 * u * t * c.x + t * t * d.x;
        const y = u * u * a.y + 2 * u * t * c.y + t * t * d.y;
        const dx = 2 * u * (c.x - a.x) + 2 * t * (d.x - c.x);
        const dy = 2 * u * (c.y - a.y) + 2 * t * (d.y - c.y);
        const goingRight = dx > 0;
        const bank = Math.max(-18, Math.min(18, (Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI / 3)) * (goingRight ? 1 : -1);
        const landed = t > 0.95;
        gsap.set(el, { x, y, scale: 0.45 + 0.55 * t, rotate: landed ? 0 : bank * (1 - t), autoAlpha: Math.min(1, t * 12) });
        const glide = el.querySelector<HTMLElement>(".story-bird__glide")!;
        const perch = el.querySelector<HTMLElement>(".story-bird__perch")!;
        glide.style.opacity = landed ? "0" : "1";
        glide.style.transform = goingRight ? "scaleX(-1)" : "";
        perch.style.opacity = landed ? "1" : "0";
        perch.style.transform = b.land[0] > b.via[0] ? "scaleX(-1)" : "";
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 85%", scrub: 1.2 },
        });

        birds.forEach((el, i) => {
          const b = BIRDS[i];
          const t0 = 0.04 + i * 0.09;
          const p = { t: 0 };
          tl.to(p, { t: 1, duration: 0.52, ease: "sine.out", onUpdate: () => placeBird(el, b, p.t) }, t0);
          placeBird(el, b, 0);
        });

        flowers.forEach((el, i) => {
          tl.fromTo(
            el,
            { scaleY: 0, scaleX: 0.6, opacity: 0 },
            { scaleY: 1, scaleX: 1, opacity: 1, duration: 0.22, ease: "back.out(1.4)" },
            0.18 + (i / flowers.length) * 0.5
          );
        });
        tl.to({}, { duration: 0.15 });

        // a gentle breeze once they've grown
        flowers.forEach((el, i) =>
          gsap.to(el.querySelector("img"), {
            rotate: i % 2 ? 2.5 : -2.5,
            duration: 2.6 + (i % 4) * 0.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            transformOrigin: "50% 100%",
          })
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        birds.forEach((el, i) => placeBird(el, BIRDS[i], 1));
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

      <div className="story__viewport">
        <div className="story__scene">
          <img
            className="story__meadow"
            src="/art/meadow.jpg"
            srcSet="/art/meadow-sm.jpg 888w, /art/meadow.jpg 1776w"
            sizes="(max-width: 760px) 760px, 100vw"
            width={1776}
            height={896}
            alt="A painted meadow at dawn: a stone cottage with a pink roof on a hill, a winding path, a white picket fence and a cherry blossom tree"
            loading="lazy"
            decoding="async"
          />
          <div className="story__smoke" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="story__flowers" aria-hidden="true">
            {FLOWERS.map((f, i) => (
              <div
                key={i}
                className={`story-flower${f.back ? " story-flower--back" : ""}`}
                style={{ left: `${f.x}%`, height: `${f.h}%` }}
              >
                <img src={FLOWER_SRC[f.kind]} alt="" width={218} height={480} loading="lazy" draggable={false} />
              </div>
            ))}
          </div>

          {BIRDS.map((b, i) => (
            <div key={i} className="story-bird" style={{ width: `${b.size}%` }} aria-hidden="true">
              <img className="story-bird__glide" src="/art/bird-glide.webp" alt="" width={360} height={335} loading="lazy" draggable={false} />
              <img className="story-bird__perch" src="/art/bird-perch.webp" alt="" width={360} height={315} loading="lazy" draggable={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
