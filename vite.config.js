const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react").default;
const tailwindcss = require("@tailwindcss/vite").default;
const path = require("path");

module.exports = defineConfig({
  root: "frontend",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "frontend/src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
