import { useRef, useState } from "react";
import { gsap, useGSAP, finePointer } from "../lib/gsap";

// A dot that trails the pointer and grows into a labelled disc over [data-cursor] elements.
export default function Cursor() {
  const dot = useRef(null);
  const disc = useRef(null);
  const text = useRef(null);
  const [enabled] = useState(() => finePointer());

  useGSAP(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    gsap.set([dot.current, disc.current], { x: -200, y: -200 });
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.16, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.16, ease: "power3" });
    const cx = gsap.quickTo(disc.current, "x", { duration: 0.5, ease: "power3" });
    const cy = gsap.quickTo(disc.current, "y", { duration: 0.5, ease: "power3" });

    let current = null;

    const move = (e) => {
      dx(e.clientX);
      dy(e.clientY);
      cx(e.clientX);
      cy(e.clientY);
    };

    const over = (e) => {
      const el = e.target instanceof Element ? e.target : null;
      const labelled = el?.closest("[data-cursor]");
      const interactive = el?.closest("a, button, input, textarea, label");
      const name = labelled?.dataset.cursor || null;

      if (name !== current) {
        current = name;
        if (name) text.current.textContent = name;
        gsap.to(disc.current, { scale: name ? 1 : 0, duration: 0.5, ease: "expo.out", overwrite: true });
      }
      gsap.to(dot.current, {
        scale: name ? 0 : interactive ? 3.4 : 1,
        duration: 0.45,
        ease: "expo.out",
        overwrite: true,
      });
    };

    const hide = () => gsap.to([dot.current, disc.current], { autoAlpha: 0, duration: 0.2 });
    const show = () => gsap.to([dot.current, disc.current], { autoAlpha: 1, duration: 0.2 });

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    html.addEventListener("mouseleave", hide);
    html.addEventListener("mouseenter", show);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      html.removeEventListener("mouseleave", hide);
      html.removeEventListener("mouseenter", show);
      html.classList.remove("has-cursor");
    };
  });

  if (!enabled) return null;

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={disc} className="cursor-label" aria-hidden="true">
        <span ref={text} />
      </div>
    </>
  );
}
