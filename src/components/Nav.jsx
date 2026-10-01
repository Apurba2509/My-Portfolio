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

export default function Nav() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-bone mix-blend-difference">
        <nav
          aria-label="Primary"
          className="label pointer-events-auto grid grid-cols-2 items-start gap-6 px-5 pt-5 md:grid-cols-12 md:px-10 md:pt-6"
        >
          <a href="#top" onClick={handleAnchor} className="col-span-1 py-1 md:col-span-3">
            {site.name}
            <sup className="ml-0.5 text-[0.6em]">©26</sup>
          </a>
          <p className="hidden py-1 md:col-span-3 md:block">
            {site.location.split(",")[0]} — <LocalTime />
          </p>
          <ul className="hidden justify-end gap-7 md:col-span-6 md:flex">
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
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 py-1">
            {s.label} <Arrow direction="up-right" />
          </a>
        ))}
        <LocalTime className="py-1" />
      </div>
    </div>
  );
}
