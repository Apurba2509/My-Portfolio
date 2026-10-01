import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION } from "../lib/gsap";

// Text whose lines slide up out of a mask the first time it scrolls into view.
export default function SplitReveal({ as: Tag = "div", children, className = "", delay = 0, start = "top 88%", ...rest }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        SplitText.create(ref.current, {
          type: "lines",
          linesClass: "split-line",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.25,
              delay,
              stagger: 0.09,
              ease: "expo.out",
              scrollTrigger: { trigger: ref.current, start, once: true },
            }),
        });
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
