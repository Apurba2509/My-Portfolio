import { useEffect, useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION, finePointer } from "../lib/gsap";
import { useReady } from "../lib/ready";
import { hero, site } from "../data/content";
import Avatar from "./Avatar";

export default function Hero() {
  const root = useRef(null);
  const name = useRef(null);
  const intro = useRef(null);
  const ready = useReady();

  // Size the name to span the width (one line on desktop, a word per line on phones),
  // but never so tall that it crowds the rest of the hero on short screens.
  useEffect(() => {
    const h1 = name.current;
    const fit = () => {
      const style = getComputedStyle(h1);
      const available = h1.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const stacked = window.innerWidth < 640;
      h1.style.fontSize = "100px";
      const width = h1.querySelector("[data-fit]").getBoundingClientRect().width;
      const byWidth = (available / width) * 100 * 0.995;
      const byHeight = window.innerHeight * (stacked ? 0.16 : 0.4);
      h1.style.fontSize = `${Math.floor(Math.min(byWidth, byHeight))}px`;
    };
    // Measure only once the real fonts are in. Sizing against the fallback font and again when
    // the web font arrived made the letters jump, which Google counts as layout shift (CLS).
    // The hero stays hidden until then (see .fonts-pending in index.css).
    let ro;
    let cancelled = false;
    const fonts = document.fonts
      ? Promise.all([
          document.fonts.load('850 100px "Archivo Variable"', site.name),
          document.fonts.load('italic 400 40px "Instrument Serif"', "Building apps"),
          document.fonts.load('400 14px "JetBrains Mono Variable"', "Kolkata"),
        ]).catch(() => {})
      : Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, 3000))]).then(() => {
      if (cancelled) return;
      fit();
      document.documentElement.classList.remove("fonts-pending");
      ro = new ResizeObserver(fit);
      ro.observe(root.current);
    });
    return () => {
      cancelled = true;
      ro?.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const chars = SplitText.create(q("[data-word]"), { type: "chars", aria: "none" }).chars;
      const words = SplitText.create(q("[data-statement]"), { type: "words", wordsClass: "st-word", mask: "words", aria: "none" }).words;
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        // Plays when the preloader lifts (see the effect below). Once the letters have risen
        // into place their masks come off, so nothing gets sliced when they move later.
        // Repeat visits skip the loader, and the intro with it: the pre-rendered hero is
        // already on screen, and hiding it just to animate it back in would flicker.
        const unmask = () => gsap.set(q("[data-word]"), { overflow: "visible" });
        if (document.documentElement.classList.contains("skip-intro")) {
          unmask();
        } else {
          intro.current = gsap
            .timeline({ paused: true, onComplete: unmask })
            .from(chars, { yPercent: 118, duration: 1.5, stagger: 0.05, ease: "expo.out" })
            .from(q("[data-meta]"), { y: 18, autoAlpha: 0, duration: 1, stagger: 0.07, ease: "power3.out" }, 0.25)
            .from(words, { yPercent: 118, duration: 1.2, stagger: 0.035, ease: "expo.out" }, 0.3)
            .from(q("[data-sun]"), { scale: 0, duration: 1.6, ease: "expo.out" }, 0.3)
            .from(q("[data-face]"), { yPercent: 18, autoAlpha: 0, duration: 1.6, ease: "expo.out" }, 0.45);
        }

        // Scrolling away: the letters drift up at slightly different speeds and fade.
        const lift = chars.map((_, i) => 0.25 + ((i * 7) % 5) * 0.12);
        const fontPx = () => parseFloat(getComputedStyle(name.current).fontSize);
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          })
          .to(chars, { y: (i) => -lift[i] * fontPx(), ease: "none" }, 0)
          .to(name.current, { autoAlpha: 0.15, ease: "power1.in" }, 0)
          .to(q("[data-statement]"), { y: () => -window.innerHeight * 0.25, autoAlpha: 0, ease: "none" }, 0)
          .to(q("[data-meta-row]"), { y: -60, autoAlpha: 0, ease: "none" }, 0)
          .to(q("[data-avatar-wrap]"), { y: () => -window.innerHeight * 0.18, ease: "none" }, 0);

        if (!finePointer()) return;

        // Letters near the pointer stretch upwards. Positions are read fresh on every move,
        // so it stays accurate however far the page has scrolled.
        gsap.set(chars, { transformOrigin: "50% 100%" });
        const stretch = chars.map((c) => gsap.quickTo(c, "scaleY", { duration: 0.6, ease: "power3" }));
        const move = (e) => {
          chars.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            const d = Math.hypot(e.clientX - (r.left + r.width / 2), (e.clientY - r.bottom) * 0.5);
            stretch[i](1 + Math.max(0, 1 - d / 280) * 0.3);
          });
        };
        const leave = () => stretch.forEach((s) => s(1));
        const h1 = name.current;
        h1.addEventListener("pointermove", move);
        h1.addEventListener("pointerleave", leave);

        return () => {
          h1.removeEventListener("pointermove", move);
          h1.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root }
  );

  useEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  return (
    <section
      id="top"
      ref={root}
      data-theme="dark"
      aria-label="Intro"
      className="relative grid h-[100svh] min-h-[540px] grid-rows-[auto_minmax(0,1fr)_auto] overflow-clip bg-ink text-bone"
    >
      <div data-meta-row className="grid grid-cols-2 gap-x-6 gap-y-4 px-5 pt-20 md:grid-cols-12 md:px-10 md:pt-[clamp(4.5rem,11svh,7rem)]">
        {hero.meta.map((m, i) => (
          <div key={m.k} data-meta className="md:col-span-3">
            <p className="label text-mute">
              ({String(i + 1).padStart(2, "0")}) {m.k}
            </p>
            <p className="mt-1.5 text-[14px] leading-snug md:text-[15px]">{m.v}</p>
          </div>
        ))}
        <div data-meta className="md:col-span-3 md:justify-self-end">
          <p className="label text-mute">(04) Status</p>
          <p className="mt-1.5 flex items-center gap-2 text-[14px] leading-snug md:text-[15px]">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-taxi opacity-70 motion-reduce:animate-none" />
              <span className="relative size-2 rounded-full bg-taxi" />
            </span>
            {site.available}
          </p>
        </div>
      </div>

      <div className="relative flex min-h-0 items-start px-5 pt-4 sm:items-center sm:pt-0 md:px-10">
        <p
          data-statement
          className="serif relative z-10 max-w-[11ch] text-[clamp(2.1rem,min(6.4vw,6.2svh),3.4rem)] leading-[0.98] sm:max-w-[13ch] sm:text-[clamp(2.2rem,min(4.6vw,7.4svh),5.6rem)] lg:max-w-[16ch]"
        >
          Building apps, cloud & communities — from zero to one.
        </p>

        {/* The cartoon me: eyes follow your cursor. Shoulders tuck in behind the giant name. */}
        <div
          data-avatar-wrap
          className="absolute right-[-8%] bottom-[-16%] aspect-[1128/1146] h-[84%] sm:right-[3vw] sm:bottom-[-34%] sm:h-[128%]"
        >
          <Avatar />
        </div>
      </div>

      <h1
        ref={name}
        aria-label={`${site.name} — ${site.role} in ${site.city}`}
        className="display hero-name relative z-10 px-5 pb-3 md:px-10 md:pb-5"
      >
        <span data-fit aria-hidden="true" className="inline-block whitespace-nowrap">
          <span data-word className="word-mask block sm:inline-block">
            {site.first}
          </span>{" "}
          <span data-word className="word-mask block sm:inline-block">
            {site.last}
          </span>
        </span>
        <span className="sr-only">
          {" "}
          — {site.role} in {site.city}
        </span>
      </h1>
    </section>
  );
}
