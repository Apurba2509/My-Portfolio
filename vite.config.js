import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import seo from "./scripts/seo.js";

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  server: {
    port: 5173,
  },
});
