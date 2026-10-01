import { useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { Arrow } from "./Icons";

// Counts from 0.00 to 1.00, then lifts like a curtain.
export default function Preloader({ onReveal }) {
  const root = useRef(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const num = root.current.querySelector("[data-num]");
      const counter = { v: 0 };

      gsap
        .timeline({ onComplete: () => setGone(true) })
        .from("[data-fade]", { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.08, ease: "power3.out" })
        .to(
          counter,
          {
            v: 1,
            duration: 1.9,
            ease: "power2.inOut",
            onUpdate: () => {
              num.textContent = counter.v.toFixed(2);
            },
          },
          0.1
        )
        .to("[data-bar]", { scaleX: 1, duration: 1.9, ease: "power2.inOut" }, 0.1)
        .to("[data-num-wrap]", { yPercent: -105, duration: 0.7, ease: "expo.in" }, "+=0.12")
        .to("[data-fade]", { autoAlpha: 0, duration: 0.3 }, "<")
        .add(() => onReveal(), "-=0.05")
        .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "expo.inOut" }, "<");
    },
    { scope: root }
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[120] flex flex-col justify-between bg-ink p-5 text-bone md:p-10"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="label flex justify-between text-mute">
        <span data-fade>Apurba Das</span>
        <span data-fade>Portfolio — Ed. 2026</span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="overflow-clip">
          <div data-num-wrap className="display tabular text-[36vw] leading-[0.78] md:text-[23vw]">
            <span data-num>0.00</span>
          </div>
        </div>
        <p data-fade className="label mb-2 hidden items-center gap-2 text-mute sm:flex">
          From zero <Arrow className="text-taxi" /> one
        </p>
      </div>

      <div data-bar className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-taxi" />
    </div>
  );
}
