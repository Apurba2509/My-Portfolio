import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "../lib/gsap";
import { tapes } from "../data/content";
import { Star } from "./Icons";

function Tape({ items, className, style }) {
  // The run of items is repeated so the loop can wrap seamlessly at half its width.
  const run = [...items, ...items, ...items];
  return (
    <div aria-hidden="true" className={`absolute inset-x-[-10%] flex overflow-clip py-3 md:py-4 ${className}`} style={style}>
      <div data-track className="display flex shrink-0 items-center whitespace-nowrap text-[clamp(2.2rem,6.4vw,6rem)] will-change-transform">
        {[0, 1].map((copy) => (
          <span key={copy} className="flex items-center">
            {run.map((item, i) => (
              <span key={i} className="flex items-center">
                <span className="px-[0.35em]">{item}</span>
                <Star />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

// Two crossing tapes; they drift on their own and race when you scroll.
export default function Tapes() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const tracks = gsap.utils.toArray("[data-track]", root.current).map((el, i) => ({ el, x: 0, dir: i === 0 ? -1 : 1 }));
        let boost = 1;
        let scrollDir = 1;

        const tick = (_, delta) => {
          boost += (1 - boost) * 0.06;
          tracks.forEach((t) => {
            const half = t.el.scrollWidth / 2;
            t.x = gsap.utils.wrap(-half, 0, t.x + t.dir * scrollDir * boost * delta * 0.06);
            gsap.set(t.el, { x: t.x });
          });
        };

        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
          onUpdate: (self) => {
            scrollDir = self.direction;
            boost = Math.min(1 + Math.abs(self.getVelocity()) / 220, 9);
          },
        });

        return () => {
          gsap.ticker.remove(tick);
          st.kill();
        };
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} data-theme="light" className="relative h-[clamp(240px,40vw,460px)] overflow-clip bg-bone">
      <p className="sr-only">{tapes.one.join(" · ")}</p>
      <Tape items={tapes.two} className="top-[46%] bg-ink text-bone" style={{ transform: "translateY(-50%) rotate(3deg)" }} />
      <Tape items={tapes.one} className="top-[50%] bg-taxi text-ink shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]" style={{ transform: "translateY(-50%) rotate(-4deg)" }} />
    </section>
  );
}
