import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const faviconPath = fileURLToPath(
  new URL("./src/assets/favicon.png", import.meta.url),
);

function inlineFavicon(): Plugin {
  return {
    name: "inline-favicon",
    transformIndexHtml(html) {
      const png = readFileSync(faviconPath);
      const href = `data:image/png;base64,${png.toString("base64")}`;
      return html.replace(
        /<!-- inline-favicon -->/,
        `<link rel="icon" type="image/png" href="${href}" />`,
      );
    },
  };
}

export default defineConfig({
  root: "./src",
  publicDir: false,
  plugins: [react(), inlineFavicon(), viteSingleFile()],
  base: "./",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
