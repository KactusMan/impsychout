"use client";

import { useEffect, useMemo, useState } from "react";
import type { Copy } from "@/lib/copy";

// Safe Haven: edit every piece of text on the site. Fields are generated from the content model,
// so new sections show up here automatically. Technical values (icons, colours, links) are hidden.

const HIDDEN = new Set(["id", "slug", "icon", "color", "tone", "src", "related", "approaches"]);

const SECTIONS: { key: keyof Copy; label: string; where: string }[] = [
  { key: "hero", label: "Top of the page", where: "The first thing visitors see" },
  { key: "untangle", label: "Untangling it, together", where: "The thread of thoughts" },
  { key: "about", label: "About & the cats", where: "About my practice" },
  { key: "care", label: "Specialised care", where: "The care cards heading" },
  { key: "services", label: "Service pages", where: "Each service card and its own page" },
  { key: "approach", label: "How I work", where: "The file folder" },
  { key: "process", label: "What to expect", where: "The four-step carousel" },
  { key: "credentials", label: "Credentials", where: "Training and experience" },
  { key: "kindWords", label: "Kind words", where: "Letters in envelopes" },
  { key: "feed", label: "Instagram", where: "Fresh from the feed" },
  { key: "faq", label: "FAQ", where: "Before you reach out" },
  { key: "booking", label: "Booking form", where: "Request a consultation" },
  { key: "footer", label: "Footer", where: "Bottom of every page" },
  { key: "site", label: "Search & sharing", where: "Google results and link previews" },
];

const human = (k: string) =>
  k
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/\bQ\b/, "Question")
    .replace(/\bA\b/, "Answer")
    .replace(/\bH1\b/i, "Page heading")
    .replace(/Meta title/i, "Google title")
    .replace(/Meta description/i, "Google description");

type J = unknown;
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const blankLike = (v: J): J => {
  if (typeof v === "string") return "";
  if (Array.isArray(v)) return v.length && typeof v[0] === "string" ? [""] : [];
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, HIDDEN.has(k) ? x : blankLike(x)]));
  return v;
};
const preview = (v: J) => {
  if (v && typeof v === "object") {
    const s = Object.entries(v as Record<string, J>).find(([k, x]) => !HIDDEN.has(k) && typeof x === "string" && x);
    if (s) return String(s[1]).slice(0, 60);
  }
  return "";
};

