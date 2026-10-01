import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { stack } from "../data/content";
import { Star } from "./Icons";
import SplitReveal from "./SplitReveal";

// Giant lines of tools that slide sideways, alternating direction, as you scroll.
export default function Stack() {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        q("[data-line]").forEach((line, i) => {
          const travel = () => Math.max(0, line.scrollWidth - window.innerWidth + 40);
          gsap.fromTo(
            line,
            { x: () => (i % 2 ? -travel() : 0) },
            {
              x: () => (i % 2 ? 0 : -travel()),
              ease: "none",
              scrollTrigger: { trigger: line, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
            }
          );
        });
      });
    },
    { scope: root }
  );

  return (
    <section id="stack" ref={root} data-theme="dark" aria-labelledby="stack-title" className="relative overflow-clip bg-ink py-28 md:py-40">
      <div className="grid grid-cols-12 gap-x-6 gap-y-6 px-5 md:px-10">
        <p className="label col-span-12 text-mute md:col-span-3">0.8 — Stack</p>
        <div className="col-span-12 md:col-span-9">
          <SplitReveal as="h2" id="stack-title" className="display text-[clamp(4rem,min(12vw,24svh),12.5rem)]">
            Tools of
            <br />
            the trade
          </SplitReveal>
        </div>
      </div>

      <div className="mt-16 md:mt-28">
        {stack.map((row, i) => (
          <div key={row.label} className="border-t border-bone/15 pt-4 pb-3 last:border-b">
            <h3 className="label px-5 text-mute md:px-10">
              ({String(i + 1).padStart(2, "0")}) {row.label}
            </h3>
            <ul
              data-line
              className="display mt-3 flex w-max items-center gap-[0.3em] px-5 text-[clamp(3.2rem,9vw,9.5rem)] whitespace-nowrap md:px-10 motion-reduce:w-auto motion-reduce:flex-wrap"
            >
              {row.items.map((item, j) => (
                <li key={item} className="flex items-center gap-[0.3em]">
                  <span className={`transition-colors duration-300 hover:text-taxi ${j % 2 ? "outline-text" : ""}`}>{item}</span>
                  {j < row.items.length - 1 && <Star className="text-taxi" />}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
