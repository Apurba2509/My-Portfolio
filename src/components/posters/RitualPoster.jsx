import { useRef } from "react";
import { gsap, useGSAP, MOTION, playWhileVisible, rng } from "../../lib/gsap";
import Hud from "./Hud";

const COLS = 16;
const ROWS = 7;
const SIZE = 24;
const GAP = 5;
const X0 = (600 - (COLS * (SIZE + GAP) - GAP)) / 2;
const Y0 = 250;
const r = rng(47);
const LEVELS = [0.07, 0.22, 0.45, 0.75, 1];
// Streaks get denser towards the right: the habit sticking.
const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = Math.floor(i / ROWS);
  const bias = col / COLS;
  const level = Math.min(4, Math.floor(r() * 3 + bias * 2.6));
  return { col, row: i % ROWS, o: LEVELS[level] };
});
const WEEK = ["M", "T", "W", "T", "F", "S", "S"];

// A habit heatmap that fills in column by column, with a streak counter.
export default function RitualPoster() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const counter = { v: 0 };
        const streak = q("[data-streak]")[0];
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 75%", once: true } })
          .from(q("[data-cell]"), {
            scale: 0,
            transformOrigin: "50% 50%",
            duration: 0.5,
            ease: "back.out(2)",
            stagger: { grid: [COLS, ROWS], from: "start", axis: "x", amount: 1.4 },
          })
          .to(counter, { v: 47, duration: 1.8, ease: "power2.out", onUpdate: () => (streak.textContent = String(Math.round(counter.v)).padStart(3, "0")) }, 0)
          .from(q("[data-check]"), { scale: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.08, ease: "back.out(2.5)" }, 0.6);

        playWhileVisible(ref.current, [
          gsap.to(q("[data-today]"), { opacity: 0.25, duration: 0.8, ease: "sine.inOut", repeat: -1, yoyo: true }),
        ]);
      });
    },
    { scope: ref }
  );

  const today = CELLS[CELLS.length - 1];

  return (
    <svg ref={ref} viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <rect width="600" height="600" fill="#0f0f0e" />

      <circle cx="514" cy="150" r="36" fill="var(--color-bone)" />
      <circle cx="500" cy="139" r="34" fill="#0f0f0e" />

      <Hud x={X0} y="118">
        CURRENT STREAK
      </Hud>
      <text
        data-streak
        x={X0 - 4}
        y="224"
        fill="var(--color-bone)"
        fontFamily="Archivo Variable, sans-serif"
        fontWeight="850"
        fontStretch="62%"
        fontSize="104"
        letterSpacing="-2"
      >
        047
      </text>
      <Hud x={X0 + 170} y="220" opacity={0.45}>
        DAYS · 75 HARD
      </Hud>

      {CELLS.map((c, i) => (
        <rect
          key={i}
          data-cell
          data-today={c === today ? "" : undefined}
          x={X0 + c.col * (SIZE + GAP)}
          y={Y0 + c.row * (SIZE + GAP)}
          width={SIZE}
          height={SIZE}
          fill="var(--color-taxi)"
          fillOpacity={c.o}
        />
      ))}
      {WEEK.map((d, i) =>
        i % 2 === 0 ? (
          <Hud key={i} x={X0 - 12} y={Y0 + i * (SIZE + GAP) + 17} anchor="end" size={10} opacity={0.4}>
            {d}
          </Hud>
        ) : null
      )}

      {WEEK.map((d, i) => {
        const cx = X0 + 17 + i * 70;
        const done = i < 5;
        return (
          <g key={i}>
            <g data-check>
              <circle cx={cx} cy="480" r="17" fill={done ? "var(--color-taxi)" : "none"} stroke="var(--color-taxi)" strokeWidth="2" />
              {done && <path d={`M${cx - 7} 480 l5 5 l10 -11`} fill="none" stroke="#0f0f0e" strokeWidth="3" strokeLinecap="square" />}
            </g>
            <Hud x={cx} y="516" anchor="middle" size={10} opacity={0.45}>
              {d}
            </Hud>
          </g>
        );
      })}
    </svg>
  );
}
