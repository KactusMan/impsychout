// Mobile menu
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("mobile-menu");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
  menu.hidden = open;
});
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) toggle.click();
});

// Approach folder tabs (WAI-ARIA tabs pattern)
document.querySelectorAll("[data-tabs]").forEach((root) => {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (step) {
        e.preventDefault();
        select(tabs[(i + step + tabs.length) % tabs.length], true);
      } else if (e.key === "Home") {
        e.preventDefault();
        select(tabs[0], true);
      } else if (e.key === "End") {
        e.preventDefault();
        select(tabs[tabs.length - 1], true);
      }
    });
  });
});

// Reveal sections as they scroll in
const revealTargets = document.querySelectorAll(
  ".section-head, .card, .step, .paper-sheet, .sticky-note, .feed .polaroid, .notebook, .about__copy, .folders, .intake, .book__intro"
);
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
}

// Intake form — front-end only for now.
// TODO: connect to a real inbox (e.g. Formspree, Resend, or a Vercel function) before launch.
const form = document.getElementById("intake");
const msg = form.querySelector(".form-msg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let firstBad = null;
  form.querySelectorAll("[required]").forEach((field) => {
    const bad = !field.value.trim() || (field.type === "email" && !field.validity.valid);
    field.setAttribute("aria-invalid", String(bad));
    if (bad && !firstBad) firstBad = field;
  });
  if (firstBad) {
    msg.className = "form-msg is-err";
    msg.textContent = "Please add your name and a valid email so I can reach you.";
    firstBad.focus();
    return;
  }
  const name = form.elements.name.value.trim().split(" ")[0];
  msg.className = "form-msg is-ok";
  msg.textContent = `thank you, ${name} ♡ I'll be in touch within one working day.`;
  form.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
