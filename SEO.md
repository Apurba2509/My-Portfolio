# Search & AI visibility

How this site is set up to be found on Google and Bing, and quoted by AI engines (ChatGPT, Perplexity,
Gemini, Claude, Google AI Overviews), plus the steps only you can do.

| Term | Means | What it needs |
| --- | --- | --- |
| **SEO** | Search engine optimization | Crawlable HTML, good titles and descriptions, structured data, speed |
| **SIO** | Search intent optimization | Answering what people actually search for: your name, your skills, how to hire or contact you |
| **AEO** | Answer engine optimization | Short, direct answers that Google snippets and voice assistants can lift |
| **GEO / AIO** | Generative engine / AI optimization | Content AI crawlers can read without JavaScript, clear facts about you, consistent profiles everywhere |

---

## What's built in

All of it is generated from `src/data/content.js` at build time, so it stays in sync with the page.

- **Pre-rendered HTML** (`scripts/prerender.js`). The whole page ships as real HTML. Most AI crawlers don't run
  JavaScript, so before this they saw an empty page. Now they get every word.
- **Head tags** (`scripts/seo.js`): title, description, canonical URL, robots rules, Open Graph and Twitter
  cards with `og.jpg`, `rel="me"` links to your profiles, favicons, and a web manifest.
- **Structured data** (JSON-LD): one connected graph of `WebSite`, `ProfilePage`, `Person` (role, location,
  college, communities, skills, profiles), `ItemList` of your projects as `SoftwareSourceCode`, and `FAQPage`.
- **Quick answers section** (`0.9`, `src/components/Faq.jsx`): six questions people ask about you, answered in
  plain sentences. Visible on the page and published as FAQ data.
- **`/robots.txt`**: everything is allowed, and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
  and others) are named explicitly. Points to the sitemap.
- **`/sitemap.xml`**: the page plus your portrait for image search. `lastmod` updates on every build.
- **`/llms.txt`**: a plain-language brief about you, your work and your links, written for language models.
- **Speed**: hero fonts are preloaded, the hero name starts at its final size (no layout jump), images are
  WebP with JPG fallback, and hashed assets are cached for a year.
- **Image names**: portraits are named `apurba-das-*.jpg` so they rank for your name in image search.

---

## Google Search Console: do this once

1. Open [search.google.com/search-console](https://search.google.com/search-console) and sign in.
2. **Add property → URL prefix** → `https://apurba2509-portfolio.vercel.app/`.
   (The *Domain* option needs DNS access, which you don't have on a `vercel.app` address.)
3. **Verify** with the **HTML tag** method. Copy only the `content="…"` value, paste it into
   `googleVerification` in `src/data/content.js`, then deploy (commit and push). Once Vercel has finished, click
   **Verify** in Search Console.
   *Alternative:* the **HTML file** method. Download the `google….html` file, put it in `public/`, deploy, verify.
4. **Sitemaps** (left menu) → enter `sitemap.xml` → **Submit**. It should say *Success*.
5. **URL inspection** (search bar at the top) → paste the homepage URL → **Test live URL**.
   - Check *Page is available to Google*.
   - Open **View tested page → HTML** and confirm you can see your project names and the FAQ text.
   - Then click **Request indexing**.
6. Wait 3–7 days, then check:
   - **Pages** → the homepage should be *Indexed*.
   - **Enhancements → Profile page** → should be valid with no errors. Fix anything it flags.
   - **Performance** → the queries people use to find you (`apurba das`, `apurba das kolkata`, `apurba2509`).
7. Whenever you make a big change, use **URL inspection → Request indexing** again.

## Bing Webmaster Tools: do this too

Bing's index powers ChatGPT search and Microsoft Copilot, so it matters for AI answers.

1. Open [bing.com/webmasters](https://www.bing.com/webmasters) and sign in.
2. Choose **Import from Google Search Console**. That's the fastest route, and it brings the site and sitemap
   across. Otherwise add the site and verify with the meta tag: put the code in `bingVerification` in
   `content.js` and deploy.
3. **Sitemaps** → confirm `https://apurba2509-portfolio.vercel.app/sitemap.xml` is listed.
4. **URL Submission** → submit the homepage.

## Check your work

- Rich results: [search.google.com/test/rich-results](https://search.google.com/test/rich-results) (paste the URL)
- Schema: [validator.schema.org](https://validator.schema.org)
- Speed: [pagespeed.web.dev](https://pagespeed.web.dev)
- Link previews: [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/) (also refreshes LinkedIn's cache)
- What AI crawlers see: open `/llms.txt`, or view the page source and confirm the text is in the HTML

---

## Off the site: where most "Apurba Das" ranking comes from

Other people share your name, so search engines and AI need consistent signals that this site, your GitHub and
your LinkedIn are all the same person.

1. **Get a custom domain.** This is the biggest single upgrade, e.g. `apurbadas.dev` or `apurbadas.in`. Add it
   in Vercel → *Domains*, then change `site.url` in `content.js`, and add the new domain to Search Console as a
   *Domain* property.
2. **Link to the site everywhere you exist**, with the same name, photo and one-line bio:
   - GitHub (profile *Website* field and profile README)
   - LinkedIn (*Contact info → Website*, plus a *Featured* link)
   - Instagram bio
   - Your Google Developer Profile (g.dev), Devpost or Unstop hackathon profiles, Peerlist, dev.to or Hashnode
3. **On every project repo**, set the *Website* field (right sidebar on GitHub) to the live site or this
   portfolio, and link back to the portfolio in the README.
4. **Ask to be linked** from GDG On-Campus TMSL team pages, hackathon results posts and club pages. Links from
   real communities are the strongest signal you can get.

## Keep it fresh

- Edit `src/data/content.js` whenever something changes, and update `site.updated`. The page, structured data,
  `llms.txt` and FAQ all follow.
- The sitemap date and the structured data's `dateModified` update by themselves on every build.
- Add a question to `faq` whenever people keep asking you the same thing.
