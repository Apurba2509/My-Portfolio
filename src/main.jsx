import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./index.css";
import App from "./App";

if (!location.hash) window.scrollTo(0, 0);

// Production pages arrive pre-rendered (see scripts/prerender.js), so React hydrates the existing
// HTML. The dev server sends an empty root and renders from scratch.
const root = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);

console.log(
  "%cAPURBA DAS%c\nBuilt from zero to one with React, GSAP & Lenis.\nPress G to see the grid.\nSource: https://github.com/Apurba2509/My-Portfolio",
  "font: 900 28px 'Archivo Variable', sans-serif; font-stretch: 62%; color: #0a0a09; background: #ffd100; padding: 4px 10px;",
  "font: 12px 'JetBrains Mono Variable', monospace; line-height: 1.6;"
);
