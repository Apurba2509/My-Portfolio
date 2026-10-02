import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION } from "../lib/gsap";
import { about, site } from "../data/content";

// "*text*" in the manifesto becomes a highlighted phrase.
const segments = about.manifesto.split(/(\*[^*]+\*)/).filter(Boolean);

// A tall, heavy zero: the black curtain has a zero-shaped window cut into it.
const CURTAIN =
  "M-4000 -4000 H5000 V5000 H-4000 Z " +
  "M380 390 A120 120 0 0 1 620 390 V610 A120 120 0 0 1 380 610 Z " +
  "M445 390 A55 55 0 0 1 555 390 V610 A55 55 0 0 1 445 610 Z";

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        const words = SplitText.create(q("[data-manifesto]"), { type: "words", aria: "none" }).words;
        const marks = q("[data-mark]");
        const fillStart = 1.25;
        const step = 0.045;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=190%", pin: true, scrub: 0.6 },
        });

        // Dive through the zero: scale the curtain around a point inside the zero's left stroke.
        tl.to(q("[data-curtain-copy]"), { autoAlpha: 0, duration: 0.2 }, 0)
          .to(q("[data-zero]"), { scale: 70, svgOrigin: "412 500", ease: "power3.in", duration: 1.1 }, 0)
          .set(q("[data-curtain]"), { autoAlpha: 0 }, 1.1)
          .set(q("[data-paper]"), { top: 0 }, 1.1)
          .from(q("[data-about-label]"), { autoAlpha: 0, y: 12, duration: 0.2 }, 1.05);

        // Words fill in as you read; highlights sweep in when their words arrive.
        tl.fromTo(words, { opacity: 0.13 }, { opacity: 1, duration: 0.2, stagger: step }, fillStart);
        marks.forEach((mark) => {
          const first = words.findIndex((w) => mark.contains(w));
          tl.fromTo(
            mark,
            { backgroundSize: "0% 38%" },
            { backgroundSize: "100% 38%", duration: 0.35, ease: "power2.out" },
            fillStart + Math.max(first, 0) * step
          );
        });

        tl.from(q("[data-now] > *"), { autoAlpha: 0, y: 24, duration: 0.3, stagger: 0.08 }, ">-0.2").to({}, { duration: 0.25 });
      });
    },
    { scope: root }
  );

  return (
    <section id="about" ref={root} data-theme="light" aria-labelledby="about-title" className="on-bone relative h-[100svh] min-h-[620px] overflow-clip bg-ink text-ink">
      {/* The paper starts 2px down so its edge never peeks out from under the black curtain. */}
      <div data-paper className="absolute inset-x-0 top-[2px] bottom-0 bg-bone motion-reduce:top-0" />
      <div className="relative flex h-full flex-col justify-center px-5 py-20 md:px-10">
        <h2 id="about-title" data-about-label className="label text-mute-ink">
          0.2 — Whoami
        </h2>
        <p
          data-manifesto
          className="mt-6 max-w-[40ch] text-[clamp(1.45rem,min(3.7vw,6.2vh),4.4rem)] leading-[1.08] font-medium tracking-[-0.025em]"
        >
          {segments.map((s, i) =>
            s.startsWith("*") ? (
              <mark
                key={i}
                data-mark
                className="bg-[linear-gradient(var(--color-taxi),var(--color-taxi))] bg-[length:100%_38%] bg-[position:0_88%] bg-no-repeat bg-transparent text-inherit"
              >
                {s.slice(1, -1)}
              </mark>
            ) : (
              s
            )
          )}
        </p>

        <div data-now className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-ink/15 pt-5 md:mt-14 md:grid-cols-4">
          <p className="label text-mute-ink">Now — updated {site.updated}</p>
          {about.now.map((n) => (
            <p key={n.k} className="text-[15px] leading-snug">
              <span className="label block text-mute-ink">{n.k}</span>
              {n.v}
            </p>
          ))}
        </div>
      </div>

      <div data-curtain className="pointer-events-none absolute inset-0 motion-reduce:hidden" aria-hidden="true">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
          <path data-zero d={CURTAIN} fill="var(--color-ink)" fillRule="evenodd" />
        </svg>
        <p data-curtain-copy className="label absolute inset-x-0 bottom-8 text-center text-bone/70 md:bottom-10">
          0.2 — Whoami · Scroll into the zero ↓
        </p>
      </div>
    </section>
  );
}
