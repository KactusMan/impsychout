"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

// Gentle UI sound. Only two things ever make a sound: buttons (one soft kalimba note
// when pressed) and the paper tabs in "How I work". Nothing on hover, links, menus or FAQs.
// Browsers only allow audio after the visitor interacts, so nothing plays before the first click.
// Sources and licences: public/sfx/CREDITS.md.

const FILES = {
  page: "/sfx/page.mp3",
  "kalimba-c5": "/sfx/kalimba-c5.mp3",
  "kalimba-e5": "/sfx/kalimba-e5.mp3",
  "kalimba-g5": "/sfx/kalimba-g5.mp3",
} as const;

export type SoundName = "button" | "paper";
const NOTES = ["kalimba-c5", "kalimba-e5", "kalimba-g5"] as const;
const STORAGE_KEY = "impsychout:sound";

type Ctx = { enabled: boolean; toggle: () => void; play: (name: SoundName) => void };
const SoundContext = createContext<Ctx>({ enabled: true, toggle: () => {}, play: () => {} });
export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const buffers = useRef(new Map<string, AudioBuffer>());
  const note = useRef(0);

  const ensureAudio = useCallback(async () => {
    if (ctxRef.current) return ctxRef.current;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    ctxRef.current = ctx;
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

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "off") {
        setEnabled(false);
        enabledRef.current = false;
      }
    } catch {}
    const prime = () => void ensureAudio();
    window.addEventListener("pointerdown", prime, { once: true, capture: true });
    window.addEventListener("keydown", prime, { once: true, capture: true });
    return () => {
      window.removeEventListener("pointerdown", prime, { capture: true });
      window.removeEventListener("keydown", prime, { capture: true });
    };
  }, [ensureAudio]);

  const play = useCallback((name: SoundName) => {
    const ctx = ctxRef.current;
    if (!enabledRef.current || !ctx) return;
    const key = name === "paper" ? "page" : NOTES[note.current++ % NOTES.length];
    const buf = buffers.current.get(key);
    if (!buf) return;
    if (ctx.state === "suspended") void ctx.resume();
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    // soft attack, low level, gentle fade-out so nothing clicks or startles
    const level = name === "paper" ? 0.24 : 0.09;
    const length = name === "paper" ? 0.75 : 0.9;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(level, now + 0.02);
    gain.gain.setValueAtTime(level, now + length - 0.35);
    gain.gain.linearRampToValueAtTime(0.0001, now + length);
    src.connect(gain).connect(ctx.destination);
    src.start(now);
    src.stop(now + length + 0.05);
  }, []);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {}
  }, []);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
