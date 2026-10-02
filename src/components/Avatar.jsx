import { useRef } from "react";
import { gsap, useGSAP, MOTION, finePointer, whileVisible } from "../lib/gsap";

// The 3D-rendered Apurba whose eyes follow your cursor. One picture plus two loose irises:
// the base has empty eyes, and each iris slides around behind an eye-shaped stencil, so it
// tucks under the eyelids like a real eye. Layers come from public/img/avatar/.
const SIZE = { w: 1128, h: 1146 };
// Positions in % of the picture: eye box [left, top, width, height] and iris [centre x, centre y, diameter].
const EYES = [
  { name: "left", box: [33.457, 40.471, 10.638, 7.068], iris: [39.537, 44.019, 7.181] },
  { name: "right", box: [56.011, 40.471, 11.117, 6.911], iris: [60.478, 43.995, 6.968] },
];
// How far the irises travel, in % of their own size.
const REACH = { x: 20, up: 9, down: 8.5 };

function Eye({ name, box, iris }) {
  const [bx, by, bw, bh] = box;
  const [ix, iy, d] = iris;
  const dh = (d * SIZE.w) / SIZE.h; // iris height in % of the picture's height
  const stencil = `url(/img/avatar/eye-${name}.png)`;

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        left: `${bx}%`,
        top: `${by}%`,
        width: `${bw}%`,
        height: `${bh}%`,
        maskImage: stencil,
        WebkitMaskImage: stencil,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      <img
        data-iris
        src={`/img/avatar/iris-${name}.webp`}
        alt=""
        draggable="false"
        className="absolute max-w-none select-none"
        style={{
          left: `${((ix - d / 2 - bx) / bw) * 100}%`,
          top: `${((iy - dh / 2 - by) / bh) * 100}%`,
          width: `${(d / bw) * 100}%`,
        }}
      />
      {/* Shade from the upper lid stays put while the iris moves underneath it. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(70,30,12,0.28),transparent_40%)]" />
      {/* The eyelid that drops for a blink. */}
      <div
        data-lid
        className="absolute inset-x-0 top-0 h-full origin-top border-b-[3px] border-[#2a140a] bg-[linear-gradient(to_bottom,#8f4d2e,#c98260)]"
        style={{ transform: "scaleY(0)" }}
      />
    </div>
  );
}

export const AVATAR_RATIO = SIZE.w / SIZE.h;

export default function Avatar({ className = "" }) {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        const irises = q("[data-iris]");
        const face = q("[data-face]")[0];
        gsap.set(face, { transformOrigin: "50% 78%" });
        const toX = irises.map((el) => gsap.quickTo(el, "xPercent", { duration: 0.35, ease: "power3" }));
        const toY = irises.map((el) => gsap.quickTo(el, "yPercent", { duration: 0.35, ease: "power3" }));
        const leanX = gsap.quickTo(face, "x", { duration: 1.1, ease: "power3" });
        const tilt = gsap.quickTo(face, "rotation", { duration: 1.1, ease: "power3" });

        // nx, ny run from -1 to 1: where to look, relative to straight ahead.
        const look = (nx, ny) => {
          toX.forEach((f) => f(nx * REACH.x));
          toY.forEach((f) => f(ny < 0 ? ny * REACH.up : ny * REACH.down));
          leanX(nx * face.offsetWidth * 0.015);
          tilt(nx * 2.2);
        };

        const lookAtPoint = (x, y) => {
          const r = face.getBoundingClientRect();
          const dx = x - (r.left + r.width / 2);
          const dy = y - (r.top + r.height * 0.44);
          look(Math.tanh(dx / (window.innerWidth * 0.22)), Math.tanh(dy / (window.innerHeight * 0.25)));
        };

        // With nobody moving the pointer (or on a phone), the eyes wander on their own.
        let lastMove = 0;
        let visible = false;
        const wander = gsap.delayedCall(2, function glance() {
          if (visible && performance.now() - lastMove > 2500) {
            look(gsap.utils.random(-0.9, 0.9), gsap.utils.random(-0.7, 0.6));
          }
          wander.delay(gsap.utils.random(1.4, 3.2)).restart(true);
        });

        const blink = () => {
          if (visible) {
            gsap
              .timeline()
              .to(q("[data-lid]"), { scaleY: 1, duration: 0.07, ease: "power2.in" })
              .to(q("[data-lid]"), { scaleY: 0, duration: 0.12, ease: "power2.out" }, "+=0.04");
          }
          blinker.delay(gsap.utils.random(2.2, 5.5)).restart(true);
        };
        const blinker = gsap.delayedCall(1.6, blink);

        const onPointer = (e) => {
          lastMove = performance.now();
          lookAtPoint(e.clientX, e.clientY);
        };
        const onLeave = () => {
          lastMove = 0;
          look(0, 0);
        };
        window.addEventListener("pointermove", onPointer, { passive: true });
        document.documentElement.addEventListener("mouseleave", onLeave);
        const watcher = whileVisible(root.current, (active) => {
          visible = active;
        });

        // On phones the eyes follow your finger while it's on the screen.
        const onTouch = (e) => {
          const t = e.touches[0];
          if (t) onPointer(t);
        };
        if (!finePointer()) window.addEventListener("touchmove", onTouch, { passive: true });

        return () => {
          window.removeEventListener("pointermove", onPointer);
          window.removeEventListener("touchmove", onTouch);
          document.documentElement.removeEventListener("mouseleave", onLeave);
          watcher.kill();
          wander.kill();
          blinker.kill();
        };
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className={`pointer-events-none relative h-full w-full select-none ${className}`} aria-hidden="true">
      {/* A taxi-yellow sun behind the head only, so black hair still reads on the black page. */}
      <div data-sun className="absolute top-0 left-1/2 aspect-square w-[70%] -translate-x-1/2 rounded-full bg-taxi" />
      <div
        data-face
        className="relative h-full w-full"
        style={{
          // Only the cut edge at the very bottom fades away, behind the name.
          maskImage: "linear-gradient(to bottom, #000 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 88%, transparent 100%)",
        }}
      >
        {/* Sized by the hero's height from 640px up and by its width below; keep in sync with the preload in index.html. */}
        <img
          src="/img/avatar/base.webp"
          srcSet="/img/avatar/base-560.webp 560w, /img/avatar/base-840.webp 840w, /img/avatar/base.webp 1128w"
          sizes="(min-width: 640px) 90vh, 77vw"
          alt=""
          width={SIZE.w}
          height={SIZE.h}
          draggable="false"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full"
        />
        {EYES.map((eye) => (
          <Eye key={eye.name} {...eye} />
        ))}
      </div>
    </div>
  );
}
