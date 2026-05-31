import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const rawPort = process.env.PORT || "18540";
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || "/";
const isDev = process.env.NODE_ENV !== "production";
const isReplit = process.env.REPL_ID !== undefined;

export default defineConfig({
  base: basePath,
  define: {
    'process.env.MONACO_EDITOR_ASSET_PATH': JSON.stringify('/monaco-editor/min/vs/'),
  },
  plugins: [
    react(),
    tailwindcss(),
    ...(isDev && isReplit
      ? [
          (await import("@replit/vite-plugin-runtime-error-modal")).default(),
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      "monaco-editor": path.resolve(import.meta.dirname, "node_modules/monaco-editor"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["@monaco-editor/react"],
    exclude: ["@replit/vite-plugin-runtime-error-modal"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'monaco': ['@monaco-editor/react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: false,
      allow: ['..', 'node_modules'],
    },
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("error", () => {});
        },
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
