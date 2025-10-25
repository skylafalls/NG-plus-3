import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import vue2 from "@vitejs/plugin-vue2";

const config = defineConfig({
  base: "/NG-plus-3",
  plugins: [vue2()],
  resolve: {
    extensions: [".js", ".ts", ".json", ".vue"],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  experimental: {
    enableNativePlugin: true,
  },
  build: {
    minify: "esbuild",
  },
});

export default config;
