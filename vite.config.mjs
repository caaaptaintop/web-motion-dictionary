import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: { outDir: "dist/client" },
  optimizeDeps: { include: ["react", "react-dom/client"] },
  plugins: [react()],
});
