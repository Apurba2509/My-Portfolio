// WebMCP tools (developer.chrome.com/docs/ai/webmcp): a browser's AI agent can call these to get
// accurate facts about Apurba straight from src/data/content.js instead of scraping the page.
// All of them only read data or scroll the page. Browsers without WebMCP skip all of this.

import { about, faq, journey, moreWork, projects, site, socials, stack } from "../data/content";
import { scrollToTarget } from "./smooth";

const SECTIONS = ["top", "about", "work", "journey", "stack", "faq", "contact"];
const plain = (text) => text.replace(/\*/g, "");

const TOOLS = [
  {
    name: "get_apurba_profile",
    description:
      "Facts about Apurba Das: role, location, education, availability, current work, skills, hackathons, community roles and contact details.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () =>
      JSON.stringify({
        name: site.name,
        role: site.role,
        location: `${site.city}, ${site.region}, India`,
        education: `BCA at ${site.school} (2024–2028)`,
        availability: site.available,
        about: plain(about.manifesto),
        now: about.now.map((n) => `${n.k}: ${n.v}`),
        skills: Object.fromEntries(stack.map((row) => [row.label, row.items])),
        journey: journey.map((j) => ({ type: j.type, title: j.title, when: j.when, detail: j.detail })),
        contact: { email: site.email, website: site.url, profiles: socials.map((s) => s.href) },
        faq: faq.map((f) => ({ question: f.q, answer: f.a })),
      }),
  },
  {
    name: "list_apurba_projects",
    description: "Apurba Das's projects with what each one does, the tech used, the year and links to the live site and source code.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () =>
      JSON.stringify([
        ...projects.map((p) => ({
          title: p.title,
          year: p.year,
          kind: p.kind,
          summary: p.tagline,
          description: p.description,
          stack: p.stack,
          links: p.links,
        })),
        ...moreWork.map((w) => ({ title: w.title, year: w.year, description: w.note, stack: w.stack, links: [{ label: "Link", href: w.href }] })),
      ]),
  },
  {
    name: "go_to_section",
    description: `Scroll this page to one of its sections: ${SECTIONS.join(", ")}.`,
    inputSchema: {
      type: "object",
      properties: { section: { type: "string", enum: SECTIONS, description: "The section to scroll to." } },
      required: ["section"],
    },
    annotations: { readOnlyHint: true },
    execute: async ({ section }) => {
      if (!SECTIONS.includes(section)) return `Unknown section "${section}".`;
      scrollToTarget(section === "top" ? 0 : `#${section}`);
      return `Scrolled to the ${section} section.`;
    },
  },
];

export function registerAgentTools() {
  const context = typeof document !== "undefined" ? document.modelContext : null;
  if (!context?.registerTool) return () => {};
  const controller = new AbortController();
  for (const tool of TOOLS) {
    try {
      Promise.resolve(context.registerTool(tool, { signal: controller.signal })).catch(() => {});
    } catch {
      // An agent-facing extra; never let it break the page.
    }
  }
  return () => controller.abort();
}
