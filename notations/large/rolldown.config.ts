import { defineConfig } from "rolldown";
import { minify } from "rollup-plugin-swc3";
import nodeResolvePlugin from "@rollup/plugin-node-resolve";

const config = defineConfig({
  input: "src/index.ts",
  output: [{
    format: "umd",
    file: "dist/ad-notations.umd.js",
    name: "ADNotationsLarge",
  }, {
    format: "umd",
    file: "dist/ad-notations.min.js",
    plugins: [minify()],
    name: "ADNotationsLarge",
  }, {
    format: "esm",
    file: "dist/ad-notations.esm.js",
  }],
  plugins: [nodeResolvePlugin()]
});

export default config;
