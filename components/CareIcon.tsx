import type { DoodleName } from "@/lib/content";

// Hand-drawn icons for the care cards, built from separate parts so each one can come
// alive on hover: the sun radiates, the cloud breathes, the loop gets wigglier, the
// butterfly flaps, the heart beats, the flower blooms, the plane takes off, the star twinkles.
// The animations live in globals.css under `.care-ico`.
const ink = "var(--ink)";

export function CareIcon({ name }: { name: DoodleName }) {
  switch (name) {
    case "sun":
      return (
        <svg className="care-ico care-ico--sun" viewBox="0 0 64 64" aria-hidden="true">
          <g className="care-ico__rays" stroke={ink} strokeWidth="2.6" strokeLinecap="round">
            <path d="M32 4v8M32 52v8M4 32h8M52 32h8M12.2 12.2l5.7 5.7M46.1 46.1l5.7 5.7M12.2 51.8l5.7-5.7M46.1 17.9l5.7-5.7" />
          </g>
          <circle className="care-ico__glow" cx="32" cy="32" r="17" fill="var(--butter)" opacity=".35" />
          <circle cx="32" cy="32" r="11" fill="var(--butter)" stroke={ink} strokeWidth="2.6" />
        </svg>
      );
    case "cloud":
      return (
        <svg className="care-ico care-ico--cloud" viewBox="0 0 80 56" aria-hidden="true">
          <g className="care-ico__puff">
            <path d="M18 44c-8 0-13-5-13-11 0-7 6-11 12-10 1-8 8-13 16-12 6 1 10 5 12 10 3-3 7-4 11-3 7 2 10 8 9 14 6 1 9 5 8 9-1 3-4 4-7 4Z" fill="var(--paper)" stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
          </g>
          <g className="care-ico__rain" stroke="var(--cornflower)" strokeWidth="2.4" strokeLinecap="round">
            <path d="M26 50v4M40 50v4M54 50v4" />
          </g>
        </svg>
      );
    case "loop":
      return (
        <svg className="care-ico care-ico--loop" viewBox="0 0 100 60" aria-hidden="true">
          <path
            className="care-ico__squiggle"
            d="M4 40c18 2 30-6 34-18 3-10-6-16-12-9-8 9 6 26 24 26 20 0 34-12 46-30"
            fill="none"
            stroke={ink}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "butterfly":
      return (
        <svg className="care-ico care-ico--butterfly" viewBox="0 0 64 56" aria-hidden="true">
          <g className="care-ico__wing care-ico__wing--l">
            <path d="M31 22C24 10 12 6 7 10s0 16 9 19c-8 2-11 10-7 15 5 5 15 0 21-11Z" fill="var(--pink)" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          </g>
          <g className="care-ico__wing care-ico__wing--r">
            <path d="M33 22C40 10 52 6 57 10s0 16-9 19c8 2 11 10 7 15-5 5-15 0-21-11Z" fill="var(--sky-deep)" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          </g>
          <path d="M32 18v28M32 18l-5-9M32 18l5-9" fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case "heart":
      return (
        <svg className="care-ico care-ico--heart" viewBox="0 0 48 44" aria-hidden="true">
          <path className="care-ico__beat" d="M24 40C13 31 4.5 24 5 14.5 5.4 7.8 11 4 16.2 5c3.6.7 6 3.3 7.8 6.6 1.9-3.4 4.6-6.2 8.5-6.8C38 4 43.6 8.6 43 15.4 42.2 24.5 33.8 31.4 24 40Z" fill="var(--pink-hot)" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      );
    case "flower":
      return (
        <svg className="care-ico care-ico--flower" viewBox="0 0 48 48" aria-hidden="true">
          <g className="care-ico__petals" fill="var(--paper)" stroke={ink} strokeWidth="2">
            <circle cx="24" cy="11" r="8" />
            <circle cx="36.5" cy="20" r="8" />
            <circle cx="32" cy="35" r="8" />
            <circle cx="16" cy="35" r="8" />
            <circle cx="11.5" cy="20" r="8" />
          </g>
          <circle cx="24" cy="24" r="6" fill="var(--butter)" stroke={ink} strokeWidth="2" />
        </svg>
      );
    case "plane":
      return (
        <svg className="care-ico care-ico--plane" viewBox="0 0 72 52" aria-hidden="true">
          <path className="care-ico__trail" d="M2 46c10 0 14-8 22-8" fill="none" stroke="var(--cornflower)" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="3 5" />
          <g className="care-ico__craft">
            <path d="M12 26 68 8 52 48 40 34Z" fill="var(--paper)" stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M68 8 40 34l-2 12 8-8" fill="none" stroke={ink} strokeWidth="2.4" strokeLinejoin="round" />
          </g>
        </svg>
      );
    case "star":
    default:
      return (
        <svg className="care-ico care-ico--star" viewBox="0 0 48 48" aria-hidden="true">
          <path className="care-ico__twinkle" d="M24 4.5c1.8 6.5 3.4 11.7 5.6 14.2 3.2.4 8.7.6 14 1.2-4.3 3.6-8.5 6.6-10.4 9.4 1.2 5 2.7 9.6 3.9 14.3-4.6-2.8-8.6-5.6-13.3-7.9-4.7 2.6-8.8 5.4-13.2 8.3 1.4-5 2.7-9.8 3.7-14.3-3.6-3.3-7.3-6.2-10.7-9.6 5.2-.6 10.3-.8 14.4-1.5 2.2-4.6 4-9.4 6-14.1Z" fill="var(--butter)" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
          <path className="care-ico__spark" d="M42 4l1.4 3.6L47 9l-3.6 1.4L42 14l-1.4-3.6L37 9l3.6-1.4Z" fill="var(--cornflower)" />
        </svg>
      );
  }
}
