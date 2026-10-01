import { useEffect, useRef } from "react";
import { gsap, rng, reducedMotion } from "../../lib/gsap";

// MediaPipe's 21 hand landmarks, posed as an open palm.
const HAND = [
  [100, 230], [70, 210], [48, 185], [32, 160], [20, 138],
  [72, 140], [66, 100], [62, 74], [59, 50],
  [98, 135], [98, 92], [98, 62], [98, 36],
  [122, 140], [128, 100], [132, 74], [135, 52],
  [143, 152], [155, 122], [163, 102], [170, 82],
];
const BONES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20],
];

function makeParticles(count) {
  const r = rng(9);
  return Array.from({ length: count }, (_, i) => {
    // One in five particles forms the bright core; the rest trail out along two arms.
    if (i % 5 === 0) {
      return { radius: Math.pow(r(), 1.6) * 70, angle: r() * Math.PI * 2, size: 0.8 + r() * 1.6, gold: r() < 0.3, ox: 0, oy: 0 };
    }
    const t = Math.pow(r(), 0.8);
    return {
      radius: 18 + t * 300,
      angle: (i % 2) * Math.PI + t * 5.4 + (r() - 0.5) * 0.9,
      size: 0.8 + r() * 1.8,
      gold: r() < 0.12,
      ox: 0,
      oy: 0,
    };
  });
}

// A two-armed particle galaxy that scatters away from your cursor or finger.
export default function GesturePoster() {
  const wrap = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el.getContext("2d");
    const small = window.innerWidth < 768;
    const particles = makeParticles(small ? 650 : 1200);
    const pointer = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    let rotation = 0;
    let visible = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
    };

    function draw(delta) {
      rotation += delta * 0.00012;
      const cx = w / 2;
      const cy = h * 0.46;
      const scale = Math.min(w, h) / 640;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const a = p.angle + rotation * (1.6 - p.radius / 320);
        const x = cx + Math.cos(a) * p.radius * scale;
        const y = cy + Math.sin(a) * p.radius * scale * 0.58;
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const d = Math.hypot(dx, dy) || 1;
        const reach = 120;
        const push = d < reach ? ((reach - d) / reach) * 46 : 0;
        p.ox += ((dx / d) * push - p.ox) * 0.12;
        p.oy += ((dy / d) * push - p.oy) * 0.12;
        ctx.fillStyle = p.gold ? "#ffd100" : "rgba(238,235,227,0.8)";
        ctx.fillRect(x + p.ox, y + p.oy, p.size, p.size);
      }
    }

    const tick = (_, delta) => visible && draw(delta);
    const move = (e) => {
      const rect = el.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const leave = () => {
      pointer.x = pointer.y = -9999;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);
    const animate = !reducedMotion();
    if (animate) gsap.ticker.add(tick);
    const area = wrap.current;
    area.addEventListener("pointermove", move);
    area.addEventListener("pointerleave", leave);

    return () => {
      ro.disconnect();
      io.disconnect();
      gsap.ticker.remove(tick);
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0 bg-[#070707]" aria-hidden="true">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <svg viewBox="0 0 200 250" className="absolute bottom-[7%] left-[5%] w-[20%] min-w-16 opacity-90">
        <g stroke="var(--color-bone)" strokeOpacity="0.6" strokeWidth="2">
          {BONES.map(([a, b], i) => (
            <line key={i} x1={HAND[a][0]} y1={HAND[a][1]} x2={HAND[b][0]} y2={HAND[b][1]} />
          ))}
        </g>
        {HAND.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4.5" fill="var(--color-taxi)" />
        ))}
      </svg>
      <p className="label absolute top-4 left-4 text-bone/60 md:top-6 md:left-6">Hand · 21 landmarks</p>
      <p className="label absolute right-4 bottom-4 text-bone/60 md:right-6 md:bottom-6">
        <span className="pointer-coarse:hidden">Move your cursor</span>
        <span className="hidden pointer-coarse:inline">Touch & drag</span>
      </p>
    </div>
  );
}
