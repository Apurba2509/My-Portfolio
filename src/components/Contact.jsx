import { useRef, useState } from "react";
import { gsap, useGSAP, MOTION } from "../lib/gsap";
import { scrollToTarget } from "../lib/smooth";
import { emailjs, site, socials } from "../data/content";
import { Arrow } from "./Icons";
import LocalTime from "./LocalTime";
import Magnetic from "./Magnetic";
import SplitReveal from "./SplitReveal";

// `agent` is the WebMCP description an AI agent sees for each field (see the form below).
const FIELDS = [
  {
    name: "name",
    label: "Your name",
    type: "text",
    placeholder: "What should I call you?",
    autoComplete: "name",
    agent: "The sender's name, so Apurba knows who is writing.",
  },
  {
    name: "email",
    label: "Your email",
    type: "email",
    placeholder: "Where can I reply?",
    autoComplete: "email",
    agent: "The sender's email address, where Apurba will reply.",
  },
];

const STATUS = {
  sending: "Sending…",
  sent: "Thanks — your message is in. I’ll reply soon.",
  error: "That didn’t go through. Try again, or email me directly.",
  invalid: "Please fill in your name, a valid email and a message.",
};

// The form is also a WebMCP tool (developer.chrome.com/docs/ai/webmcp): an AI agent helping a
// visitor can fill it in, but there is deliberately no toolautosubmit, so a person still clicks
// Send. Values are read from the form itself because an agent fills the fields directly.
function ContactForm() {
  const [status, setStatus] = useState("idle");

  const send = async (form) => {
    const data = Object.fromEntries(new FormData(form));
    if (data.company) return "Not sent."; // Bots fill the hidden field; people never see it.
    if (!data.name?.trim() || !data.message?.trim() || !form.checkValidity()) {
      setStatus("invalid");
      throw new Error(STATUS.invalid);
    }
    setStatus("sending");
    try {
      const { default: client } = await import("@emailjs/browser");
      await client.send(
        emailjs.serviceId,
        emailjs.templateId,
        {
          from_name: data.name,
          to_name: site.first,
          from_email: data.email,
          reply_to: data.email,
          to_email: site.email,
          message: data.message,
        },
        { publicKey: emailjs.publicKey }
      );
      setStatus("sent");
      form.reset();
      return `Message sent to ${site.name}. ${STATUS.sent}`;
    } catch (err) {
      console.error(err);
      setStatus("error");
      throw new Error(STATUS.error, { cause: err });
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const result = send(e.currentTarget);
    const native = e.nativeEvent;
    // Tell an agent how it went; for everyone else the status line below says it.
    if (native.agentInvoked && typeof native.respondWith === "function") native.respondWith(result);
    else result.catch(() => {});
  };

  const input =
    "w-full border-b-2 border-ink/25 bg-transparent py-3 text-[clamp(1.15rem,1.6vw,1.5rem)] outline-none transition-colors placeholder:text-ink/40 focus:border-ink focus-visible:outline-none";

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-8"
      aria-describedby="form-status"
      toolname="send_message_to_apurba"
      tooldescription={`Send a message to ${site.name}, a full-stack and mobile developer in Kolkata, about internships, collaborations, projects, hackathon teams or questions. The visitor reviews the message and presses Send.`}
    >
      {FIELDS.map((f, i) => (
        <label key={f.name} className="block">
          <span className="label">
            ({String(i + 1).padStart(2, "0")}) {f.label}
          </span>
          <input
            name={f.name}
            type={f.type}
            required
            placeholder={f.placeholder}
            autoComplete={f.autoComplete}
            toolparamdescription={f.agent}
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
          placeholder="An idea, a project, a hackathon team…"
          toolparamdescription="What the sender wants to say to Apurba: the opportunity, project or question."
          className={`${input} resize-none`}
        />
      </label>
      <label className="absolute -left-[9999px]" aria-hidden="true">
        Company
        <input name="company" tabIndex={-1} autoComplete="off" />
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
