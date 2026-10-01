import { useRef } from "react";
import { gsap, useGSAP, MOTION, playWhileVisible, rng } from "../../lib/gsap";
import Hud from "./Hud";
import PosterHud from "./PosterHud";

const r = rng(3);
const PILE = Array.from({ length: 16 }, (_, i) => ({
  x: 238 + (i % 6) * 25 + r() * 10,
  y: 462 - Math.floor(i / 6) * 17 - r() * 6,
}));
const TIPS = ["+2 XLM", "+0.5 XLM", "+5 XLM", "+1 XLM", "+10 XLM", "+2 XLM"];
const HASHES = ["7f3a…e21c", "b09d…41fa", "c3e1…9d07", "2a7f…b3c8", "e44b…0a19", "91cd…7e52"];

function Coin({ x, y, ...rest }) {
  return (
    <g transform={`translate(${x} ${y})`} {...rest}>
      <g data-spin>
        <circle r="17" fill="var(--color-taxi)" stroke="#0a0a09" strokeWidth="2" />
        <circle r="10.5" fill="none" stroke="#0a0a09" strokeWidth="1.5" strokeOpacity="0.55" />
      </g>
    </g>
  );
}

// Coins drop into a jar; every landing is another on-chain transaction.
export default function TipJarPoster() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const total = { v: 128.5 };
        const totalEl = q("[data-total]")[0];
        const drops = q("[data-drop]").map((coin, i) =>
          gsap
            .timeline({ repeat: -1, delay: i * 0.9, repeatDelay: 1.2 })
            .fromTo(coin, { y: -60, x: 290 + i * 12, autoAlpha: 1 }, { y: 400 - i * 8, duration: 0.9, ease: "bounce.out" })
            .fromTo(coin.querySelector("[data-spin]"), { scaleX: 1 }, { scaleX: 0.15, transformOrigin: "50% 50%", duration: 0.15, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0)
            .add(() => {
              total.v += [2, 0.5, 5][i];
              totalEl.textContent = `${total.v.toFixed(1)} XLM`;
            }, 0.45)
            .to(coin, { autoAlpha: 0, duration: 0.3 }, "+=0.4")
        );
        const ticker = gsap.to(q("[data-feed]"), { y: -22 * TIPS.length, duration: 14, ease: "none", repeat: -1 });
        playWhileVisible(ref.current, [...drops, ticker]);
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="absolute inset-0 bg-[#0a0a09]" aria-hidden="true">
    <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <clipPath id="tipjar-feed">
          <rect x="400" y="366" width="184" height="112" />
        </clipPath>
      </defs>

      <g transform="translate(-34 0)">
        {PILE.map((c, i) => (
          <Coin key={i} x={c.x} y={c.y} />
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i} data-drop style={{ visibility: "hidden" }}>
            <Coin x={0} y={0} />
          </g>
        ))}

        <g fill="none" stroke="var(--color-bone)" strokeWidth="3">
          <rect x="236" y="128" width="128" height="24" />
          <path d="M250 152 V176 H350 V152" />
          <path d="M250 176 Q205 184 205 226 V454 Q205 500 250 500 H350 Q395 500 395 454 V226 Q395 184 350 176" />
        </g>
        <path d="M222 236 V430" stroke="var(--color-bone)" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
      </g>

      <g clipPath="url(#tipjar-feed)">
        <g data-feed>
          {[...TIPS, ...TIPS].map((t, i) => (
            <g key={i}>
              <Hud x="404" y={384 + i * 22} size={10} opacity={0.45}>
                tx {HASHES[i % HASHES.length]}
              </Hud>
              <Hud x="580" y={384 + i * 22} size={10} anchor="end" opacity={0.9} fill="var(--color-taxi)">
                {t}
              </Hud>
            </g>
          ))}
        </g>
      </g>
    </svg>
    <PosterHud
      tl={
        <>
          Tip jar · Soroban testnet
          <br />
          <span className="opacity-60">Contract CA7Q…X2LM</span>
        </>
      }
      tr={
        <>
          Total tipped
          <br />
          <span data-total className="text-base text-taxi">
            128.5 XLM
          </span>
        </>
      }
      bl="No backend · no middlemen"
    />
    </div>
  );
}
