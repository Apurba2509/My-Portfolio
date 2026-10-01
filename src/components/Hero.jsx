import { useEffect, useRef } from "react";
import { gsap, SplitText, Draggable, useGSAP, MOTION, finePointer } from "../lib/gsap";
import { useReady } from "../lib/ready";
import { hero, site } from "../data/content";

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
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(root.current);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const chars = SplitText.create(q("[data-word]"), { type: "chars", aria: "none" }).chars;
      const words = SplitText.create(q("[data-statement]"), { type: "words", wordsClass: "st-word", mask: "words" }).words;
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
            .from(q("[data-card]"), { scale: 0.5, rotation: -30, autoAlpha: 0, duration: 1.5, ease: "expo.out" }, 0.45)
            .from(q("[data-tape]"), { scaleX: 0, duration: 0.7, ease: "power3.out" }, 1.1);
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
          .to(q("[data-card-wrap]"), { y: () => -window.innerHeight * 0.45, rotation: 10, ease: "none" }, 0);

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

        // The polaroid can be picked up and dropped anywhere in the hero.
        const card = q("[data-card]")[0];
        const [drag] = Draggable.create(q("[data-drag]"), {
          type: "x,y",
          bounds: root.current,
          zIndexBoost: false,
          onPress: () => gsap.to(card, { scale: 1.05, rotation: 0, duration: 0.4, ease: "power3.out" }),
          onDrag() {
            gsap.to(card, { rotation: gsap.utils.clamp(-18, 18, this.deltaX * 1.4), duration: 0.5, ease: "power3.out" });
          },
          onRelease: () => gsap.to(card, { scale: 1, rotation: -6, duration: 1.2, ease: "elastic.out(1, 0.4)" }),
        });

        return () => {
          h1.removeEventListener("pointermove", move);
          h1.removeEventListener("pointerleave", leave);
          drag.kill();
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

      <div className="relative flex min-h-0 items-center px-5 md:px-10">
        <p
          data-statement
          className="serif max-w-[11ch] text-[clamp(2.1rem,min(6.4vw,6.2svh),3.4rem)] leading-[0.98] sm:max-w-[17ch] sm:text-[clamp(2.2rem,min(5.2vw,7.4svh),6rem)]"
        >
          Building apps, cloud & communities — from zero to one.
        </p>

        <div
          data-card-wrap
          className="absolute top-2 right-5 w-[clamp(112px,30vw,160px)] sm:top-1/2 sm:right-[7vw] sm:w-[clamp(150px,min(18vw,27svh),280px)] sm:-translate-y-1/2"
        >
          <div data-drag>
            <figure
              data-card
              className="relative bg-bone p-2 pb-7 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] md:p-2.5 md:pb-9"
              style={{ transform: "rotate(-6deg)" }}
            >
              <picture>
                <source
                  type="image/webp"
                  srcSet="/img/apurba-das-480.webp 480w, /img/apurba-das-720.webp 720w"
                  sizes="(min-width: 640px) 20vw, 32vw"
                />
                <img
                  src="/img/apurba-das-480.jpg"
                  srcSet="/img/apurba-das-480.jpg 480w, /img/apurba-das-720.jpg 720w"
                  sizes="(min-width: 640px) 20vw, 32vw"
                  width="480"
                  height="600"
                  alt="Apurba Das smiling in blue sunglasses under a clear sky"
                  draggable="false"
                  className="aspect-[4/5] w-full object-cover select-none"
                />
              </picture>
              <figcaption className="label absolute inset-x-2 bottom-2 truncate text-[0.55rem] text-ink md:bottom-3 md:text-[0.6rem]">
                {hero.caption.split(" — ")[0]}
                <span className="hidden sm:inline"> — {hero.caption.split(" — ")[1]}</span>
              </figcaption>
              <span
                data-tape
                className="label absolute -top-3 left-[calc(50%-3.5rem)] grid h-7 w-28 place-items-center bg-taxi/90 text-[0.6rem] text-ink"
                style={{ transform: "rotate(3deg)" }}
              >
                <span className="pointer-coarse:hidden">Drag me</span>
                <span className="hidden pointer-coarse:inline">Hello!</span>
              </span>
            </figure>
          </div>
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
