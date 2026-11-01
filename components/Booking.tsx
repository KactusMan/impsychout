"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Copy } from "@/lib/copy";
import { services } from "@/lib/services";
import { Rich } from "./Rich";
import { Doodle } from "./Doodles";
import { GumButton } from "./GumButton";
import { Reveal } from "./Reveal";

type Status = { kind: "idle" | "sending" | "ok" | "error" | "offline"; text?: string };

export function Booking({ c, instagram }: { c: Copy["booking"]; instagram: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const bad: Record<string, boolean> = {
      name: !data.name?.trim(),
      email: !/^\S+@\S+\.\S+$/.test(data.email ?? ""),
      consent: data.consent !== "on",
      privacy: data.privacy !== "on",
    };
    setInvalid(bad);
    if (Object.values(bad).some(Boolean)) {
      setStatus({ kind: "error", text: "Please add your name, a valid email, and tick both boxes at the end." });
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 503) {
        setStatus({ kind: "offline" });
        return;
      }
      if (!res.ok) throw new Error();
      setStatus({ kind: "ok", text: c.thanks.replace("{name}", data.name.trim().split(" ")[0]) });
      form.reset();
    } catch {
      setStatus({ kind: "error", text: "Something went wrong sending that. Please try again, or message me on Instagram." });
    }
  }

  return (
    <section className="book section--sky" id="book" aria-labelledby="book-title">
      <div className="wave wave--top" aria-hidden="true" />
      <div className="container book__grid">
        <div className="book__intro">
          <Reveal>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="display h2" id="book-title">
              {c.titleStart} <em>{c.titleEmphasis}</em> {c.titleEnd}{" "}
              <Doodle name="sparkle" className="ico ico--lg" style={{ color: "var(--cornflower)" }} />
            </h2>
            <p>
              <Rich text={c.body} />
            </p>
          </Reveal>
          <Reveal className="note book__note" rotate={-1.5} delay={0.15}>
            <span className="tape tape--blue" style={{ ["--r" as string]: "-5deg", top: -12, left: 24 }} />
            <p>
              <Rich text={c.note} />
            </p>
          </Reveal>
          <p className="crisis">
            <Rich text={c.crisis} />
          </p>
        </div>

        <Reveal>
          <form className="intake" onSubmit={onSubmit} noValidate aria-describedby="intake-help">
            <span className="tape tape--pink" style={{ ["--r" as string]: "3deg", top: -12, right: 60 }} />
            <h3 className="display">{c.formTitle}</h3>
            <p id="intake-help" className="intake__help">{c.required}</p>

            {/* honeypot: hidden from people, tempting to bots */}
            <label className="hp" aria-hidden="true">
              Company <input name="company" tabIndex={-1} autoComplete="off" />
            </label>

            <div className="field-row">
              <label className="field">
                <span>Full name *</span>
                <input name="name" required autoComplete="name" placeholder="e.g. Alex Morgan" aria-invalid={invalid.name || undefined} />
              </label>
              <label className="field">
                <span>Pronouns</span>
                <input name="pronouns" placeholder="e.g. they/them, she/her" />
              </label>
            </div>
            <div className="field-row">
              <label className="field">
                <span>Email *</span>
                <input name="email" type="email" required autoComplete="email" placeholder="name@domain.com" aria-invalid={invalid.email || undefined} />
              </label>
              <label className="field">
                <span>WhatsApp / phone</span>
                <input name="phone" type="tel" autoComplete="tel" placeholder="+44 or +92 number" />
              </label>
            </div>
            <div className="field-row">
              <label className="field">
                <span>Who is this for?</span>
                <select name="for" defaultValue="Myself">
                  <option>Myself</option>
                  <option>My child (under 18)</option>
                  <option>Someone I care for</option>
                </select>
              </label>
              <label className="field">
                <span>What would you like help with?</span>
                <select name="focus" defaultValue="Not sure yet">
                  <option>Not sure yet</option>
                  {services.map((s) => (
                    <option key={s.slug}>{s.name}</option>
                  ))}
                  <option>Something else</option>
                </select>
              </label>
            </div>
            <label className="field">
              <span>Briefly, what brings you here? (optional)</span>
              <textarea name="message" rows={4} placeholder="Share only as much as you feel comfortable with..." />
            </label>
            <label className={`check${invalid.consent ? " is-invalid" : ""}`}>
              <input type="checkbox" name="consent" aria-invalid={invalid.consent || undefined} />
              <span>{c.consent}</span>
            </label>
            <label className={`check${invalid.privacy ? " is-invalid" : ""}`}>
              <input type="checkbox" name="privacy" aria-invalid={invalid.privacy || undefined} />
              <span>
                {c.privacyConsent.split("Privacy Policy").map((part, i) => (
                  <span key={i}>
                    {i > 0 && (
                      <a href="/privacy" target="_blank" rel="noopener">
                        Privacy Policy
                      </a>
                    )}
                    {part}
                  </span>
                ))}
              </span>
            </label>

            <GumButton type="submit" size="lg" block disabled={status.kind === "sending"}>
              {status.kind === "sending" ? "Sending..." : c.button}
            </GumButton>

            <AnimatePresence mode="wait">
              {status.kind !== "idle" && status.kind !== "sending" && (
                <motion.p
                  key={status.kind}
                  className={`form-msg form-msg--${status.kind}`}
                  role="status"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {status.kind === "offline" ? (
                    <>
                      Online requests are opening soon. For now, please{" "}
                      <a href={instagram} target="_blank" rel="noopener noreferrer">
                        message me on Instagram
                      </a>
                      .
                    </>
                  ) : (
                    status.text
                  )}
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
