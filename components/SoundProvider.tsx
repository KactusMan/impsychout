"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

// Soft UI sound. Everything runs through one master chain: about 35% volume and a gentle
// low-pass filter that rounds off any sharp edges, so nothing ever sounds loud or clicky.
// Elements opt in with data attributes:
//   data-sfx-hover="note | thock | tick"   plays once when a mouse enters
//   data-sfx-press="tap | open"             plays on press
// On phones there is no hover, so a tap plays the element's hover sound (or its press sound).
// Browsers only allow audio after the visitor interacts, so nothing plays before the first tap or key.
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
  paper: "/sfx/page.mp3",
  "marimba-c5": "/sfx/marimba-c5.mp3",
  "marimba-d5": "/sfx/marimba-d5.mp3",
  "marimba-e5": "/sfx/marimba-e5.mp3",
  "marimba-g5": "/sfx/marimba-g5.mp3",
  "marimba-a5": "/sfx/marimba-a5.mp3",
  plop: "/sfx/plop.mp3",
  "menu-tick": "/sfx/menu-tick.mp3",
};

// One voice per job, so every section has its own sound:
// note/tap = buttons, tick = nav links, menu = nav dropdown, thock = care cards,
// paper = folder tabs, step = carousel, open = FAQ, marimba = reframing thoughts,
// pick/place = moving hero pieces, plop = Pumpkin's pounce.
export type SoundName = "note" | "tap" | "thock" | "tick" | "menu" | "paper" | "step" | "open" | "marimba" | "pick" | "place" | "plop";

// Recorded sounds: each one's level relative to the master, and how long it may ring.
type Sample = { keys: string[]; level: number; max: number; rate?: [number, number] };
// Gentle synthesised tones (pure sine, soft attack, slow fade) for the places where a recording
// sounded too rough: picking things up, the carousel and the FAQ.
type Tone = { tone: number[]; level: number; dur: number; glide?: number; shimmer?: number };

const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880, G4 = 392, A4 = 440, B4 = 493.88;

const VOICE: Record<SoundName, Sample | Tone> = {
  note: { keys: ["note-c5", "note-e5", "note-g5", "note-a5"], level: 0.32, max: 0.9 },
  tap: { keys: ["tap-1", "tap-2"], level: 0.75, max: 0.4, rate: [0.94, 1.02] },
  thock: { keys: ["thock-1", "thock-2", "thock-3", "thock-4"], level: 0.55, max: 0.35, rate: [0.92, 1.0] },
  tick: { keys: ["tick"], level: 0.3, max: 0.2, rate: [0.95, 1.08] },
  menu: { keys: ["menu-tick"], level: 0.5, max: 0.15 },
  paper: { keys: ["paper"], level: 0.6, max: 0.8 },
  marimba: { keys: ["marimba-c5", "marimba-d5", "marimba-e5", "marimba-g5", "marimba-a5"], level: 0.38, max: 0.9 },
  plop: { keys: ["plop"], level: 0.4, max: 0.3 },
  // a soft little lift when you pick something up, and a gentle settle when you put it down
  pick: { tone: [G4, A4], level: 0.2, dur: 0.18, glide: 1.22 },
  place: { tone: [D5, C5], level: 0.18, dur: 0.24, glide: 0.82 },
  // carousel: a calm chime that climbs one note per step (C, E, G, A)
  step: { tone: [C5, E5, G5, A5], level: 0.16, dur: 0.6, shimmer: 0.12 },
  // FAQ: one warm, low bell when a question opens
  open: { tone: [A4, B4, C5], level: 0.15, dur: 0.5, shimmer: 0.08 },
};

const MASTER = 0.35;
const STORAGE_KEY = "impsychout:sound";