function Field({ name, value, onChange, path }: { name: string; value: J; onChange: (v: J) => void; path: string }) {
  if (HIDDEN.has(name)) return null;

  if (typeof value === "string") {
    const long = value.length > 70 || /body|lead|answer|quote|description|paragraph|sub|note|crisis|consent|reframe|short|sessions|\ba\b/i.test(name);
    const id = `f-${path}`;
    return (
      <label className="sh-field" htmlFor={id}>
        <span>{human(name)}</span>
        {long ? (
          <textarea id={id} value={value} rows={Math.min(8, Math.max(2, Math.ceil(value.length / 70)))} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </label>
    );
  }

  if (Array.isArray(value)) {
    const list = value as J[];
    const set = (i: number, v: J) => onChange(list.map((x, j) => (j === i ? v : x)));
    const move = (i: number, d: number) => {
      const next = [...list];
      const [x] = next.splice(i, 1);
      next.splice(i + d, 0, x);
      onChange(next);
    };
    const remove = (i: number) => {
      if (confirm("Remove this item?")) onChange(list.filter((_, j) => j !== i));
    };
    const add = () => onChange([...list, list.length ? blankLike(list[list.length - 1]) : ""]);
    return (
      <fieldset className="sh-list">
        <legend>{human(name)}</legend>
        {list.map((item, i) => (
          <div className={typeof item === "object" ? "sh-item" : "sh-item sh-item--inline"} key={i}>
            {typeof item === "object" ? (
              <details open={list.length <= 4}>
                <summary>
                  <span className="sh-item__num">{i + 1}</span> {preview(item) || "New item"}
                </summary>
                <Field name="" value={item} onChange={(v) => set(i, v)} path={`${path}-${i}`} />
              </details>
            ) : (
              <Field name={`${human(name)} ${i + 1}`} value={item} onChange={(v) => set(i, v)} path={`${path}-${i}`} />
            )}
            <div className="sh-item__tools">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label="Move down">↓</button>
              <button type="button" onClick={() => remove(i)} aria-label="Remove">✕</button>
            </div>
          </div>
        ))}
        <button type="button" className="sh-btn sh-btn--ghost" onClick={add}>
          + Add another
        </button>
      </fieldset>
    );
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, J>;
    const inner = Object.entries(obj).map(([k, v]) => (
      <Field key={k} name={k} value={v} path={`${path}-${k}`} onChange={(nv) => onChange({ ...obj, [k]: nv })} />
    ));
    return name ? (
      <fieldset className="sh-group">
        <legend>{human(name)}</legend>
        {inner}
      </fieldset>
    ) : (
      <>{inner}</>
    );
  }
  return null;
}

type Insights = { ga4Tag: boolean; ga4Api: boolean; searchConsole: boolean; ads: boolean };

export function Dashboard({ initial, defaults, storage, insights }: { initial: Copy; defaults: Copy; storage: boolean; insights: Insights }) {
  const [copy, setCopy] = useState<Copy>(() => clone(initial));
  const [saved, setSaved] = useState<string>(() => JSON.stringify(initial));
  const [tab, setTab] = useState<"text" | "insights">("text");
  const [section, setSection] = useState<keyof Copy>("hero");
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "ok" | "error"; text?: string }>({ kind: "idle" });
  const dirty = useMemo(() => JSON.stringify(copy) !== saved, [copy, saved]);
  const meta = SECTIONS.find((s) => s.key === section)!;

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setStatus({ kind: "saving" });
    const res = await fetch("/api/safehaven/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(copy) });
    if (res.ok) {
      setSaved(JSON.stringify(copy));
      setStatus({ kind: "ok", text: "Saved. Your changes are live." });
    } else if (res.status === 503) {
      setStatus({ kind: "error", text: "Storage isn't connected yet, so changes can't be saved. Connect a Vercel Blob store to this project." });
    } else if (res.status === 401) {
      setStatus({ kind: "error", text: "Your session has ended. Sign in again (copy anything you need first)." });
    } else {
      setStatus({ kind: "error", text: "Couldn't save. Please try again." });
    }
  }

  async function logout() {
    if (dirty && !confirm("You have unsaved changes. Sign out anyway?")) return;
    await fetch("/api/safehaven/logout", { method: "POST" });
    window.location.href = "/safehaven/login";
  }

  return (
    <div className="sh-app">
      <header className="sh-top">
        <div className="sh-top__brand">
          <span className="sh-brand">im psych out</span>
          <b>Safe Haven</b>
        </div>
        <nav className="sh-tabs" aria-label="Safe Haven">
          <button type="button" aria-pressed={tab === "text"} onClick={() => setTab("text")}>
            Website text
          </button>
          <button type="button" aria-pressed={tab === "insights"} onClick={() => setTab("insights")}>
            Insights
          </button>
        </nav>
        <div className="sh-top__actions">
          <a href="/" target="_blank" rel="noopener" className="sh-btn sh-btn--ghost">
            View site ↗
          </a>
          <button type="button" className="sh-btn sh-btn--ghost" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      {!storage && (
        <div className="sh-alert sh-alert--wide">
          <b>Saving isn&apos;t switched on yet.</b> You can look around, but changes won&apos;t save until a Vercel Blob
          store is connected to this project.
        </div>
      )}

      {tab === "text" ? (
        <div className="sh-body">
          <aside className="sh-side" aria-label="Sections">
            {SECTIONS.map((s) => (
              <button key={s.key} type="button" aria-current={section === s.key} onClick={() => setSection(s.key)}>
                <b>{s.label}</b>
                <span>{s.where}</span>
              </button>
            ))}
          </aside>

          <main className="sh-main">
            <div className="sh-main__head">
              <div>
                <h1>{meta.label}</h1>
                <p className="sh-muted">
                  {meta.where}. Tip: write <code>**like this**</code> to make words bold.
                </p>
              </div>
              <button
                type="button"
                className="sh-btn sh-btn--ghost"
                onClick={() => {
                  if (confirm(`Put "${meta.label}" back to the original text?`)) setCopy((c) => ({ ...c, [section]: clone(defaults[section]) }));
                }}
              >
                Restore original
              </button>
            </div>
            <div className="sh-fields">
              <Field name="" value={copy[section]} path={String(section)} onChange={(v) => setCopy((c) => ({ ...c, [section]: v }))} />
            </div>
          </main>
        </div>
      ) : (
        <InsightsPanel insights={insights} />
      )}

      <div className={`sh-savebar${dirty || status.kind !== "idle" ? " is-on" : ""}`} role="status" aria-live="polite">
        <span>
          {status.kind === "saving" ? "Saving..." : status.text && !dirty ? status.text : dirty ? "You have unsaved changes." : status.text}
        </span>
        <div>
          {dirty && (
            <button type="button" className="sh-btn sh-btn--ghost" onClick={() => setCopy(JSON.parse(saved))}>
              Discard
            </button>
          )}
          <button type="button" className="sh-btn sh-btn--primary" onClick={save} disabled={!dirty || status.kind === "saving"}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Status({ on }: { on: boolean }) {
  return <span className={`sh-pill${on ? " sh-pill--on" : ""}`}>{on ? "Connected" : "Not connected yet"}</span>;
}

function InsightsPanel({ insights }: { insights: Insights }) {
  return (
    <main className="sh-insights">
      <h1>Insights</h1>
      <p className="sh-muted">Once the website has its own domain, visitor numbers and Google search results will show here.</p>
      <div className="sh-cards">
        <section className="sh-card">
          <h2>Visitors (Google Analytics 4)</h2>
          <Status on={insights.ga4Api} />
          <div className="sh-placeholder" aria-hidden="true">
            <span style={{ height: "40%" }} />
            <span style={{ height: "65%" }} />
            <span style={{ height: "52%" }} />
            <span style={{ height: "80%" }} />
            <span style={{ height: "70%" }} />
            <span style={{ height: "90%" }} />
            <span style={{ height: "75%" }} />
          </div>
          <p>Visitors, top pages, where people come from, and how many consultation requests are sent.</p>
          <ul className="sh-steps">
            <li className={insights.ga4Tag ? "is-done" : ""}>Tracking tag on the site (NEXT_PUBLIC_GA4_ID)</li>
            <li className={insights.ga4Api ? "is-done" : ""}>Reporting access for this dashboard (GA4_PROPERTY_ID + a Google service account)</li>
          </ul>
        </section>
        <section className="sh-card">
          <h2>Google Search (Search Console)</h2>
          <Status on={insights.searchConsole} />
          <div className="sh-placeholder sh-placeholder--line" aria-hidden="true" />
          <p>How often the site appears in Google, which searches find it, and clicks from search results.</p>
          <ul className="sh-steps">
            <li>Verify the new domain in Search Console</li>
            <li className={insights.searchConsole ? "is-done" : ""}>Give the same service account access (GSC_SITE_URL)</li>
          </ul>
        </section>
        <section className="sh-card">
          <h2>Adverts (Google Ads)</h2>
          <Status on={insights.ads} />
          <p>Ads only measure visitors who allow advertising cookies, as the cookie banner requires.</p>
          <ul className="sh-steps">
            <li className={insights.ads ? "is-done" : ""}>Conversion tag (NEXT_PUBLIC_GOOGLE_ADS_ID)</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
