import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const logoPath = fileURLToPath(new URL("./src/logo.svg", import.meta.url));

function inlineFavicon(): Plugin {
  return {
    name: "inline-favicon",
    transformIndexHtml(html) {
      const svg = readFileSync(logoPath, "utf-8");
      const href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      return html.replace(
        /<!-- inline-favicon -->/,
        `<link rel="icon" type="image/svg+xml" href="${href}" />`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), inlineFavicon(), viteSingleFile()],
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
