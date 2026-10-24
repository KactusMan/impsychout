"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { GumButton } from "./GumButton";
import { useSound } from "./SoundProvider";
import { Doodle } from "./Doodles";

export function Header() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { enabled, toggle, play } = useSound();

  // Tuck the header away while reading down the page, bring it back on any scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 320 && y > prev + 4 && !open);
    if (y < prev - 4) setHidden(false);
  });

  // Highlight the section currently on screen.
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
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
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const pill = hovered ?? active;

  return (
    <>
      <motion.header
        className={`site-header${scrolled ? " is-scrolled" : ""}`}
        initial={{ y: -120 }}
        animate={{ y: hidden ? -130 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
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
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="site-nav__label">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            <span className="status" title="Currently taking new clients">
              <span className="status__dot" aria-hidden="true" />
              Accepting new clients
            </span>
            <button
              type="button"
              className={`sound-toggle${enabled ? " is-on" : ""}`}
              onClick={toggle}
              aria-pressed={enabled}
              aria-label={enabled ? "Turn sound effects off" : "Turn sound effects on"}
              title={enabled ? "Sound on" : "Sound off"}
            >
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="sound-toggle__bar" style={{ animationDelay: `${i * 0.13}s` }} />
              ))}
            </button>
            <GumButton href="#book" variant="pink" className="site-header__cta">
              Book a consultation
            </GumButton>
            <button
              type="button"
              className={`menu-btn${open ? " is-open" : ""}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => {
                setOpen((o) => !o);
                play("page", { volume: 0.25 });
              }}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        <motion.div className="site-header__progress" style={{ scaleX: progress }} aria-hidden="true" />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-sheet"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
          >
            <nav aria-label="Mobile">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 300, damping: 24 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <GumButton href="#book" size="lg" block onClick={() => setOpen(false)}>
                Book a consultation
              </GumButton>
            </motion.div>
            <Doodle name="cat" className="mobile-sheet__cat" />
            <Doodle name="star" className="mobile-sheet__star" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
