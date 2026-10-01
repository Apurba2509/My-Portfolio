import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "../lib/gsap";

// A thin yellow line along the top edge: how far through the page you are.
export function ScrollProgress() {
  const bar = useRef(null);

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        bar.current.style.transform = `scaleX(${self.progress})`;
      },
    });
  });

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[3px]" aria-hidden="true">
      <div ref={bar} className="h-full origin-left bg-taxi" style={{ transform: "scaleX(0)" }} />
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
