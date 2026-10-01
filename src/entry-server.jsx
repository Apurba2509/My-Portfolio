import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

// Used at build time by scripts/prerender.js to turn the page into real HTML.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
