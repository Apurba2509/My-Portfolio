import { useRef } from "react";
import { gsap, useGSAP, MOTION, playWhileVisible, rng } from "../../lib/gsap";
import Hud from "./Hud";
import PosterHud from "./PosterHud";

// A made-up street grid with a river on the west bank, like Kolkata and the Hooghly.
const N = 11;
const STEP = 60;
const r = rng(22);
const NODES = Array.from({ length: N * N }, (_, i) => ({
  x: (i % N) * STEP + 0 + (r() - 0.5) * 26,
  y: Math.floor(i / N) * STEP + 0 + (r() - 0.5) * 26,
}));
const at = (c, row) => NODES[row * N + c];
const EDGES = [];
for (let row = 0; row < N; row++) {
  for (let c = 0; c < N; c++) {
    if (c < N - 1 && r() < 0.86) EDGES.push([at(c, row), at(c + 1, row)]);
    if (row < N - 1 && r() < 0.86) EDGES.push([at(c, row), at(c, row + 1)]);
    if (c < N - 1 && row < N - 1 && r() < 0.12) EDGES.push([at(c, row), at(c + 1, row + 1)]);
  }
}
// The route: from the south-west to the north-east, one block at a time.
const MOVES = "RRURRUURURURU";
const ROUTE = [[2, 8]];
for (const m of MOVES) {
  const [c, row] = ROUTE[ROUTE.length - 1];
  ROUTE.push(m === "R" ? [c + 1, row] : [c, row - 1]);
}
const routeD = ROUTE.map(([c, row], i) => `${i ? "L" : "M"}${at(c, row).x.toFixed(1)} ${at(c, row).y.toFixed(1)}`).join(" ");
const start = at(...ROUTE[0]);
const end = at(...ROUTE[ROUTE.length - 1]);

export default function NaviGoPoster() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const path = q("[data-route]")[0];
        const car = q("[data-car]")[0];
        const len = path.getTotalLength();
        const progress = { p: 0 };
        const place = () => {
          const pt = path.getPointAtLength(progress.p * len);
          car.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        };

        const drive = gsap
          .timeline({ repeat: -1, repeatDelay: 0.6 })
          .set(path, { strokeDasharray: len, strokeDashoffset: len })
          .set(progress, { p: 0, onComplete: place })
          .to(path, { strokeDashoffset: 0, duration: 2.6, ease: "power2.inOut" })
          .to(progress, { p: 1, duration: 2.6, ease: "power2.inOut", onUpdate: place }, "<")
          .to(path, { opacity: 0.25, duration: 0.8 }, "+=1.2")
          .set(path, { opacity: 1 });
        const pulse = gsap.fromTo(
          q("[data-pulse]"),
          { scale: 1, opacity: 0.8, transformOrigin: "50% 50%" },
          { scale: 3, opacity: 0, duration: 1.6, ease: "power2.out", repeat: -1 }
        );
        playWhileVisible(ref.current, [drive, pulse]);
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="absolute inset-0 bg-[#0d0d0c]" aria-hidden="true">
    <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <rect width="600" height="600" fill="#0d0d0c" />

      <g stroke="var(--color-bone)" strokeOpacity="0.17" strokeWidth="1.2">
        {EDGES.map(([a, b], i) => (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
        ))}
      </g>
      <path d="M-20 170 C 140 150, 260 250, 420 230 S 560 120, 640 150" fill="none" stroke="var(--color-bone)" strokeOpacity="0.32" strokeWidth="3" />
      <path d="M180 -20 C 200 160, 330 330, 310 460 S 380 600, 400 640" fill="none" stroke="var(--color-bone)" strokeOpacity="0.32" strokeWidth="3" />

      <path d="M58 -20 C 20 120, 110 230, 62 340 S 70 520, 20 640" fill="none" stroke="#1d1d1a" strokeWidth="58" />
      <path d="M58 -20 C 20 120, 110 230, 62 340 S 70 520, 20 640" fill="none" stroke="var(--color-bone)" strokeOpacity="0.14" strokeDasharray="3 7" />
      <Hud x="0" y="0" size={10} opacity={0.4} transform="translate(80 420) rotate(-78)">
        HOOGHLY
      </Hud>

      <path data-route d={routeD} fill="none" stroke="var(--color-taxi)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={start.x} cy={start.y} r="9" fill="var(--color-bone)" />
      <circle cx={start.x} cy={start.y} r="15" fill="none" stroke="var(--color-bone)" strokeOpacity="0.5" />
      <circle data-pulse cx={end.x} cy={end.y} r="10" fill="none" stroke="var(--color-taxi)" strokeWidth="2" />
      <circle cx={end.x} cy={end.y} r="10" fill="var(--color-taxi)" />
      <g data-car transform={`translate(${start.x} ${start.y})`}>
        <rect x="-7" y="-7" width="14" height="14" fill="#0d0d0c" stroke="var(--color-taxi)" strokeWidth="3" />
      </g>

    </svg>
    <PosterHud
      className="bg-[#0d0d0c]/85 px-2 py-1.5 text-bone/70"
      tl={
        <>
          Kolkata — drive network
          <br />
          <span className="opacity-60">22.5726°N 88.3639°E · OSMnx</span>
        </>
      }
      br={<span className="text-taxi">ETA 18 min · 6.4 km</span>}
    />
    </div>
  );
}
