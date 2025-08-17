import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // корень фронта
  root: "client",
  // куда класть сборку (папка будет в корне репо)
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    // явная точка входа — твой client/index.html
    rollupOptions: {
      input: path.resolve(process.cwd(), "client/index.html"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client/src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
  },
});
