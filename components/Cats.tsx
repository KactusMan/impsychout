// Laraib's cats, drawn from photos: Daisy (fluffy dark grey Persian, amber eyes)
// and Pumpkin (long-haired cream-ginger, green eyes). Quiet touches, not mascots.

// `line` is the colour of closed eyes and the mouth, picked to show on that coat.
type Coat = { fur: string; light: string; dark: string; line: string; eye: string; nose: string; stripes: boolean };

export const COATS: Record<"daisy" | "pumpkin", Coat> = {
  daisy: { fur: "#575b68", light: "#7c8190", dark: "#3c3f4a", line: "#c3c8d3", eye: "#d6a056", nose: "#2f313a", stripes: false },
  pumpkin: { fur: "#e8c294", light: "#f6e3c6", dark: "#cf9f6c", line: "#9a6b47", eye: "#93ab78", nose: "#d98c8c", stripes: true },
};

// A soft, scalloped outline so the fur looks fluffy rather than vector-perfect.
function fluffy(cx: number, cy: number, rx: number, ry: number, bumps: number, depth: number, start = 0, end = Math.PI * 2) {
  const pts: string[] = [];
  const span = end - start;
  for (let i = 0; i <= bumps; i++) {
    const a = start + (span * i) / bumps;
    const mid = start + (span * (i - 0.5)) / bumps;
    const x = cx + Math.cos(a) * rx;
    const y = cy + Math.sin(a) * ry;
    if (i === 0) {
      pts.push(`M${x.toFixed(1)} ${y.toFixed(1)}`);
      continue;
    }
    const qx = cx + Math.cos(mid) * (rx + depth);
    const qy = cy + Math.sin(mid) * (ry + depth);
    pts.push(`Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ") + (span >= Math.PI * 2 - 0.01 ? "Z" : "");
}

/** A cat sitting upright, facing you. Eyes blink and the tail flicks when the parent is hovered. */
export function SittingCat({ coat, className, title }: { coat: Coat; className?: string; title?: string }) {
  const c = coat;
  return (
    <svg viewBox="0 0 140 150" className={`cat ${className ?? ""}`} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {/* tail */}
      <g className="cat__tail">
        <path d="M98 128c22 2 34-10 32-28-1-12-10-18-17-14" fill="none" stroke={c.fur} strokeWidth="15" strokeLinecap="round" />
        <path d="M98 128c22 2 34-10 32-28-1-12-10-18-17-14" fill="none" stroke={c.light} strokeWidth="4" strokeLinecap="round" opacity=".35" />
      </g>
      {/* body */}
      <path d={fluffy(70, 112, 40, 32, 22, 4)} fill={c.fur} />
      <path d={fluffy(70, 104, 20, 24, 12, 3)} fill={c.light} opacity=".75" />
      {c.stripes && (
        <g fill="none" stroke={c.dark} strokeWidth="3" strokeLinecap="round" opacity=".45">
          <path d="M38 104c4 3 8 3 11 1M36 116c4 3 9 3 12 0M102 104c-4 3-8 3-11 1M104 116c-4 3-9 3-12 0" />
        </g>
      )}
      {/* paws */}
      <ellipse cx="56" cy="141" rx="10" ry="6" fill={c.light} />
      <ellipse cx="84" cy="141" rx="10" ry="6" fill={c.light} />
      {/* ears */}
      <path d="M38 40 34 14l22 14Z" fill={c.fur} />
      <path d="M102 40l4-26-22 14Z" fill={c.fur} />
      <path d="M40 34 38 20l11 8Z" fill={c.nose} opacity=".55" />
      <path d="M100 34l2-14-11 8Z" fill={c.nose} opacity=".55" />
      {/* head with cheek ruff */}
      <path d={fluffy(70, 56, 40, 34, 26, 4.5)} fill={c.fur} />
      <path d={fluffy(70, 66, 24, 16, 14, 2.5)} fill={c.light} opacity=".7" />
      {c.stripes && <path d="M62 28c2 6 2 10 0 14M70 26v16M78 28c-2 6-2 10 0 14" fill="none" stroke={c.dark} strokeWidth="2.6" strokeLinecap="round" opacity=".5" />}
      {/* eyes */}
      <g className="cat__eyes">
        <ellipse cx="54" cy="56" rx="7" ry="7.5" fill={c.eye} />
        <ellipse cx="86" cy="56" rx="7" ry="7.5" fill={c.eye} />
        <ellipse cx="54" cy="57" rx="2.6" ry="5.6" fill="#1d1f26" />
        <ellipse cx="86" cy="57" rx="2.6" ry="5.6" fill="#1d1f26" />
        <circle cx="56.4" cy="53.6" r="1.6" fill="#fff" />
        <circle cx="88.4" cy="53.6" r="1.6" fill="#fff" />
      </g>
      {/* nose, mouth, whiskers */}
      <path d="M66 66h8l-4 4.4Z" fill={c.nose} />
      <path d="M70 70.5c-1 3.6-5 4.6-7.6 2.6M70 70.5c1 3.6 5 4.6 7.6 2.6" fill="none" stroke={c.line} strokeWidth="1.6" strokeLinecap="round" />
      <g stroke={c.light} strokeWidth="1.1" strokeLinecap="round" opacity=".8">
        <path d="M44 68l-20-2M44 72l-19 4M96 68l20-2M96 72l19 4" />
      </g>
    </svg>
  );
}

/** A cat curled up asleep, as cats do. */
export function SleepingCat({ coat, className, flip }: { coat: Coat; className?: string; flip?: boolean }) {
  const c = coat;
  return (
    <svg viewBox="0 0 150 80" className={`cat cat--sleep ${className ?? ""}`} aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <g className="cat__breathe">
        <path d={fluffy(78, 50, 60, 26, 30, 4)} fill={c.fur} />
        {c.stripes && (
          <g fill="none" stroke={c.dark} strokeWidth="3" strokeLinecap="round" opacity=".4">
            <path d="M70 28c2 6 2 12 0 18M86 28c2 6 2 12 0 18M102 32c2 5 2 10 0 15" />
          </g>
        )}
        {/* tail wrapped round the front */}
        <path d="M134 56c-4 14-30 20-62 18" fill="none" stroke={c.fur} strokeWidth="13" strokeLinecap="round" />
        <path d="M134 56c-4 14-30 20-62 18" fill="none" stroke={c.light} strokeWidth="3.5" strokeLinecap="round" opacity=".35" />
        {/* head tucked in */}
        <path d="M24 34 22 16l14 10Z" fill={c.fur} />
        <path d="M46 30l6-16 6 16Z" fill={c.fur} />
        <path d={fluffy(38, 44, 24, 20, 18, 3.5)} fill={c.fur} />
        <path d={fluffy(36, 52, 13, 8, 10, 2)} fill={c.light} opacity=".7" />
        <path d="M26 44c2.4 2 5 2 7 0M42 44c2.4 2 5 2 7 0" fill="none" stroke={c.line} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M35 50h5l-2.5 2.6Z" fill={c.nose} />
        <ellipse cx="22" cy="66" rx="9" ry="5" fill={c.light} />
      </g>
    </svg>
  );
}
