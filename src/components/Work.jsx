import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { moreWork, projects, socials } from "../data/content";
import { posters } from "./posters";
import { Arrow } from "./Icons";
import SplitReveal from "./SplitReveal";

const TONES = {
  ink: {
    card: "bg-ink-2 text-bone border-bone/15",
    line: "border-bone/15",
    soft: "text-bone/70",
    btn: "border-bone/30 hover:bg-bone hover:text-ink",
  },
  bone: {
    card: "on-bone bg-bone text-ink border-ink/15",
    line: "border-ink/15",
    soft: "text-ink/70",
    btn: "border-ink/30 hover:bg-ink hover:text-bone",
  },
  taxi: {
    card: "on-taxi bg-taxi text-ink border-ink/20",
    line: "border-ink/20",
    soft: "text-ink/75",
    btn: "border-ink/35 hover:bg-ink hover:text-taxi",
  },
};

const pad = (n) => String(n).padStart(2, "0");
const STACKING = "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";

function ProjectCard({ project, index, total }) {
  const tone = TONES[project.tone];
  const Poster = posters[project.poster];
  const primary = project.links[0];

  return (
    <article data-stack-card className="stack-card" style={{ zIndex: index + 1 }} aria-labelledby={`${project.id}-title`}>
      <div data-card-inner className={`relative flex h-full flex-col overflow-hidden border ${tone.card}`}>
        <div data-shade className="pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" />

        <div className={`label flex items-center justify-between gap-4 border-b px-4 py-3 md:px-6 ${tone.line}`}>
          <span className="tabular">
            {pad(index + 1)} / {pad(total)}
          </span>
          <span className="hidden sm:block">{project.kind}</span>
          <span>{project.year}</span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-12">
          <div className="order-2 flex flex-col justify-between gap-10 p-5 md:p-8 lg:order-1 lg:col-span-5">
            <div>
              <SplitReveal as="h3" id={`${project.id}-title`} className="display text-[clamp(3rem,6.2vw,6.8rem)]">
                {project.title}
              </SplitReveal>
              <p className="serif mt-4 max-w-[22ch] text-[clamp(1.35rem,1.9vw,2.1rem)] leading-[1.05]">{project.tagline}</p>
            </div>
            <div>
              <p className={`max-w-[48ch] text-[15px] leading-relaxed ${tone.soft}`}>{project.description}</p>
              <ul className="label mt-5 flex flex-wrap gap-x-2 gap-y-1" aria-label="Built with">
                {project.stack.map((s, i) => (
                  <li key={s}>
                    {s}
                    {i < project.stack.length - 1 && <span className="ml-2 opacity-40">/</span>}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {project.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`label inline-flex items-center gap-2 border px-4 py-2.5 transition-colors duration-300 ${tone.btn}`}
                  >
                    {l.label}
                    <Arrow direction="up-right" />
                    <span className="sr-only">(opens {project.title} in a new tab)</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a
            href={primary.href}
            target="_blank"
            rel="noreferrer"
            tabIndex={-1}
            aria-hidden="true"
            data-cursor={primary.label === "Live site" ? "Visit" : "Code"}
            data-poster
            className={`relative order-1 block aspect-square overflow-hidden border-b lg:order-2 lg:col-span-7 lg:aspect-auto lg:border-b-0 lg:border-l ${tone.line}`}
          >
            <Poster />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const root = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        q("[data-poster]").forEach((poster) =>
          gsap.from(poster, {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.5,
            ease: "expo.inOut",
            scrollTrigger: { trigger: poster, start: "top 85%", once: true },
          })
        );
      });

      // Each card sinks back and darkens as the next one slides over it.
      mm.add(STACKING, () => {
        const cards = q("[data-stack-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap
            .timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top 8%", scrub: true } })
            .to(card.querySelector("[data-card-inner]"), { scale: 0.9, rotation: i % 2 ? 1.2 : -1.2, ease: "none" }, 0)
            .to(card.querySelector("[data-shade]"), { opacity: 0.6, ease: "none" }, 0);
        });
      });
    },
    { scope: root }
  );

  const github = socials.find((s) => s.label === "GitHub");

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="relative bg-ink px-5 pt-28 pb-28 md:px-10 md:pt-40 md:pb-40">
      <div className="grid grid-cols-12 gap-x-6 gap-y-6">
        <p className="label col-span-12 text-mute md:col-span-3">0.4 — Selected work</p>
        <div className="col-span-12 md:col-span-9">
          <SplitReveal as="h2" id="work-title" className="display text-[clamp(4.2rem,14vw,15rem)]">
            Selected
            <br />
            work<span className="label ml-2 align-top text-[0.9rem] text-taxi md:text-base">({pad(projects.length)})</span>
          </SplitReveal>
          <p className="serif mt-8 max-w-[26ch] text-[clamp(1.5rem,2.4vw,2.4rem)] leading-[1.05] text-bone/85">
            Things I’ve built lately: web, mobile, web3, and a little bit of outer space.
          </p>
        </div>
      </div>

      <div className="mt-20 flex flex-col gap-8 md:mt-28 lg:gap-[10vh]">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} total={projects.length} />
        ))}
      </div>

      <div className="mt-28 md:mt-40">
        <div className="flex items-end justify-between gap-6">
          <h3 className="label text-mute">Also built</h3>
          <a href={`${github.href}?tab=repositories`} target="_blank" rel="noreferrer" className="label link-draw inline-flex items-center gap-1.5">
            Every repo on GitHub <Arrow direction="up-right" />
          </a>
        </div>
        <ul className="mt-4 border-t border-bone/15">
          {moreWork.map((w) => (
            <li key={w.title}>
              <a
                href={w.href}
                target="_blank"
                rel="noreferrer"
                className="row-fill grid grid-cols-12 items-baseline gap-x-6 gap-y-2 border-b border-bone/15 px-1 py-6 transition-colors duration-300 md:px-3"
              >
                <span className="display col-span-9 text-[clamp(2.2rem,4.4vw,4.2rem)] md:col-span-4">{w.title}</span>
                <span className="label col-span-3 text-right md:order-last md:col-span-1">{w.year}</span>
                <span className="col-span-12 text-[15px] leading-snug opacity-80 md:col-span-4">{w.note}</span>
                <span className="label col-span-12 flex items-center justify-between gap-3 md:col-span-3">
                  {w.stack} <Arrow direction="up-right" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
