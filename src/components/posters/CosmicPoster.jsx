import { useRef } from "react";
import { gsap, useGSAP, MOTION, playWhileVisible, rng } from "../../lib/gsap";
import PosterHud from "./PosterHud";

const r = rng(11);
const STARS = Array.from({ length: 120 }, () => ({ x: r() * 600, y: r() * 600, s: 0.4 + r() * 1.5, o: 0.15 + r() * 0.75 }));
const DISK = [
  { rx: 255, ry: 58, dash: "2 9", w: 2, o: 0.55 },
  { rx: 212, ry: 47, dash: "60 16", w: 3, o: 0.9 },
  { rx: 172, ry: 37, dash: "140 22", w: 5, o: 1 },
  { rx: 132, ry: 28, dash: "18 10", w: 2, o: 0.7 },
];

function Disk({ half }) {
  return (
    <g clipPath={`url(#cosmic-${half})`}>
      {DISK.map((d, i) => (
        <ellipse
          key={i}
          data-flow
          cx="300"
          cy="300"
          rx={d.rx}
          ry={d.ry}
          fill="none"
          stroke={i % 2 ? "var(--color-taxi)" : "var(--color-bone)"}
          strokeOpacity={d.o}
          strokeWidth={d.w}
          strokeDasharray={d.dash}
        />
      ))}
    </g>
  );
}

// A black hole with a flowing accretion disk and a scroll-driven depth gauge.
export default function CosmicPoster() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const loops = [
          gsap.to(q("[data-flow]"), { strokeDashoffset: (i) => (i % 2 ? 600 : -600), duration: 9, ease: "none", repeat: -1 }),
          gsap.to(q("[data-star]").slice(0, 40), {
            opacity: 0.05,
            duration: "random(0.6, 1.8)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: { each: 0.08, from: "random" },
          }),
          gsap.to(q("[data-glow]"), { scale: 1.08, svgOrigin: "300 300", duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true }),
        ];
        playWhileVisible(ref.current, loops);

        gsap.fromTo(
          q("[data-marker]"),
          { y: 0 },
          { y: 360, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } }
        );
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="absolute inset-0 bg-[#050505]" aria-hidden="true">
    <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <clipPath id="cosmic-back">
          <rect x="-100" y="-100" width="800" height="400" />
        </clipPath>
        <clipPath id="cosmic-front">
          <rect x="-100" y="300" width="800" height="400" />
        </clipPath>
        <clipPath id="cosmic-top">
          <rect x="0" y="0" width="600" height="300" />
        </clipPath>
        <filter id="cosmic-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <rect width="600" height="600" fill="#050505" />
      <g stroke="var(--color-bone)" strokeOpacity="0.06">
        {Array.from({ length: 13 }, (_, i) => (
          <g key={i}>
            <line x1={i * 50} y1="0" x2={i * 50} y2="600" />
            <line x1="0" y1={i * 50} x2="600" y2={i * 50} />
          </g>
        ))}
      </g>
      {STARS.map((s, i) => (
        <circle key={i} data-star cx={s.x} cy={s.y} r={s.s} fill="var(--color-bone)" opacity={s.o} />
      ))}

      <g transform="rotate(-12 300 300)">
        <Disk half="back" />
        <circle data-glow cx="300" cy="300" r="104" fill="none" stroke="var(--color-taxi)" strokeOpacity="0.45" strokeWidth="18" filter="url(#cosmic-blur)" />
        {/* The far side of the disk, bent over the top by gravity. */}
        <ellipse cx="300" cy="300" rx="126" ry="118" fill="none" stroke="var(--color-taxi)" strokeWidth="3" strokeOpacity="0.85" clipPath="url(#cosmic-top)" />
        <circle cx="300" cy="300" r="86" fill="#000" />
        <circle cx="300" cy="300" r="92" fill="none" stroke="var(--color-bone)" strokeWidth="1.5" />
        <Disk half="front" />
      </g>


      <g stroke="var(--color-bone)" strokeOpacity="0.5">
        {Array.from({ length: 37 }, (_, i) => (
          <line key={i} x1={i % 5 ? 566 : 556} x2="574" y1={120 + i * 10} y2={120 + i * 10} />
        ))}
      </g>
      <path data-marker d="M546 114 l-10 -6 v12 z" fill="var(--color-taxi)" />
    </svg>
    <PosterHud
      tl={
        <>
          OBJ-01 · Sagittarius A*
          <br />
          <span className="opacity-60">26,670 ly · r 12.4M km</span>
        </>
      }
      tr="Depth"
      bl="Scroll to fall in ↓"
    />
    </div>
  );
}
