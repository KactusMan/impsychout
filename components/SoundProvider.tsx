"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

// Soft UI sound. Everything runs through one master chain: about 35% volume and a gentle
// low-pass filter that rounds off any sharp edges, so nothing ever sounds loud or clicky.
// Elements opt in with data attributes:
//   data-sfx-hover="note | thock | tick"   plays once when a mouse enters
//   data-sfx-press="tap | paper | swish"   plays on press
// Browsers only allow audio after the visitor interacts, so nothing plays before the first click or key.
// Sources and licences: public/sfx/CREDITS.md.

const FILES: Record<string, string> = {
  "note-c5": "/sfx/note-c5.mp3",
  "note-e5": "/sfx/note-e5.mp3",
  "note-g5": "/sfx/note-g5.mp3",
  "note-a5": "/sfx/note-a5.mp3",
  "tap-1": "/sfx/tap-1.mp3",
  "tap-2": "/sfx/tap-2.mp3",
  "thock-1": "/sfx/thock-1.mp3",
  "thock-2": "/sfx/thock-2.mp3",
  "thock-3": "/sfx/thock-3.mp3",
  "thock-4": "/sfx/thock-4.mp3",
  tick: "/sfx/tick.mp3",
  swish: "/sfx/swish.mp3",
  paper: "/sfx/page.mp3",
};

export type SoundName = "note" | "tap" | "thock" | "tick" | "swish" | "paper";

// Each sound's level relative to the master, and how long it may ring.
const VOICE: Record<SoundName, { keys: string[]; level: number; max: number; rate?: [number, number] }> = {
  note: { keys: ["note-c5", "note-e5", "note-g5", "note-a5"], level: 0.32, max: 0.9 },
  tap: { keys: ["tap-1", "tap-2"], level: 0.75, max: 0.4, rate: [0.94, 1.02] },
  thock: { keys: ["thock-1", "thock-2", "thock-3", "thock-4"], level: 0.55, max: 0.35, rate: [0.92, 1.0] },
  tick: { keys: ["tick"], level: 0.3, max: 0.2, rate: [0.95, 1.08] },
  swish: { keys: ["swish"], level: 0.4, max: 0.6 },
  paper: { keys: ["paper"], level: 0.6, max: 0.8 },
};

const MASTER = 0.35;
const STORAGE_KEY = "impsychout:sound";

type Ctx = { enabled: boolean; toggle: () => void; play: (name: SoundName) => void };
const SoundContext = createContext<Ctx>({ enabled: true, toggle: () => {}, play: () => {} });
export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const outRef = useRef<AudioNode | null>(null);
  const buffers = useRef(new Map<string, AudioBuffer>());
  const turn = useRef<Record<string, number>>({});
  const lastAt = useRef<Record<string, number>>({});

  const ensureAudio = useCallback(async () => {
    if (ctxRef.current) return ctxRef.current;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = MASTER;
    const soften = ctx.createBiquadFilter();
    soften.type = "lowpass";
    soften.frequency.value = 4200;
    soften.Q.value = 0.4;
    master.connect(soften).connect(ctx.destination);
    ctxRef.current = ctx;
    outRef.current = master;
    await Promise.all(
      Object.entries(FILES).map(async ([name, url]) => {
        try {
          const res = await fetch(url);
          buffers.current.set(name, await ctx.decodeAudioData(await res.arrayBuffer()));
        } catch {}
      })
    );
    return ctx;
  }, []);

  const play = useCallback((name: SoundName) => {
    const ctx = ctxRef.current;
    const out = outRef.current;
    if (!enabledRef.current || !ctx || !out) return;
    const now = performance.now();
    if (now - (lastAt.current[name] ?? 0) < 70) return; // no machine-gun repeats
    lastAt.current[name] = now;
    const v = VOICE[name];
    const i = (turn.current[name] = ((turn.current[name] ?? -1) + 1) % v.keys.length);
    const buf = buffers.current.get(v.keys[i]);
    if (!buf) return;
    if (ctx.state === "suspended") void ctx.resume();
    const src = ctx.createBufferSource();
    src.buffer = buf;
    if (v.rate) src.playbackRate.value = v.rate[0] + Math.random() * (v.rate[1] - v.rate[0]);
    const gain = ctx.createGain();
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(v.level, t + 0.012);
    gain.gain.setValueAtTime(v.level, t + Math.max(0.02, v.max - 0.25));
    gain.gain.linearRampToValueAtTime(0.0001, t + v.max);
    src.connect(gain).connect(out);
    src.start(t);
    src.stop(t + v.max + 0.05);
  }, []);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "off") {
        enabledRef.current = false;
        setEnabled(false);
      }
    } catch {}

    const prime = () => void ensureAudio();
    window.addEventListener("pointerdown", prime, { once: true, capture: true });
    window.addEventListener("keydown", prime, { once: true, capture: true });

    const find = (e: Event, attr: string) => (e.target as Element | null)?.closest?.(`[${attr}]`) as HTMLElement | null;
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = find(e, "data-sfx-hover");
      if (!el || el.contains(e.relatedTarget as Node)) return;
      play(el.dataset.sfxHover as SoundName);
    };
    const onDown = (e: PointerEvent) => {
      const el = find(e, "data-sfx-press");
      if (el) play(el.dataset.sfxPress as SoundName);
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("pointerdown", prime, { capture: true });
      window.removeEventListener("keydown", prime, { capture: true });
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [ensureAudio, play]);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