type Ctx = { enabled: boolean; toggle: () => void; play: (name: SoundName, pick?: number) => void };
const SoundContext = createContext<Ctx>({ enabled: false, toggle: () => {}, play: () => {} });
export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: ReactNode }) {
  // Muted by default; the visitor turns sound on from the header and the choice is remembered.
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const outRef = useRef<AudioNode | null>(null);
  const loading = useRef<Promise<void> | null>(null);
  const buffers = useRef(new Map<string, AudioBuffer>());
  const turn = useRef<Record<string, number>>({});
  const lastAt = useRef<Record<string, number>>({});

  // Creates the audio context synchronously (so it counts as part of the tap that asked for it),
  // then loads the recordings in the background.
  const ensureAudio = useCallback(() => {
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
    loading.current = Promise.all(
      Object.entries(FILES).map(async ([name, url]) => {
        try {
          const res = await fetch(url);
          buffers.current.set(name, await ctx.decodeAudioData(await res.arrayBuffer()));
        } catch {}
      })
    ).then(() => {});
    return ctx;
  }, []);

  // Phones (iPhones especially) keep audio locked until it is resumed inside a tap,
  // and lock it again after the page has been in the background. Wake it on every gesture.
  const unlock = useCallback(() => {
    const ctx = ensureAudio();
    if (!ctx || ctx.state === "running") return;
    void ctx.resume().catch(() => {});
    try {
      const silent = ctx.createBufferSource();
      silent.buffer = ctx.createBuffer(1, 1, 22050);
      silent.connect(ctx.destination);
      silent.start(0);
    } catch {}
  }, [ensureAudio]);

  const play = useCallback((name: SoundName, pick?: number) => {
    const ctx = ctxRef.current;
    const out = outRef.current;
    if (!enabledRef.current || !ctx || !out) return;
    const now = performance.now();
    if (now - (lastAt.current[name] ?? 0) < 70) return; // no machine-gun repeats
    lastAt.current[name] = now;
    if (ctx.state !== "running") void ctx.resume().catch(() => {});
    const v = VOICE[name];
    const t = ctx.currentTime;

    if ("tone" in v) {
      const i = pick ?? (turn.current[name] = ((turn.current[name] ?? -1) + 1) % v.tone.length);
      const freq = v.tone[Math.max(0, Math.min(v.tone.length - 1, i))];
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(v.level, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + v.dur);
      gain.connect(out);
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      if (v.glide) osc.frequency.exponentialRampToValueAtTime(freq * v.glide, t + Math.min(0.12, v.dur * 0.6));
      osc.connect(gain);
      osc.start(t);
      osc.stop(t + v.dur + 0.05);
      if (v.shimmer) {
        // a quiet octave on top that fades first, which makes it sound like a soft bell
        const over = ctx.createOscillator();
        over.type = "sine";
        over.frequency.value = freq * 2;
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.0001, t);
        og.gain.linearRampToValueAtTime(v.shimmer, t + 0.01);
        og.gain.exponentialRampToValueAtTime(0.0001, t + v.dur * 0.45);
        over.connect(og).connect(gain);
        over.start(t);
        over.stop(t + v.dur * 0.45 + 0.05);
      }
      return;
    }

    const i = (turn.current[name] = ((turn.current[name] ?? -1) + 1) % v.keys.length);
    const buf = buffers.current.get(v.keys[i]);
    if (!buf) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    if (v.rate) src.playbackRate.value = v.rate[0] + Math.random() * (v.rate[1] - v.rate[0]);
    const gain = ctx.createGain();
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
    if (next) {
      unlock();
      void loading.current?.then(() => play("tap"));
    }
  }, [unlock, play]);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "on") {
        enabledRef.current = true;
        setEnabled(true);
      }
    } catch {}

    // Every kind of gesture gets a chance to wake the audio; iOS only accepts some of them.
    const gestures = ["pointerdown", "touchend", "click", "keydown"] as const;
    for (const g of gestures) window.addEventListener(g, unlock, { capture: true, passive: true });
    // iOS only shows :active (the pressed look on buttons) when a touch listener exists.
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });

    let lastPointer = "mouse";
    const find = (e: Event, attr: string) => (e.target as Element | null)?.closest?.(`[${attr}]`) as HTMLElement | null;
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = find(e, "data-sfx-hover");
      if (!el || el.contains(e.relatedTarget as Node)) return;
      play(el.dataset.sfxHover as SoundName);
    };
    const isClosing = (el: HTMLElement) => el.tagName === "SUMMARY" && Boolean((el.parentElement as HTMLDetailsElement | null)?.open);
    // Mouse: press sounds play the moment the button goes down.
    const onDown = (e: PointerEvent) => {
      lastPointer = e.pointerType;
      if (e.pointerType !== "mouse") return;
      const el = find(e, "data-sfx-press");
      if (!el || isClosing(el)) return; // FAQ: sound on open only
      play(el.dataset.sfxPress as SoundName);
    };
    // Touch: wait for the tap to land (so scrolling past a button stays silent), then play
    // the element's hover sound if it has one, since phones never hover.
    const onClick = (e: MouseEvent) => {
      if (lastPointer === "mouse" || e.detail === 0) return;
      const el = find(e, "data-sfx-hover") ?? find(e, "data-sfx-press");
      if (!el || isClosing(el)) return;
      play((el.dataset.sfxHover ?? el.dataset.sfxPress) as SoundName);
    };
    const onVisible = () => {
      if (document.visibilityState === "visible" && ctxRef.current?.state !== "running") void ctxRef.current?.resume().catch(() => {});
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      for (const g of gestures) window.removeEventListener(g, unlock, { capture: true });
      document.removeEventListener("touchstart", noop);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [unlock, play]);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
