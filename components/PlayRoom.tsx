"use client";

import { useEffect, useRef } from "react";
import { useSound } from "./SoundProvider";

// Pumpkin and Daisy chase a laser dot (your cursor) around a little room.
// Pumpkin: zero chill. Fast, darts after the dot, crouches and pounces when he catches up.
// Daisy: supervises. Follows slowly, a beat behind, and flops into a loaf whenever she can.
// Everything is driven by one requestAnimationFrame loop writing transforms, no re-renders.

type Pose = "trot" | "sit" | "pounce" | "walk" | "loaf";
type Cat = {
  el: HTMLElement;
  x: number;
  y: number;
  face: 1 | -1;
  pose: Pose;
  until: number; // pose lock (ms timestamp)
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function PlayRoom({ hint, touchHint }: { hint: string; touchHint: string }) {
  const room = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const pumpkinEl = useRef<HTMLDivElement>(null);
  const daisyEl = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  useEffect(() => {
    const roomEl = room.current!;
    const dotEl = dot.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = roomEl.clientWidth;
    let h = roomEl.clientHeight;
    const floorTop = () => h * 0.42; // cats stay on the floor, below the window line
    const floorEnd = () => h - 30; // and far enough from the bottom edge that their name tags show
    // On a phone the room is narrow, so everything is measured against its width: how close to the
    // walls they may go (so they're never cut in half), and how much room Daisy keeps from Pumpkin.
    const edge = () => (w < 520 ? 60 : 80);
    const gap = () => Math.min(150, w * 0.36);
    const personalSpace = () => Math.min(120, w * 0.3);

    const pumpkin: Cat = { el: pumpkinEl.current!, x: w * 0.28, y: Math.min(h * 0.82, h - 30), face: 1, pose: "sit", until: 0 };
    const daisy: Cat = { el: daisyEl.current!, x: w * 0.72, y: Math.min(h * 0.88, h - 30), face: -1, pose: "loaf", until: 0 };

    const target = { x: w * 0.5, y: h * 0.7 };
    const history: { x: number; y: number; t: number }[] = [];
    let pointerInside = false;
    let lastMove = performance.now();
    let running = false;
    let raf = 0;

    const draw = (c: Cat) => {
      c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
      c.el.style.zIndex = String(5 + Math.round(c.y / 4)); // whoever is nearer the front draws on top
      c.el.dataset.pose = c.pose;
      c.el.dataset.face = c.face === 1 ? "right" : "left";
    };
    const setPose = (c: Cat, pose: Pose, now: number, lock = 0) => {
      if (c.pose !== pose) {
        c.pose = pose;
        c.until = now + lock;
      }
    };

    const step = (now: number) => {
      // When nobody is playing, the laser drifts lazily on its own so the room never feels dead.
      if (!pointerInside && now - lastMove > 2500) {
        const t = now / 1000;
        target.x = w * (0.5 + 0.34 * Math.sin(t * 0.55));
        target.y = floorTop() + (h - floorTop()) * (0.55 + 0.3 * Math.sin(t * 0.9 + 1.3));
      }
      dotEl.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      history.push({ x: target.x, y: target.y, t: now });
      while (history.length && now - history[0].t > 1400) history.shift();

      const goalX = clamp(target.x, edge(), w - edge());
      const goalY = clamp(target.y + 8, floorTop() + 40, floorEnd());

      // Pumpkin goes straight for the dot.
      {
        const c = pumpkin;
        const dx = goalX - c.x;
        const dy = goalY - c.y;
        const d = Math.hypot(dx, dy);
        if (now > c.until) {
          if (d > 70) {
            const speed = Math.min(d * 0.09, 11);
            c.x += (dx / d) * speed;
            c.y += (dy / d) * speed;
            if (Math.abs(dx) > 4) c.face = dx > 0 ? 1 : -1;
            setPose(c, "trot", now);
          } else if (c.pose === "trot") {
            setPose(c, "pounce", now, 650); // caught up: crouch, wiggle, pounce
            play("plop");
          } else if (c.pose === "pounce") {
            setPose(c, "sit", now, 400);
          }
        }
        c.el.classList.toggle("is-wiggle", c.pose === "pounce");
      }

      // Daisy follows a beat behind Pumpkin, slowly, and only if it's worth getting up.
      {
        const c = daisy;
        const past = history[0] ?? target;
        // She keeps a polite distance from Pumpkin on the side she's already on, and only crosses
        // over when that side is squeezed against a wall (which happens a lot on a narrow phone).
        const spot = (side: number) => clamp(pumpkin.x + side * gap(), edge(), w - edge());
        let side = c.x < pumpkin.x ? -1 : 1;
        if (Math.abs(spot(side) - pumpkin.x) < personalSpace()) side = -side;
        const px = spot(side);
        const py = clamp(past.y + 14, floorTop() + 50, floorEnd());
        const dx = px - c.x;
        const dy = py - c.y;
        const d = Math.hypot(dx, dy);
        // Never lie on top of each other: if Pumpkin lands on her, she gets up and moves to her spot.
        const crowded = Math.abs(c.x - pumpkin.x) < personalSpace() && Math.abs(c.y - pumpkin.y) < 60;
        if (crowded && c.pose === "loaf") c.until = Math.min(c.until, now + 300);
        if (now > c.until) {
          if (d > 160 || (c.pose === "walk" && d > 50) || (crowded && d > 8)) {
            const speed = Math.min(d * 0.03, crowded ? 3.2 : 2.6);
            c.x += (dx / d) * speed;
            c.y += (dy / d) * speed;
            if (Math.abs(dx) > 3) c.face = dx > 0 ? 1 : -1;
            setPose(c, "walk", now, c.pose === "loaf" ? 700 : 0); // getting up takes her a moment
          } else {
            setPose(c, "loaf", now, 1800); // and once down, she stays down a while
          }
        } else if (crowded && c.pose === "walk" && d > 8) {
          c.x = clamp(c.x + Math.sign(dx) * 1.6, edge(), w - edge()); // already up: shuffle towards her spot
        }
      }

      draw(pumpkin);
      draw(daisy);
      if (running) raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const toLocal = (e: PointerEvent) => {
      const r = roomEl.getBoundingClientRect();
      target.x = clamp(e.clientX - r.left, 8, w - 8);
      target.y = clamp(e.clientY - r.top, 8, h - 8);
      lastMove = performance.now();
    };
    const onEnter = (e: PointerEvent) => {
      pointerInside = true;
      roomEl.classList.add("is-playing");
      toLocal(e);
    };
    const onMove = (e: PointerEvent) => {
      pointerInside = true;
      toLocal(e);
    };
    const onLeave = () => {
      pointerInside = false;
      roomEl.classList.remove("is-playing");
    };
    roomEl.addEventListener("pointerenter", onEnter);
    roomEl.addEventListener("pointermove", onMove);
    roomEl.addEventListener("pointerdown", onMove);
    roomEl.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(() => {
      w = roomEl.clientWidth;
      h = roomEl.clientHeight;
      for (const c of [pumpkin, daisy]) {
        c.x = clamp(c.x, edge(), w - edge());
        c.y = clamp(c.y, floorTop() + 40, floorEnd());
      }
      draw(pumpkin);
      draw(daisy);
    });
    ro.observe(roomEl);

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.05 });
    io.observe(roomEl);

    draw(pumpkin);
    draw(daisy);
    dotEl.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      roomEl.removeEventListener("pointerenter", onEnter);
      roomEl.removeEventListener("pointermove", onMove);
      roomEl.removeEventListener("pointerdown", onMove);
      roomEl.removeEventListener("pointerleave", onLeave);
    };
  }, [play]);

  return (
    <div className="playroom" ref={room} aria-label="Pumpkin and Daisy, Laraib's cats, chasing a laser pointer. Move your cursor here to play." role="img">
      <div className="playroom__wall" aria-hidden="true">
        <div className="playroom__window">
          <span />
        </div>
        <div className="playroom__frame playroom__frame--a" />
        <div className="playroom__frame playroom__frame--b" />
        <div className="playroom__shelf">
          <span className="playroom__plant" />
          <span className="playroom__books" />
        </div>
      </div>
      <div className="playroom__floor" aria-hidden="true">
        <div className="playroom__rug" />
      </div>

      <div className="laser" ref={dot} aria-hidden="true">
        <span />
      </div>

      <div className="cat cat--pumpkin" ref={pumpkinEl} data-pose="sit" data-face="right" aria-hidden="true">
        <div className="cat__flip">
          <img className="cat__pose cat__pose--trot" src="/art/pumpkin-trot-sm.webp" srcSet="/art/pumpkin-trot-sm.webp 300w, /art/pumpkin-trot.webp 507w" sizes="(max-width: 640px) 112px, 150px" loading="lazy" decoding="async" alt="" width={507} height={520} draggable={false} />
          <img className="cat__pose cat__pose--pounce" src="/art/pumpkin-pounce-sm.webp" srcSet="/art/pumpkin-pounce-sm.webp 312w, /art/pumpkin-pounce.webp 520w" sizes="(max-width: 640px) 112px, 156px" loading="lazy" decoding="async" alt="" width={520} height={392} draggable={false} />
          <img className="cat__pose cat__pose--sit" src="/art/pumpkin-sit-sm.webp" srcSet="/art/pumpkin-sit-sm.webp 196w, /art/pumpkin-sit.webp 356w" sizes="98px" loading="lazy" decoding="async" alt="" width={356} height={520} draggable={false} />
        </div>
        <span className="cat__tag hand">Pumpkin</span>
      </div>

      <div className="cat cat--daisy" ref={daisyEl} data-pose="loaf" data-face="left" aria-hidden="true">
        <div className="cat__flip">
          <img className="cat__pose cat__pose--walk" src="/art/daisy-walk-sm.webp" srcSet="/art/daisy-walk-sm.webp 344w, /art/daisy-walk.webp 520w" sizes="172px" loading="lazy" decoding="async" alt="" width={520} height={340} draggable={false} />
          <img className="cat__pose cat__pose--loaf" src="/art/daisy-loaf-sm.webp" srcSet="/art/daisy-loaf-sm.webp 336w, /art/daisy-loaf.webp 520w" sizes="168px" loading="lazy" decoding="async" alt="" width={520} height={273} draggable={false} />
        </div>
        <span className="cat__tag hand">Daisy</span>
      </div>

      <p className="playroom__hint hand" aria-hidden="true">
        <span className="playroom__hint--mouse">{hint}</span>
        <span className="playroom__hint--touch">{touchHint}</span>
      </p>
    </div>
  );
}
