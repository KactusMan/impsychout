"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/content";
import { GumButton } from "./GumButton";
import { useSound } from "./SoundProvider";
import { Doodle } from "./Doodles";

export function Header() {
  const header = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const { enabled, toggle } = useSound();

  // Scroll handling without React re-renders: read scrollY once per frame and write data
  // attributes plus one transform. The bar only hides or shows after 48px of travel in one
  // direction, so the small movements when scrolling stops can't make it bounce.
  useEffect(() => {
    let lastY = window.scrollY;
    let travel = 0;
    let ticking = false;
    const el = header.current!;
    const progress = el.querySelector<HTMLElement>(".site-header__progress")!;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
      el.dataset.scrolled = y > 24 ? "true" : "false";
      if (y < 240 || openRef.current) el.dataset.hidden = "false";
      else if (travel > 48) el.dataset.hidden = "true";
      else if (travel < -48) el.dataset.hidden = "false";
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently on screen.
  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.href.slice(1))).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    openRef.current = open;
    if (open && header.current) header.current.dataset.hidden = "false";
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const pill = hovered ?? active;

  return (
    <>
      <header ref={header} className="site-header" data-hidden="false" data-scrolled="false">
        <div className="site-header__bar">
          <a className="brand" href="#top" aria-label="ImPsychOut, back to top">
            <span className="brand__sticker">
              <Image src="/images/logo.png" alt="" width={48} height={48} priority />
            </span>
            <span className="brand__text">
              <span className="brand__name">im psych out</span>
              <span className="brand__tag">your safe space to talk</span>
            </span>
          </a>

          <nav className="site-nav" aria-label="Main" onMouseLeave={() => setHovered(null)}>
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`site-nav__link${active === item.href ? " is-active" : ""}`}
                aria-current={active === item.href ? "true" : undefined}
                onMouseEnter={() => setHovered(item.href)}
                onFocus={() => setHovered(item.href)}
                onBlur={() => setHovered(null)}
              >
                {pill === item.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="site-nav__pill"
                    transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="site-nav__label">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            <button
              type="button"
              className={`sound-toggle${enabled ? " is-on" : ""}`}
              onClick={toggle}
              aria-pressed={enabled}
              aria-label={enabled ? "Turn sound effects off" : "Turn sound effects on"}
              title={enabled ? "Sound on" : "Sound off"}
            >
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="sound-toggle__bar" />
              ))}
            </button>
            <GumButton href="#book" className="site-header__cta">
              Book a consultation
            </GumButton>
            <button
              type="button"
              className={`menu-btn${open ? " is-open" : ""}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <div className="site-header__progress" aria-hidden="true" />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <GumButton href="#book" size="lg" block onClick={() => setOpen(false)}>
              Book a consultation
            </GumButton>
            <Doodle name="cat" className="mobile-sheet__cat" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
