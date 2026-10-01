import { useRef } from "react";
import { gsap, useGSAP, MOTION, playWhileVisible } from "../../lib/gsap";
import Hud from "./Hud";
import PosterHud from "./PosterHud";

const CX = 300;
const CY = 300;
const TILT = (-16 * Math.PI) / 180;
const ORBITS = [
  { rx: 150, ry: 46, speed: 7, start: 0.4, label: "Flash", fill: "var(--color-taxi)" },
  { rx: 212, ry: 68, speed: 11, start: 2.6, label: "Pro", fill: "var(--color-bone)" },
  { rx: 272, ry: 92, speed: 16, start: 4.6, label: "•••", fill: "var(--color-bone)" },
];

const position = (o, t) => {
  const x = o.rx * Math.cos(t);
  const y = o.ry * Math.sin(t);
  return {
    x: CX + x * Math.cos(TILT) - y * Math.sin(TILT),
    y: CY + x * Math.sin(TILT) + y * Math.cos(TILT),
    behind: Math.sin(t) < 0,
  };
};

// A planet with chat bubbles in orbit: the two Gemini models and a message in flight.
export default function OrbitPoster() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const bubbles = q("[data-bubble]");
        const loops = ORBITS.map((o, i) => {
          const state = { t: o.start };
          return gsap.to(state, {
            t: o.start + Math.PI * 2,
            duration: o.speed,
            ease: "none",
            repeat: -1,
            onUpdate: () => {
              const p = position(o, state.t);
              bubbles[i].setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
              bubbles[i].style.opacity = p.behind ? 0.35 : 1;
            },
          });
        });
        loops.push(gsap.to(q("[data-typing]"), { opacity: 0.2, duration: 0.4, repeat: -1, yoyo: true, stagger: 0.15 }));
        playWhileVisible(ref.current, loops);
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="absolute inset-0 bg-[#0b0b0a]" aria-hidden="true">
    <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <radialGradient id="orbit-a">
          <stop offset="0" stopColor="var(--color-taxi)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--color-taxi)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orbit-b">
          <stop offset="0" stopColor="var(--color-bone)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--color-bone)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="orbit-planet">
          <circle cx={CX} cy={CY} r="66" />
        </clipPath>
      </defs>

      <rect width="600" height="600" fill="#0b0b0a" />
      <circle data-nebula cx="200" cy="220" r="220" fill="url(#orbit-a)" />
      <circle data-nebula cx="430" cy="400" r="240" fill="url(#orbit-b)" />

      {ORBITS.map((o, i) => (
        <ellipse
          key={i}
          cx={CX}
          cy={CY}
          rx={o.rx}
          ry={o.ry}
          fill="none"
          stroke="var(--color-bone)"
          strokeOpacity="0.25"
          strokeDasharray="3 6"
          transform={`rotate(-16 ${CX} ${CY})`}
        />
      ))}

      <circle cx={CX} cy={CY} r="66" fill="var(--color-bone)" />
      <circle cx={CX + 26} cy={CY + 20} r="66" fill="#0b0b0a" fillOpacity="0.3" clipPath="url(#orbit-planet)" />

      {ORBITS.map((o, i) => {
        const p = position(o, o.start);
        return (
          <g key={i} data-bubble transform={`translate(${p.x} ${p.y})`}>
            <path d="M-30 -16 H30 V10 H-6 L-16 20 V10 H-30 Z" fill={o.fill} />
            {o.label === "•••" ? (
              [-10, 0, 10].map((dx) => <circle key={dx} data-typing cx={dx} cy="-3" r="3" fill="#0b0b0a" />)
            ) : (
              <Hud x="0" y="1" anchor="middle" size={11} opacity={1} fill="#0b0b0a">
                {o.label}
              </Hud>
            )}
          </g>
        );
      })}

    </svg>
    <PosterHud tl="Orbit/AI — Gemini on Android" bl="Jetpack Compose · M3" br="Multimodal: on" />
    </div>
  );
}
