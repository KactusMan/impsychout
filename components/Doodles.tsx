import type { CSSProperties } from "react";
import type { DoodleName } from "@/lib/content";

// Hand-drawn strokes, rendered once as a sprite and reused with <Doodle name="..." />.
export function DoodleSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="d-star" viewBox="0 0 48 48"><path d="M24 4.5c1.8 6.5 3.4 11.7 5.6 14.2 3.2.4 8.7.6 14 1.2-4.3 3.6-8.5 6.6-10.4 9.4 1.2 5 2.7 9.6 3.9 14.3-4.6-2.8-8.6-5.6-13.3-7.9-4.7 2.6-8.8 5.4-13.2 8.3 1.4-5 2.7-9.8 3.7-14.3-3.6-3.3-7.3-6.2-10.7-9.6 5.2-.6 10.3-.8 14.4-1.5 2.2-4.6 4-9.4 6-14.1Z" fill="currentColor" stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round" /></symbol>
        <symbol id="d-sparkle" viewBox="0 0 40 40"><path d="M20 3c.8 8.5 3.6 14 16 17-12.4 2.7-15.2 8.4-16 17-1.1-8.6-3.9-14.2-16-17 12.2-3 15-8.5 16-17Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /></symbol>
        <symbol id="d-heart" viewBox="0 0 48 44"><path d="M24 40C13 31 4.5 24 5 14.5 5.4 7.8 11 4 16.2 5c3.6.7 6 3.3 7.8 6.6 1.9-3.4 4.6-6.2 8.5-6.8C38 4 43.6 8.6 43 15.4 42.2 24.5 33.8 31.4 24 40Z" fill="currentColor" stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round" /></symbol>
        <symbol id="d-flower" viewBox="0 0 48 48"><g fill="currentColor" stroke="var(--ink)" strokeWidth="2"><circle cx="24" cy="11" r="8" /><circle cx="36.5" cy="20" r="8" /><circle cx="32" cy="35" r="8" /><circle cx="16" cy="35" r="8" /><circle cx="11.5" cy="20" r="8" /></g><circle cx="24" cy="24" r="6" fill="var(--butter)" stroke="var(--ink)" strokeWidth="2" /></symbol>
        <symbol id="d-cat" viewBox="0 0 64 56"><path d="M12 22 9 5l13 9c6-2 14-2 20 0l13-9-3 17c3 4 4 8 4 12 0 12-11 18-24 18S8 46 8 34c0-4 1-8 4-12Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.6" strokeLinejoin="round" /><path d="M22 30c1.5-1.6 3.5-1.6 5 0M37 30c1.5-1.6 3.5-1.6 5 0" fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" /><path d="M30 36.5h4l-2 2.2Z" fill="var(--pink)" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" /><path d="M32 38.7c-.5 2.5-3 3.4-5 2.3M32 38.7c.5 2.5 3 3.4 5 2.3M4 33l11 1M5 39l10-2M60 33l-11 1M59 39l-10-2" fill="none" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" /><circle cx="19" cy="37" r="2.6" fill="var(--pink)" /><circle cx="45" cy="37" r="2.6" fill="var(--pink)" /></symbol>
        <symbol id="d-arrow" viewBox="0 0 120 70"><path d="M6 52C22 18 52 6 70 24c10 10 0 26-10 18-9-7 4-26 22-26 14 0 26 8 32 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /><path d="M103 30l11 6-3-12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="d-squiggle" viewBox="0 0 160 20"><path d="M3 12c10-10 18-10 26 0s16 10 26 0 18-10 26 0 16 10 26 0 18-10 26 0 16 6 24-2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></symbol>
        <symbol id="d-plane" viewBox="0 0 64 48"><path d="M4 22 60 4 44 44 32 30Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" /><path d="M60 4 32 30l-2 12 8-8" fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" /></symbol>
        <symbol id="d-cloud" viewBox="0 0 80 48"><path d="M18 40c-8 0-13-5-13-11 0-7 6-11 12-10 1-8 8-13 16-12 6 1 10 5 12 10 3-3 7-4 11-3 7 2 10 8 9 14 6 1 9 5 8 9-1 3-4 4-7 4Z" fill="currentColor" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" /></symbol>
        <symbol id="d-butterfly" viewBox="0 0 64 52"><path d="M31 18C24 6 12 2 7 6s0 16 9 19c-8 2-11 10-7 15 5 5 15 0 21-11M33 18C40 6 52 2 57 6s0 16-9 19c8 2 11 10 7 15-5 5-15 0-21-11" fill="currentColor" stroke="var(--ink)" strokeWidth="2.2" strokeLinejoin="round" /><path d="M32 14v28M32 14l-5-9M32 14l5-9" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" /></symbol>
        <symbol id="d-loop" viewBox="0 0 100 60"><path d="M4 40c18 2 30-6 34-18 3-10-6-16-12-9-8 9 6 26 24 26 20 0 34-12 46-30" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></symbol>
        <symbol id="d-circle" viewBox="0 0 220 80" preserveAspectRatio="none"><path d="M120 6C60 2 10 14 6 38c-3 22 48 36 106 36s102-12 102-36C214 16 170 6 104 10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></symbol>
        <symbol id="d-underline" viewBox="0 0 200 16" preserveAspectRatio="none"><path d="M4 11c40-6 90-8 140-6 18 1 34 2 52 4" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></symbol>
        <symbol id="d-sun" viewBox="0 0 64 64"><circle cx="32" cy="32" r="11" fill="currentColor" stroke="var(--ink)" strokeWidth="2.4" /><path d="M32 5v9M32 50v9M5 32h9M50 32h9M13 13l6 6M45 45l6 6M13 51l6-6M45 19l6-6" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" /></symbol>
      </defs>
    </svg>
  );
}

export function Doodle({
  name,
  className,
  style,
  title,
}: {
  name: DoodleName | "circle" | "underline";
  className?: string;
  style?: CSSProperties;
  title?: string;
}) {
  return (
    <svg className={className} style={style} aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title ? <title>{title}</title> : null}
      <use href={`#d-${name}`} />
    </svg>
  );
}
