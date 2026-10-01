import { useEffect, useRef } from "react";
import { gsap, SplitText, Draggable, useGSAP, MOTION, finePointer } from "../lib/gsap";
import { useReady } from "../lib/ready";
import { hero, site } from "../data/content";

export default function Hero() {
  const root = useRef(null);
  const name = useRef(null);
  const intro = useRef(null);
  const ready = useReady();

  // Size the name to span the full width: one line on desktop, one word per line on phones.
  useEffect(() => {
    const h1 = name.current;
    const fit = () => {
      const style = getComputedStyle(h1);
      const available = h1.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      h1.style.fontSize = "100px";
      const width = h1.querySelector("[data-fit]").getBoundingClientRect().width;
      h1.style.fontSize = `${Math.floor((available / width) * 100 * 0.995)}px`;
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
        // Plays when the preloader lifts (see the effect below).
        intro.current = gsap
          .timeline({ paused: true })
          .from(chars, { yPercent: 118, duration: 1.5, stagger: 0.05, ease: "expo.out" })
          .from(q("[data-meta]"), { y: 18, autoAlpha: 0, duration: 1, stagger: 0.07, ease: "power3.out" }, 0.25)
          .from(words, { yPercent: 118, duration: 1.2, stagger: 0.035, ease: "expo.out" }, 0.3)
          .from(q("[data-card]"), { scale: 0.5, rotation: -30, autoAlpha: 0, duration: 1.5, ease: "expo.out" }, 0.45)
          .from(q("[data-tape]"), { scaleX: 0, duration: 0.7, ease: "power3.out" }, 1.1);

        // Scrolling away: letters lift out of their masks at different speeds.
        const lift = chars.map(() => 0.3 + Math.random() * 0.95);
        const fontPx = () => parseFloat(getComputedStyle(name.current).fontSize);
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          })
          .to(chars, { y: (i) => -lift[i] * fontPx(), ease: "none" }, 0)
          .to(q("[data-statement]"), { y: () => -window.innerHeight * 0.3, ease: "none" }, 0)
          .to(q("[data-meta-row]"), { y: -70, autoAlpha: 0, ease: "none" }, 0)
          .to(q("[data-card-wrap]"), { y: () => -window.innerHeight * 0.5, rotation: 12, ease: "none" }, 0);

        if (!finePointer()) return;

        // Letters near the pointer stretch upwards.
        gsap.set(chars, { transformOrigin: "50% 100%" });
        const stretch = chars.map((c) => gsap.quickTo(c, "scaleY", { duration: 0.6, ease: "power3" }));
        let centers = [];
        const measure = () => {
          centers = chars.map((c) => {
            const r = c.getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.bottom };
          });
        };
        const move = (e) => {
          if (!centers.length) measure();
          centers.forEach((c, i) => {
            const d = Math.hypot(e.clientX - c.x, (e.clientY - c.y) * 0.5);
            stretch[i](1 + Math.max(0, 1 - d / 280) * 0.34);
          });
        };
        const leave = () => stretch.forEach((s) => s(1));
        const h1 = name.current;
        h1.addEventListener("pointerenter", measure);
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
          h1.removeEventListener("pointerenter", measure);
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
    <section id="top" ref={root} aria-label="Intro" className="relative flex h-[100svh] min-h-[600px] flex-col overflow-clip bg-ink text-bone">
      <div data-meta-row className="grid grid-cols-2 gap-x-6 gap-y-5 px-5 pt-20 md:grid-cols-12 md:px-10 md:pt-28">
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

      <div className="relative flex flex-1 items-center px-5 md:px-10">
        <p data-statement className="serif max-w-[10ch] text-[clamp(2.3rem,6.2vw,6.6rem)] leading-[0.95] sm:max-w-[12ch]">
          Building apps, cloud & communities — from zero to one.
        </p>

        <div
          data-card-wrap
          className="absolute top-[4%] right-5 w-[clamp(118px,31vw,168px)] sm:top-[8%] sm:right-[8vw] sm:w-[clamp(170px,19vw,290px)]"
        >
          <div data-drag data-cursor="Drag">
            <figure
              data-card
              className="relative bg-bone p-2 pb-8 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] md:p-2.5 md:pb-10"
              style={{ transform: "rotate(-6deg)" }}
            >
              <picture>
                <source
                  type="image/webp"
                  srcSet="/img/apurba-480.webp 480w, /img/apurba-720.webp 720w"
                  sizes="(min-width: 640px) 20vw, 32vw"
                />
                <img
                  src="/img/apurba-480.jpg"
                  srcSet="/img/apurba-480.jpg 480w, /img/apurba-720.jpg 720w"
                  sizes="(min-width: 640px) 20vw, 32vw"
                  width="480"
                  height="600"
                  alt="Apurba Das smiling in blue sunglasses under a clear sky"
                  draggable="false"
                  className="aspect-[4/5] w-full object-cover select-none"
                />
              </picture>
              <figcaption className="label absolute inset-x-2 bottom-2 text-[0.55rem] leading-tight text-ink md:bottom-3 md:text-[0.6rem]">
                <span className="lg:hidden">{hero.caption.split(" — ")[0]}</span>
                <span className="hidden lg:inline">{hero.caption}</span>
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

      <h1 ref={name} aria-label={site.name} className="display relative z-10 px-5 pb-3 md:px-10 md:pb-5">
        <span data-fit aria-hidden="true" className="inline-block whitespace-nowrap">
          <span data-word className="word-mask block sm:inline-block">
            {site.first}
          </span>{" "}
          <span data-word className="word-mask block sm:inline-block">
            {site.last}
          </span>
        </span>
      </h1>
    </section>
  );
}
