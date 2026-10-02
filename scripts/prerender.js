// Runs after both Vite builds: renders the app to HTML and writes it into dist/index.html, so
// search engines, AI crawlers and link previews get the full page without running JavaScript.
// The browser then hydrates that HTML instead of building the page from scratch.

import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const appHtml = render();

// Preload the two fonts the hero needs, so the first paint isn't waiting on CSS to discover them.
const assets = readdirSync(path.join(dist, "assets"));
const fonts = ["archivo-latin-wdth-normal", "instrument-serif-latin-400-italic"]
  .map((name) => assets.find((file) => file.startsWith(name) && file.endsWith(".woff2")))
  .filter(Boolean)
  .map((file) => `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");

const indexPath = path.join(dist, "index.html");
const template = readFileSync(indexPath, "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error("dist/index.html has no empty #root to fill");

// Inline the stylesheet: one page, one round trip, and nothing blocking the first render.
const cssLink = template.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
const css = cssLink ? readFileSync(path.join(dist, cssLink[1]), "utf8").replace(/<\/style/gi, "<\\/style") : null;

let page = template
  .replace("</title>", `</title>\n    ${fonts}`)
  .replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`);
if (cssLink) page = page.replace(cssLink[0], () => `<style>${css}</style>`);

writeFileSync(indexPath, page);
rmSync(ssrDir, { recursive: true, force: true });

console.log(
  `Prerendered dist/index.html (${Math.round(appHtml.length / 1024)} KB of HTML, ` +
    `${fonts ? "fonts preloaded" : "no fonts found"}, ${css ? "CSS inlined" : "CSS left linked"})`
);
