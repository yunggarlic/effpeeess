import { defineConfig } from "vite";
import path from "path";

export default defineConfig((env) => ({
  resolve: {
    alias: {
      // The alias name must match whatever you put in tsconfig.json
      "@types": path.resolve(__dirname, "src/types/index.ts"),
      "@core": path.resolve(__dirname, "src/core"),
      "@libs": path.resolve(__dirname, "src/libs"),
      "@listeners": path.resolve(__dirname, "src/listeners"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  build: {
    minify: env.mode === "production" ? "terser" : false,
    sourcemap: env.mode === "production",
  },
}));
