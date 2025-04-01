import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "./src/component"),
      "@hooks": path.resolve(__dirname, "./src/hook"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@router": path.resolve(__dirname, "./src/router"),
    },
  },
});
