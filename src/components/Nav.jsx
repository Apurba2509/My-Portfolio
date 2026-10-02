import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap";
import { getLenis, handleAnchor, scrollToTarget } from "../lib/smooth";
import { nav, site, socials } from "../data/content";
import LocalTime from "./LocalTime";
import { Arrow } from "./Icons";

const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function ScrambleLink({ href, label }) {
  const text = useRef(null);
  const scramble = () => {
    if (reducedMotion()) return;
    gsap.to(text.current, {
      duration: 0.6,
      scrambleText: { text: label, chars: SCRAMBLE, speed: 0.6 },
      overwrite: true,
    });
  };
  return (
    <a href={href} onClick={handleAnchor} onPointerEnter={scramble} onFocus={scramble} className="inline-block py-1">
      <span ref={text}>{label}</span>
    </a>
  );
}

// The nav takes its colours from the section under it, hides while you scroll down,
// and comes back with a solid bar when you scroll up, so page content never runs into it.
const SKINS = {
  dark: { text: "text-bone", bar: "bg-ink" },
  light: { text: "text-ink", bar: "bg-bone" },
  taxi: { text: "text-ink", bar: "bg-taxi" },
};

function useNavState(header) {
  const [state, setState] = useState({ theme: "dark", hidden: false, solid: false });

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    let current = { theme: "dark", hidden: false, solid: false };
    const check = () => {
      frame = 0;
      const y = window.scrollY;
      const below = document.elementsFromPoint(24, 32).find((el) => !header.current?.contains(el));
      const theme = below?.closest("[data-theme]")?.dataset.theme ?? current.theme;
      let hidden = current.hidden;
      if (y > lastY + 6 && y > 160) hidden = true;
      else if (y < lastY - 6 || y < 160) hidden = false;
      lastY = y;
      const next = { theme, hidden, solid: y > 40 };
      if (next.theme !== current.theme || next.hidden !== current.hidden || next.solid !== current.solid) {
        current = next;
        setState(next);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [header]);

  return state;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  const header = useRef(null);
  const { theme, hidden, solid } = useNavState(header);
  const skin = SKINS[theme] ?? SKINS.dark;

  return (
    <>
      <header
        ref={header}
        className={`fixed inset-x-0 top-0 z-50 transition-[translate,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:translate-y-0 ${skin.text} ${solid ? skin.bar : "bg-transparent"} ${hidden && !open ? "-translate-y-full" : ""}`}
      >
        <nav aria-label="Primary" className="label grid grid-cols-2 items-start gap-6 px-5 py-4 md:grid-cols-12 md:px-10 md:py-5">
          <a href="#top" onClick={handleAnchor} className="col-span-1 py-1 md:col-span-3">
            {site.name}
            <sup className="ml-0.5 text-[0.6em]">©26</sup>
          </a>
          <p className="hidden py-1 whitespace-nowrap md:col-span-3 lg:block">
            {site.location.split(",")[0]} — <LocalTime />
          </p>
          <ul className="hidden justify-end gap-7 md:col-span-9 md:flex lg:col-span-6">
            {nav.map((link) => (
              <li key={link.href}>
                <ScrambleLink {...link} />
              </li>
            ))}
          </ul>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu"
            className="label justify-self-end py-1 md:hidden"
          >
            Menu +
          </button>
        </nav>
      </header>
      <MobileMenu
        open={open}
        onClose={() => {
          setOpen(false);
          menuButton.current?.focus();
        }}
      />
    </>
  );
}

function MobileMenu({ open, onClose }) {
  const root = useRef(null);
  const closeButton = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      if (open) {
        getLenis()?.stop();
        gsap.set(el, { visibility: "visible" });
        gsap
          .timeline()
          .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" })
          .fromTo("[data-menu-link]", { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06 }, "-=0.35");
        closeButton.current?.focus();
      } else if (el.style.visibility === "visible") {
        getLenis()?.start();
        gsap.to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.6,
          ease: "expo.inOut",
          onComplete: () => gsap.set(el, { visibility: "hidden" }),
        });
      }
    },
    { dependencies: [open], scope: root }
  );

  useEffect(() => {
    if (!open) return;
    const key = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, onClose]);

  // Restart Lenis before scrolling: starting it later would cancel the scroll in flight.
  const go = (event, href) => {
    event.preventDefault();
    getLenis()?.start();
    onClose();
    scrollToTarget(href);
    history.replaceState(null, "", href);
  };

  return (
    <div
      ref={root}
      id="menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className="on-taxi fixed inset-0 z-[60] flex flex-col justify-between bg-taxi p-5 text-ink"
      style={{ visibility: "hidden" }}
    >
      <div className="label flex items-start justify-between">
        <span className="py-1">{site.name}</span>
        <button ref={closeButton} type="button" onClick={onClose} className="label py-1">
          Close ×
        </button>
      </div>

      <ul>
        {nav.map((link) => (
          <li key={link.href} className="overflow-clip border-t border-ink/20">
            <a
              data-menu-link
              href={link.href}
              onClick={(e) => go(e, link.href)}
              className="display flex items-baseline justify-between py-1 text-[19vw]"
            >
              {link.label}
              <span className="label">{link.index}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="label flex flex-wrap justify-between gap-x-5 gap-y-2">
        {socials.slice(0, 3).map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="me noreferrer" className="inline-flex items-center gap-1.5 py-1">
            {s.label} <Arrow direction="up-right" />
          </a>
        ))}
        <LocalTime className="py-1" />
      </div>
    </div>
  );
}
