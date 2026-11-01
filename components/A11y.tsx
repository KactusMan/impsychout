"use client";

import { MotionConfig } from "framer-motion";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useSound } from "./SoundProvider";

// Accessibility preferences, remembered per visitor. Each one adds a class to <html> that the
// stylesheet responds to (see "accessibility toolbar" in globals.css), so they work on every page.

type Prefs = {
  text: 0 | 1 | 2 | 3; // text size step
  contrast: boolean;
  readable: boolean; // dyslexia-friendly, highly legible font
  links: boolean; // highlight links
  spacing: boolean; // more space between lines, words and letters
  calm: boolean; // pause animations and motion
  guide: boolean; // reading guide that follows the pointer
  cursor: boolean; // big cursor
  mono: boolean; // reduce colour
};
const DEFAULTS: Prefs = { text: 0, contrast: false, readable: false, links: false, spacing: false, calm: false, guide: false, cursor: false, mono: false };
const KEY = "impsychout:a11y";
const TEXT_SIZES = ["100%", "112.5%", "125%", "140%"];

const A11yContext = createContext<{ prefs: Prefs; set: (p: Partial<Prefs>) => void; reset: () => void }>({
  prefs: DEFAULTS,
  set: () => {},
  reset: () => {},
});
export const useA11y = () => useContext(A11yContext);

export function A11yProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (saved) setPrefs({ ...DEFAULTS, ...saved });
    } catch {}
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.style.fontSize = prefs.text ? TEXT_SIZES[prefs.text] : "";
    const flags: [keyof Prefs, string][] = [
      ["contrast", "a11y-contrast"],
      ["readable", "a11y-readable"],
      ["links", "a11y-links"],
      ["spacing", "a11y-spacing"],
      ["calm", "a11y-calm"],
      ["cursor", "a11y-cursor"],
      ["mono", "a11y-mono"],
    ];
    for (const [k, cls] of flags) html.classList.toggle(cls, Boolean(prefs[k]));
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {}
  }, [prefs]);

  const set = useCallback((p: Partial<Prefs>) => setPrefs((cur) => ({ ...cur, ...p })), []);
  const reset = useCallback(() => setPrefs(DEFAULTS), []);

  return (
    <A11yContext.Provider value={{ prefs, set, reset }}>
      <MotionConfig reducedMotion={prefs.calm ? "always" : "user"}>{children}</MotionConfig>
      {prefs.guide && <ReadingGuide />}
    </A11yContext.Provider>
  );
}

function ReadingGuide() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (bar.current) bar.current.style.transform = `translateY(${e.clientY - 24}px)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <div className="reading-guide" ref={bar} aria-hidden="true" />;
}

function Toggle({ on, onChange, label, hint, icon }: { on: boolean; onChange: (v: boolean) => void; label: string; hint: string; icon: ReactNode }) {
  return (
    <button type="button" className={`a11y-opt${on ? " is-on" : ""}`} aria-pressed={on} onClick={() => onChange(!on)}>
      <span className="a11y-opt__ico" aria-hidden="true">
        {icon}
      </span>
      <span className="a11y-opt__text">
        <b>{label}</b>
        <span>{hint}</span>
      </span>
    </button>
  );
}

const ico = (d: string) => (
  <svg viewBox="0 0 24 24">
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function A11yToolbar() {
  const { prefs, set, reset } = useA11y();
  const { enabled, toggle } = useSound();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!panel.current?.contains(e.target as Node) && !button.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const changed = JSON.stringify(prefs) !== JSON.stringify(DEFAULTS);

  return (
    <div className="a11y">
      <button
        ref={button}
        type="button"
        className={`a11y__fab${changed ? " is-active" : ""}`}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="Accessibility options"
        title="Accessibility options"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="4.5" r="2" fill="currentColor" />
          <path d="M4.5 8.5 12 10l7.5-1.5M12 10v4.5M12 14.5l-3.5 6M12 14.5l3.5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div ref={panel} id="a11y-panel" className="a11y__panel" role="dialog" aria-modal="false" aria-labelledby="a11y-title">
          <div className="a11y__head">
            <h2 id="a11y-title">Accessibility</h2>
            <button type="button" className="a11y__close" aria-label="Close accessibility options" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className="a11y__size" role="group" aria-label="Text size">
            <span>Text size</span>
            <div>
              <button type="button" aria-label="Smaller text" disabled={prefs.text === 0} onClick={() => set({ text: (prefs.text - 1) as Prefs["text"] })}>
                A−
              </button>
              <output aria-live="polite">{TEXT_SIZES[prefs.text]}</output>
              <button type="button" aria-label="Larger text" disabled={prefs.text === 3} onClick={() => set({ text: (prefs.text + 1) as Prefs["text"] })}>
                A+
              </button>
            </div>
          </div>

          <div className="a11y__grid">
            <Toggle on={prefs.contrast} onChange={(v) => set({ contrast: v })} label="High contrast" hint="Darker text, plain backgrounds" icon={ico("M12 3a9 9 0 1 0 0 18V3Z M12 3a9 9 0 0 1 0 18")} />
            <Toggle on={prefs.readable} onChange={(v) => set({ readable: v })} label="Readable font" hint="Dyslexia-friendly lettering" icon={ico("M4 19 9 5l5 14M6 14h6M15 19V9m0 3a3 3 0 1 1 3 3h-3")} />
            <Toggle on={prefs.spacing} onChange={(v) => set({ spacing: v })} label="Text spacing" hint="More room between lines" icon={ico("M4 6h16M4 12h16M4 18h16")} />
            <Toggle on={prefs.links} onChange={(v) => set({ links: v })} label="Highlight links" hint="Make every link stand out" icon={ico("M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1")} />
            <Toggle on={prefs.calm} onChange={(v) => set({ calm: v })} label="Pause motion" hint="Stop animations and movement" icon={ico("M9 6v12M15 6v12")} />
            <Toggle on={!enabled} onChange={() => toggle()} label="Mute sounds" hint="Silence all sound effects" icon={ico("M4 10h3l5-4v12l-5-4H4zM16 9l5 6M21 9l-5 6")} />
            <Toggle on={prefs.guide} onChange={(v) => set({ guide: v })} label="Reading guide" hint="A line that follows your pointer" icon={ico("M3 12h18M3 8h18M3 16h18")} />
            <Toggle on={prefs.cursor} onChange={(v) => set({ cursor: v })} label="Big cursor" hint="Easier to see pointer" icon={ico("M6 3l12 9-5 1 3 6-3 1-3-6-4 4z")} />
            <Toggle on={prefs.mono} onChange={(v) => set({ mono: v })} label="Reduce colour" hint="Softer, low-saturation view" icon={ico("M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z")} />
          </div>

          <div className="a11y__foot">
            <button type="button" className="a11y__reset" onClick={reset} disabled={!changed}>
              Reset all
            </button>
            <Link href="/accessibility" onClick={() => setOpen(false)}>
              Accessibility statement
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
