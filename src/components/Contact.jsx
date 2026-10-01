import { useRef, useState } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { scrollToTarget } from "../lib/smooth";
import { emailjs, site, socials } from "../data/content";
import { Arrow } from "./Icons";
import LocalTime from "./LocalTime";
import Magnetic from "./Magnetic";
import SplitReveal from "./SplitReveal";

const FIELDS = [
  { name: "name", label: "Your name", type: "text", placeholder: "What should I call you?", autoComplete: "name" },
  { name: "email", label: "Your email", type: "email", placeholder: "Where can I reply?", autoComplete: "email" },
];

const STATUS = {
  sending: "Sending…",
  sent: "Thanks — your message is in. I’ll reply soon.",
  error: "That didn’t go through. Try again, or email me directly.",
  invalid: "Please fill in your name, a valid email and a message.",
};

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", company: "" });
  const [status, setStatus] = useState("idle");

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.company) return; // Bots fill the hidden field; people never see it.
    if (!form.name.trim() || !form.message.trim() || !e.currentTarget.checkValidity()) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const { default: client } = await import("@emailjs/browser");
      await client.send(
        emailjs.serviceId,
        emailjs.templateId,
        {
          from_name: form.name,
          to_name: site.first,
          from_email: form.email,
          reply_to: form.email,
          to_email: site.email,
          message: form.message,
        },
        { publicKey: emailjs.publicKey }
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "", company: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const input =
    "w-full border-b-2 border-ink/25 bg-transparent py-3 text-[clamp(1.15rem,1.6vw,1.5rem)] outline-none transition-colors placeholder:text-ink/40 focus:border-ink focus-visible:outline-none";

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-8" aria-describedby="form-status">
      {FIELDS.map((f, i) => (
        <label key={f.name} className="block">
          <span className="label">
            ({String(i + 1).padStart(2, "0")}) {f.label}
          </span>
          <input
            name={f.name}
            type={f.type}
            required
            value={form[f.name]}
            onChange={update}
            placeholder={f.placeholder}
            autoComplete={f.autoComplete}
            className={input}
          />
        </label>
      ))}
      <label className="block">
        <span className="label">(03) Your message</span>
        <textarea
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={update}
          placeholder="An idea, a project, a hackathon team…"
          className={`${input} resize-none`}
        />
      </label>
      <label className="absolute -left-[9999px]" aria-hidden="true">
        Company
        <input name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={update} />
      </label>

      <div className="flex flex-wrap items-center gap-6">
        <Magnetic>
          <button
            type="submit"
            disabled={status === "sending"}
            className="label inline-flex items-center gap-3 bg-ink px-7 py-4 text-taxi transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60"
          >
            {status === "sending" ? "Sending" : "Send message"} <Arrow />
          </button>
        </Magnetic>
        <p id="form-status" role="status" aria-live="polite" className="label max-w-[34ch]">
          {STATUS[status] ?? ""}
        </p>
      </div>
    </form>
  );
}

export default function Contact() {
  const root = useRef(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.from("[data-giant]", {
          yPercent: 30,
          ease: "none",
          scrollTrigger: { trigger: "[data-giant-wrap]", start: "top bottom", end: "bottom bottom", scrub: true },
        });
      });
    },
    { scope: root }
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <footer id="contact" ref={root} data-theme="taxi" aria-labelledby="contact-title" className="on-taxi relative overflow-clip bg-taxi text-ink">
      <div className="px-5 pt-28 md:px-10 md:pt-40">
        <div className="label flex justify-between gap-6">
          <span>1.0 — Contact</span>
          <span>You made it to one.</span>
        </div>

        <SplitReveal as="h2" id="contact-title" className="display mt-8 text-[clamp(4rem,12.5vw,13.5rem)]">
          Let’s take it
          <br />
          from zero
          <br />
          <span className="inline-flex items-center gap-[0.12em]">
            <Arrow /> one.
          </span>
        </SplitReveal>

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-16 border-t border-ink/20 pt-8 md:mt-24">
          <div className="col-span-12 lg:col-span-6">
            <p className="label">Write to me</p>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <a
                href={`mailto:${site.email}`}
                className="link-draw text-[clamp(1.45rem,3.3vw,3.2rem)] font-semibold tracking-[-0.03em] break-all"
              >
                {site.email}
              </a>
              <button type="button" onClick={copy} className="label border border-ink/40 px-2.5 py-1 transition-colors hover:bg-ink hover:text-taxi">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <ul className="mt-12 border-t border-ink/20">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 border-b border-ink/20 py-4 transition-[padding] duration-500 hover:px-3"
                  >
                    <span className="display text-[clamp(1.9rem,3vw,2.8rem)]">{s.label}</span>
                    <span className="label flex items-center gap-3">
                      <span className="hidden sm:inline">{s.handle}</span>
                      <Arrow direction="up-right" className="transition-transform duration-500 group-hover:rotate-45" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative col-span-12 lg:col-span-5 lg:col-start-8">
            <p className="label mb-8">Or leave a note</p>
            <ContactForm />
          </div>
        </div>

        <div className="label mt-24 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-ink/20 py-5 md:mt-32">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>
            {site.location} — <LocalTime />
          </span>
          <span>Updated {site.updated}</span>
          <span>Built with React, GSAP & Lenis</span>
          <button type="button" onClick={() => scrollToTarget(0, { duration: 2.2 })} className="link-draw uppercase">
            Back to top ↑
          </button>
        </div>
      </div>

      <div data-giant-wrap className="overflow-clip px-5 pb-[3vw] md:px-10" aria-hidden="true">
        <p data-giant className="display text-center text-[29vw] leading-[0.86] whitespace-nowrap">
          {site.first}
        </p>
      </div>
    </footer>
  );
}
