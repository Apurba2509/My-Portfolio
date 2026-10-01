import { useRef } from "react";
import { gsap, useGSAP, finePointer, reducedMotion } from "../lib/gsap";

// Pulls its child towards the pointer while hovered.
export default function Magnetic({ children, strength = 0.3, className = "" }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (!finePointer() || reducedMotion()) return;
      const el = ref.current;
      const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });

      const move = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
