import { faq } from "../data/content";
import SplitReveal from "./SplitReveal";

// Short, direct answers to the questions people (and answer engines) ask about Apurba.
// Native <details> keeps every answer in the HTML even while it's collapsed.
export default function Faq() {
  return (
    <section id="faq" data-theme="light" aria-labelledby="faq-title" className="on-bone relative bg-bone px-5 py-28 text-ink md:px-10 md:py-40">
      <div className="grid grid-cols-12 gap-x-6 gap-y-6">
        <p className="label col-span-12 text-mute-ink md:col-span-3">0.9 — Quick answers</p>
        <div className="col-span-12 md:col-span-9">
          <SplitReveal as="h2" id="faq-title" className="display text-[clamp(4rem,min(12vw,24svh),12.5rem)]">
            Quick
            <br />
            answers
          </SplitReveal>
        </div>
      </div>

      <div className="faq mt-16 grid grid-cols-12 gap-x-6 md:mt-24">
        <div className="col-span-12 border-t border-ink/20 md:col-span-9 md:col-start-4">
          {faq.map((item, i) => (
            <details key={item.q} name="faq" open={i === 0} className="group border-b border-ink/20">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[clamp(1.25rem,2.2vw,2rem)] leading-tight font-medium tracking-[-0.02em]">{item.q}</h3>
                <span
                  aria-hidden="true"
                  className="mt-1 grid size-8 shrink-0 place-items-center border border-ink/30 text-lg leading-none transition-transform duration-500 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[62ch] pb-8 text-[16px] leading-relaxed text-ink/80 md:text-[17px]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
