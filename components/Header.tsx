"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nav } from "@/lib/content";
import { services } from "@/lib/services";
import { CareIcon } from "./CareIcon";
import { GumButton } from "./GumButton";
import { useSound } from "./SoundProvider";
import { Doodle } from "./Doodles";

export function Header() {
  const header = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTimer = useRef<number | undefined>(undefined);
  const { play: playSound } = useSound();
  // Hovering opens the services menu straight away; leaving closes it after a short grace period.
  const openMenu = (on: boolean) => {
    window.clearTimeout(menuTimer.current);
    if (on) {
      setMenuOpen((was) => {
        if (!was) playSound("menu");
        return true;
      });
    } else {
      menuTimer.current = window.setTimeout(() => setMenuOpen(false), 180);
    }
  };
  const openRef = useRef(false);
  const { enabled, toggle } = useSound();

  // Scroll handling without React re-renders: read scrollY once per frame and write a data
  // attribute plus one transform. The bar always stays in view.
  useEffect(() => {
    let ticking = false;
    const el = header.current!;
    const progress = el.querySelector<HTMLElement>(".site-header__progress")!;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      el.dataset.scrolled = y > 24 ? "true" : "false";
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
    const els = nav.map((n) => document.getElementById(n.href.split("#")[1])).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`/#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    openRef.current = open;
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const pill = hovered ?? active;

  return (
    <>
      <header ref={header} className="site-header" data-hidden="false" data-scrolled="false">
        <div className="site-header__bar">
          <a className="brand" href="/" aria-label="ImPsychOut home">
            <span className="brand__sticker">
              <Image src="/images/logo.png" alt="" width={48} height={48} priority />
            </span>
            <span className="brand__text">
              <span className="brand__name">im psych out</span>
              <span className="brand__tag">your safe space to talk</span>
            </span>
          </a>

          <nav className="site-nav" aria-label="Main" onMouseLeave={() => setHovered(null)}>
            {nav.map((item) =>
              item.href === "/#focus" ? (
                <div
                  key={item.href}
                  className={`site-nav__drop${menuOpen ? " is-open" : ""}`}
                  onMouseEnter={() => openMenu(true)}
                  onMouseLeave={() => openMenu(false)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setMenuOpen(false);
                  }}
                >
                  <button
                    type="button"
                    className={`site-nav__link${active === item.href ? " is-active" : ""}`}
                    aria-expanded={menuOpen}
                    aria-controls="services-menu"
                    onClick={() => openMenu(true)}
                    onMouseEnter={() => setHovered(item.href)}
                    onFocus={() => setHovered(item.href)}
                  >
                    {pill === item.href && (
                      <motion.span layoutId="nav-pill" className="site-nav__pill" transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }} />
                    )}
                    <span className="site-nav__label">
                      {item.label}
                      <svg className="site-nav__caret" viewBox="0 0 12 8" aria-hidden="true">
                        <path d="M1.5 1.5 6 6l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        id="services-menu"
                        className="site-menu"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <ul>
                          {services.map((sv) => (
                            <li key={sv.slug}>
                              <Link href={`/services/${sv.slug}`} data-sfx-hover="menu" onClick={() => setMenuOpen(false)}>
                                <span className="site-menu__ico">
                                  <CareIcon name={sv.icon} />
                                </span>
                                <span>{sv.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link href="/services" className="site-menu__all" data-sfx-hover="menu" onClick={() => setMenuOpen(false)}>
                          All services <span aria-hidden="true">→</span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className={`site-nav__link${active === item.href ? " is-active" : ""}`}
                  data-sfx-hover="tick"
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
              )
            )}
          </nav>

          <div className="site-header__actions">
            <button
              type="button"
              className={`sound-toggle${enabled ? " is-on" : ""}`}
              onClick={toggle}
              data-sfx-press="tap"
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
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a href={item.href} className="mobile-sheet__link" onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                  {item.href === "/#focus" && (
                    <ul className="mobile-sheet__sub">
                      {services.map((sv) => (
                        <li key={sv.slug}>
                          <Link href={`/services/${sv.slug}`} onClick={() => setOpen(false)}>
                            {sv.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
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
