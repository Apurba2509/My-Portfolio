import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, Draggable, useGSAP);

// Always start at the top: the intro and the scroll scenes are built from there. ScrollTrigger keeps
// its own copy of this setting and restores it after every refresh, so it has to be set through it.
ScrollTrigger.clearScrollMemory("manual");

gsap.defaults({ ease: "expo.out", duration: 1 });

export { gsap, ScrollTrigger, SplitText, Draggable, useGSAP };

// Media queries used with gsap.matchMedia() across components.
export const MOTION = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => window.matchMedia("(pointer: fine)").matches;

// Run looping animations only while their element can be seen. Inside the stacked project
// cards that means until the next card slides over it, not until it leaves the screen.
export function whileVisible(el, onChange) {
  const next = el.closest("[data-stack-card]")?.nextElementSibling;
  return ScrollTrigger.create({
    trigger: el,
    start: "top bottom",
    ...(next ? { endTrigger: next, end: "top 15%" } : { end: "bottom top" }),
    onToggle: (self) => onChange(self.isActive),
  });
}

export function playWhileVisible(el, animations) {
  animations.forEach((a) => a.pause());
  return whileVisible(el, (active) => animations.forEach((a) => (active ? a.play() : a.pause())));
}

// Small deterministic RNG so generated artwork looks the same on every visit.
export function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
