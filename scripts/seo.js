// Everything search engines and AI answer engines read, generated from src/data/content.js:
// the <head> tags (title, description, social cards, structured data) plus sitemap.xml,
// robots.txt, llms.txt and site.webmanifest. Edit the content file, rebuild, and it all follows.

import { about, faq, journey, moreWork, projects, site, socials, stack } from "../src/data/content.js";

const url = `${site.url}/`;
const portrait = `${site.url}/img/apurba-das-720.jpg`;
const ogImage = `${site.url}/og.jpg`;
// Google's Profile page format wants full ISO 8601 date-times (date, time and zone), not bare dates.
const now = () => new Date().toISOString();
const plain = (text) => text.replace(/\*/g, "");

const escapeAttr = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const meta = (key, value, attr = "name") => `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`;

// One linked graph: the site, the profile page, the person, their projects and the FAQ.
function structuredData() {
  const id = (name) => `${url}#${name}`;
  const skills = stack.flatMap((row) => row.items);
  const source = (p) => p.links.find((l) => /source/i.test(l.label))?.href;
  const live = (p) => p.links.find((l) => /live/i.test(l.label))?.href;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": id("website"),
        url,
        name: site.name,
        alternateName: [`${site.name} Portfolio`, site.handle],
        description: site.description,
        inLanguage: "en-IN",
        publisher: { "@id": id("person") },
      },
      {
        "@type": "ProfilePage",
        "@id": id("profile"),
        url,
        name: site.title,
        description: site.description,
        inLanguage: "en-IN",
        isPartOf: { "@id": id("website") },
        mainEntity: { "@id": id("person") },
        primaryImageOfPage: { "@id": id("portrait") },
        dateCreated: site.launched,
        dateModified: now(),
      },
      {
        "@type": "Person",
        "@id": id("person"),
        name: site.name,
        givenName: site.first,
        familyName: site.last,
        alternateName: site.handle,
        url,
        email: `mailto:${site.email}`,
        jobTitle: site.role,
        description: plain(about.manifesto),
        image: {
          "@type": "ImageObject",
          "@id": id("portrait"),
          url: portrait,
          width: 720,
          height: 900,
          caption: `${site.name}, ${site.role.toLowerCase()} from ${site.city}`,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: site.country,
        },
        affiliation: {
          "@type": "CollegeOrUniversity",
          name: site.school,
          address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
        },
        memberOf: journey
          .filter((j) => j.type === "Community")
          .map((j) => ({ "@type": "Organization", name: j.title, description: j.detail })),
        knowsAbout: skills,
        sameAs: socials.map((s) => s.href),
      },
      {
        "@type": "ItemList",
        "@id": id("projects"),
        name: "Selected work",
        itemListElement: [...projects, ...moreWork].map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareSourceCode",
            name: p.title,
            description: p.description ?? p.note,
            url: p.links ? (live(p) ?? source(p)) : p.href,
            codeRepository: p.links ? source(p) : p.href.includes("github.com") ? p.href : undefined,
            programmingLanguage: p.stack,
            author: { "@id": id("person") },
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": id("faq"),
        url: `${url}#faq`,
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

function headTags() {
  const imageAlt = `${site.name} — ${site.role.toLowerCase()}, ${site.city}`;
  const tags = [
    `<title>${escapeAttr(site.title)}</title>`,
    meta("description", site.description),
    meta("author", site.name),
    meta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"),
    `<link rel="canonical" href="${url}" />`,
    meta("theme-color", "#0a0a09"),

    `<link rel="icon" href="/favicon.ico" sizes="48x48" />`,
    `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`,
    `<link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
    `<link rel="manifest" href="/site.webmanifest" />`,

    meta("og:type", "profile", "property"),
    meta("og:site_name", site.name, "property"),
    meta("og:locale", "en_IN", "property"),
    meta("og:url", url, "property"),
    meta("og:title", site.title, "property"),
    meta("og:description", site.description, "property"),
    meta("og:image", ogImage, "property"),
    meta("og:image:width", "1200", "property"),
    meta("og:image:height", "630", "property"),
    meta("og:image:alt", imageAlt, "property"),
    meta("profile:first_name", site.first, "property"),
    meta("profile:last_name", site.last, "property"),
    meta("profile:username", site.handle, "property"),
    meta("twitter:card", "summary_large_image"),
    meta("twitter:title", site.title),
    meta("twitter:description", site.description),
    meta("twitter:image", ogImage),
    meta("twitter:image:alt", imageAlt),

    // rel="me" ties this site to the same person's profiles elsewhere.
    ...socials.map((s) => `<link rel="me" href="${s.href}" />`),
    `<link rel="alternate" type="text/plain" href="/llms.txt" title="${escapeAttr(site.name)} for language models" />`,
  ];

  if (site.googleVerification) tags.push(meta("google-site-verification", site.googleVerification));
  if (site.bingVerification) tags.push(meta("msvalidate.01", site.bingVerification));

  const json = JSON.stringify(structuredData()).replace(/</g, "\\u003c");
  tags.push(`<script type="application/ld+json">${json}</script>`);
  return tags.join("\n    ");
}

function robots() {
  return `# Everyone is welcome, including AI search and answer engines.
User-agent: *
Allow: /

# AI crawlers, named explicitly so a stricter default never shuts them out.
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: Meta-ExternalAgent
User-agent: CCBot
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;
}

function sitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${url}</loc>
    <lastmod>${now()}</lastmod>
    <image:image>
      <image:loc>${portrait}</image:loc>
    </image:image>
    <image:image>
      <image:loc>${site.url}/img/avatar/base.webp</image:loc>
    </image:image>
  </url>
</urlset>
`;
}

// llms.txt (llmstxt.org): a plain-language brief for ChatGPT, Claude, Perplexity and friends.
function llms() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `In ${site.first}’s words: ${plain(about.manifesto)}`,
    "",
    "## Profile",
    "",
    `- Role: ${site.role}`,
    `- Based in: ${site.city}, ${site.region}, India`,
    `- Studying: BCA at ${site.school} (2024–2028)`,
    `- Status: ${site.available} (internships, collaborations, hackathons, open source)`,
    `- Email: ${site.email}`,
    `- Website: ${url}`,
    "",
    "## Now",
    "",
    ...about.now.map((n) => `- ${n.k}: ${n.v}`),
    "",
    "## Selected work",
    "",
    ...projects.map((p) => {
      const links = p.links.map((l) => `[${l.label}](${l.href})`).join(", ");
      return `- **${p.title}** (${p.year}, ${p.kind}): ${p.tagline} ${p.description} Built with ${p.stack.join(", ")}. ${links}`;
    }),
    "",
    "## Also built",
    "",
    ...moreWork.map((w) => `- [${w.title}](${w.href}) (${w.year}): ${w.note}. ${w.stack}.`),
    "",
    "## Hackathons, community and experience",
    "",
    ...journey.map((j) => `- ${j.type}: ${j.title}${j.when ? ` (${j.when})` : ""}. ${j.detail}`),
    "",
    "## Skills",
    "",
    ...stack.map((row) => `- ${row.label}: ${row.items.join(", ")}`),
    "",
    "## FAQ",
    "",
    ...faq.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Links",
    "",
    ...socials.map((s) => `- [${s.label}](${s.href})`),
    "",
  ];
  return lines.join("\n");
}

function manifest() {
  return JSON.stringify(
    {
      name: `${site.name} — ${site.role}`,
      short_name: site.name,
      description: site.description,
      start_url: "/",
      display: "standalone",
      background_color: "#0a0a09",
      theme_color: "#0a0a09",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
      ],
    },
    null,
    2
  );
}

export default function seo() {
  let ssr = false;
  return {
    name: "portfolio-seo",
    configResolved(config) {
      ssr = Boolean(config.build.ssr);
    },
    transformIndexHtml(html) {
      return html.replace("<!--seo-->", headTags());
    },
    generateBundle() {
      if (ssr) return;
      const files = {
        "robots.txt": robots(),
        "sitemap.xml": sitemap(),
        "llms.txt": llms(),
        "site.webmanifest": manifest(),
      };
      for (const [fileName, source] of Object.entries(files)) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
    // The dev server serves the same files, so they can be checked before deploying.
    configureServer(server) {
      const files = { "/robots.txt": robots, "/sitemap.xml": sitemap, "/llms.txt": llms, "/site.webmanifest": manifest };
      server.middlewares.use((req, res, next) => {
        const make = files[req.url];
        if (!make) return next();
        res.setHeader("Content-Type", req.url.endsWith(".xml") ? "application/xml" : req.url.endsWith(".webmanifest") ? "application/manifest+json" : "text/plain; charset=utf-8");
        res.end(make());
      });
    },
  };
}
