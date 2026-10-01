import { useRef } from "react";
import { gsap, useGSAP, DESKTOP_MOTION } from "../lib/gsap";
import { journey } from "../data/content";
import SplitReveal from "./SplitReveal";

const pad = (n) => String(n).padStart(2, "0");

const STYLE = {
  Hackathon: "bg-bone text-ink border-ink/20",
  Organizer: "on-taxi bg-taxi text-ink border-ink/20",
  Community: "bg-ink text-bone border-ink",
  "Open source": "on-taxi bg-taxi text-ink border-ink/20",
  Work: "bg-bone-2 text-ink border-ink/20",
  Education: "bg-bone-2 text-ink border-ink/20",
};

// Hackathons, community roles and open source, as a sideways-scrolling wall on desktop.
export default function Journey() {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const track = q("[data-track]")[0];
        const count = q("[data-count]")[0];
        const bar = q("[data-bar]")[0];
        // How far the row slides: the whole row plus a little breathing room, minus what's
        // already visible. scrollWidth measures the content and ignores the row's own transform.
        const distance = () => Math.max(0, track.scrollWidth + window.innerWidth * 0.08 - track.clientWidth);

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              count.textContent = pad(Math.min(journey.length, Math.round(self.progress * (journey.length - 1)) + 1));
              bar.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        q("[data-item]").forEach((item, i) => {
          gsap.from(item, {
            y: i % 2 ? -40 : 40,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              containerAnimation: slide,
              start: "left right",
              end: "left 55%",
              scrub: true,
            },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section id="journey" ref={root} data-theme="light" aria-labelledby="journey-title" className="on-bone relative overflow-clip bg-bone text-ink">
      <div className="flex flex-col lg:motion-safe:h-[100svh] lg:motion-safe:flex-row">
        <header className="relative z-10 flex shrink-0 flex-col justify-center bg-bone px-5 pt-28 md:px-10 lg:motion-safe:w-[38vw] lg:motion-safe:border-r lg:motion-safe:border-ink/15 lg:motion-safe:pt-0">
          <p className="label text-mute-ink">0.6 — Journey</p>
          <SplitReveal as="h2" id="journey-title" className="display mt-5 text-[clamp(4rem,11vw,9.5rem)] lg:motion-safe:text-[clamp(4rem,7.2vw,8.5rem)]">
            Off the
            <br />
            keyboard
          </SplitReveal>
          <p className="serif mt-6 max-w-[24ch] text-[clamp(1.4rem,2vw,2.1rem)] leading-[1.05]">
            Hackathons shipped against the clock, communities I help run, and open source I contribute to.
          </p>
          <div className="label mt-10 hidden items-center gap-4 lg:motion-safe:flex" aria-hidden="true">
            <span className="tabular">
              <span data-count>01</span> / {pad(journey.length)}
            </span>
            <span className="relative h-px w-40 bg-ink/20">
              <span data-bar className="absolute inset-0 origin-left bg-ink" style={{ transform: "scaleX(0)" }} />
            </span>
          </div>
        </header>

        <ol
          data-track
          className="grid grid-cols-1 gap-3 px-5 pt-12 pb-28 sm:grid-cols-2 md:px-10 lg:motion-safe:flex lg:motion-safe:min-w-0 lg:motion-safe:flex-1 lg:motion-safe:items-center lg:motion-safe:gap-5 lg:motion-safe:py-0 lg:motion-safe:pl-10"
        >
          {journey.map((j, i) => (
            <li
              key={j.title}
              data-item
              className={`flex min-h-[250px] shrink-0 flex-col justify-between border p-5 md:p-6 lg:motion-safe:h-[66vh] lg:motion-safe:max-h-[560px] lg:motion-safe:w-[clamp(280px,23vw,360px)] ${STYLE[j.type]}`}
            >
              <div className="label flex items-start justify-between gap-3">
                <span className={`px-2 py-1 ${j.type === "Community" ? "bg-taxi text-ink" : "bg-ink text-bone"}`}>{j.type}</span>
                {j.when && <span className="pt-1 text-right">{j.when}</span>}
              </div>
              <span className="display outline-text my-6 text-[clamp(4.5rem,8vw,8.5rem)] opacity-40" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <div>
                <h3 className="display text-[clamp(1.9rem,2.5vw,2.8rem)] leading-[0.9]">{j.title}</h3>
                <p className="mt-3 text-[15px] leading-snug opacity-80">{j.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
