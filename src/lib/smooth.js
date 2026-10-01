import Lenis from "lenis";
import { gsap, ScrollTrigger, reducedMotion } from "./gsap";

let lenis = null;

// Lenis drives the page scroll; GSAP's ticker drives Lenis so ScrollTrigger stays in sync.
export function startSmoothScroll() {
  if (reducedMotion()) return () => {};

  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export const getLenis = () => lenis;

export function scrollToTarget(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, ...options });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: reducedMotion() ? "auto" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
}

// Anchor clicks go through Lenis so they glide instead of jumping.
export function handleAnchor(event) {
  const href = event.currentTarget.getAttribute("href");
  if (!href?.startsWith("#")) return;
  event.preventDefault();
  scrollToTarget(href === "#" ? 0 : href);
  if (href !== "#") history.replaceState(null, "", href);
}
