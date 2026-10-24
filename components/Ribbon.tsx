"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef, useState } from "react";
import { ribbonWords, type DoodleName } from "@/lib/content";
import { Doodle } from "./Doodles";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

// One strip of washi tape whose text drifts slowly and speeds up (or reverses) with scroll velocity.
function TapeStrip({
  baseVelocity,
  tone,
  icons,
  tilt,
}: {
  baseVelocity: number;
  tone: "pink" | "blue";
  icons: DoodleName[];
  tilt: number;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const factor = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const dir = useRef(1);
  const [paused, setPaused] = useState(false);
  const pos = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    const speed = paused ? 0.25 : 1;
    x.set(x.get() + dir.current * baseVelocity * (delta / 1000) * speed * (1 + Math.abs(f)));
  });

  const items = [...ribbonWords, ...ribbonWords];
  return (
    <div
      className={`tape-strip tape-strip--${tone}`}
      style={{ rotate: `${tilt}deg` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div className="tape-strip__track" style={{ x: pos }}>
        {[0, 1].map((copy) => (
          <div className="tape-strip__set" key={copy} aria-hidden={copy === 1}>
            {items.map((w, i) => (
              <span className="tape-strip__item" key={`${copy}-${i}`}>
                <span>{w}</span>
                <Doodle name={icons[i % icons.length]} className="tape-strip__icon" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Ribbon() {
  return (
    <div className="ribbon" role="presentation">
      <p className="visually-hidden">{ribbonWords.join(", ")}</p>
      <TapeStrip baseVelocity={-1.4} tone="blue" icons={["heart", "star", "flower"]} tilt={-2.4} />
      <TapeStrip baseVelocity={1.1} tone="pink" icons={["sparkle", "butterfly", "sun"]} tilt={1.8} />
    </div>
  );
}
