import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "../lib/gsap";

export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

// Scroll position shown as a number from 0.00 to 1.00: the page is the trip from zero to one.
export function ScrollProgress() {
  const root = useRef(null);
  const value = useRef(null);
  const bar = useRef(null);

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        value.current.textContent = self.progress.toFixed(2);
        bar.current.style.transform = `scaleY(${self.progress})`;
        // Stay out of the way of the name in the hero.
        root.current.style.opacity = self.progress < 0.015 ? "0" : "1";
      },
    });
  });

  return (
    <div
      ref={root}
      className="label pointer-events-none fixed right-5 bottom-5 z-40 hidden items-end gap-3 text-bone opacity-0 mix-blend-difference transition-opacity duration-500 md:flex"
      aria-hidden="true"
    >
      <span className="relative h-14 w-px bg-bone/30">
        <span ref={bar} className="absolute inset-0 origin-top bg-bone" style={{ transform: "scaleY(0)" }} />
      </span>
      <span className="leading-none">
        <span ref={value} className="tabular">0.00</span>
        <span className="opacity-50"> / 1.00</span>
      </span>
    </div>
  );
}

// Press G to see the 12-column grid the layout is built on.
export function GridOverlay() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const key = (e) => {
      if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest?.("input, textarea, [contenteditable]")) return;
      setOn((v) => !v);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  if (!on) return null;
  return (
    <div className="grid-overlay" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}
