"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

// Calm UI sound effects.
// Sources: earshot "calm" kit (MIT code, CC0-derived sounds) and CC0 recordings via Openverse. See public/sfx/CREDITS.md.
// Browsers only allow audio after the visitor interacts, so nothing plays until the first click or key press.

const FILES = {
  tick: "/sfx/tick.mp3",
  click: "/sfx/click.mp3",
  pop: "/sfx/pop.mp3",
  page: "/sfx/page.mp3",
  success: "/sfx/success.mp3",
  wings: "/sfx/wings.mp3",
  "kalimba-c5": "/sfx/kalimba-c5.mp3",
  "kalimba-d5": "/sfx/kalimba-d5.mp3",
  "kalimba-e5": "/sfx/kalimba-e5.mp3",
  "kalimba-g5": "/sfx/kalimba-g5.mp3",
  "kalimba-a5": "/sfx/kalimba-a5.mp3",
} as const;

export type SoundName = keyof typeof FILES | "kalimba";
type PlayOpts = { volume?: number; rate?: number; maxSeconds?: number };

const KALIMBA = ["kalimba-c5", "kalimba-d5", "kalimba-e5", "kalimba-g5", "kalimba-a5"] as const;
const STORAGE_KEY = "impsychout:sound";

type Ctx = { enabled: boolean; toggle: () => void; play: (name: SoundName, opts?: PlayOpts) => void };
const SoundContext = createContext<Ctx>({ enabled: false, toggle: () => {}, play: () => {} });
export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const buffers = useRef(new Map<string, AudioBuffer>());
  const unlocked = useRef(false);
  const lastHover = useRef(0);
  const lastNote = useRef(-1);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "off") {
        setEnabled(false);
        enabledRef.current = false;
      }
    } catch {}
  }, []);

  const load = useCallback(async () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    await Promise.all(
      Object.entries(FILES).map(async ([name, url]) => {
        if (buffers.current.has(name)) return;
        try {
          const res = await fetch(url);
          const buf = await ctx.decodeAudioData(await res.arrayBuffer());
          buffers.current.set(name, buf);
        } catch {}
      })
    );
  }, []);

  const unlock = useCallback(() => {
    if (unlocked.current) return;
    unlocked.current = true;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctxRef.current = new AC();
    void load();
  }, [load]);

  const play = useCallback((name: SoundName, { volume = 0.3, rate = 1, maxSeconds }: PlayOpts = {}) => {
    const ctx = ctxRef.current;
    if (!enabledRef.current || !ctx) return;
    let key: string = name;
    if (name === "kalimba") {
      // a different pentatonic note each time, never the same twice in a row
      let i = Math.floor(Math.random() * KALIMBA.length);
      if (i === lastNote.current) i = (i + 1) % KALIMBA.length;
      lastNote.current = i;
      key = KALIMBA[i];
    }
    const buf = buffers.current.get(key);
    if (!buf) return;
    if (ctx.state === "suspended") void ctx.resume();
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(volume, now);
    if (maxSeconds) {
      gain.gain.setValueAtTime(volume, now + Math.max(0, maxSeconds - 0.25));
      gain.gain.linearRampToValueAtTime(0.0001, now + maxSeconds);
    }
    src.connect(gain).connect(ctx.destination);
    src.start(now);
    if (maxSeconds) src.stop(now + maxSeconds + 0.05);
  }, []);

  const toggle = useCallback(() => {
    setEnabled((on) => {
      const next = !on;
      enabledRef.current = next;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {}
      return next;
    });
  }, []);

  // Delegated sounds: any link or button gets a soft tick on hover and a pop on press.
  // Elements can opt into a different hover sound with data-sfx-hover="kalimba" (or "none").
  useEffect(() => {
    const onFirst = () => unlock();
    window.addEventListener("pointerdown", onFirst, { once: true, capture: true });
    window.addEventListener("keydown", onFirst, { once: true, capture: true });

    const target = (e: Event) =>
      (e.target as Element | null)?.closest?.("a, button, summary, [data-sfx-hover]") as HTMLElement | null;

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = target(e);
      if (!el || el.contains(e.relatedTarget as Node)) return;
      const kind = el.dataset.sfxHover ?? "tick";
      if (kind === "none") return;
      const t = performance.now();
      if (t - lastHover.current < 90) return;
      lastHover.current = t;
      if (kind === "kalimba") play("kalimba", { volume: 0.16, maxSeconds: 1.2 });
      else play("tick", { volume: 0.14, rate: 1 + Math.random() * 0.1 });
    };
    const onDown = (e: PointerEvent) => {
      const el = target(e);
      if (!el || el.dataset.sfxPress === "none") return;
      play("pop", { volume: 0.32, rate: 0.95 + Math.random() * 0.1 });
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("pointerdown", onFirst, { capture: true });
      window.removeEventListener("keydown", onFirst, { capture: true });
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [play, unlock]);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
