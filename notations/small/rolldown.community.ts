import { defineConfig } from "rolldown";
import { minify } from "rollup-plugin-swc3";
import nodeResolve from "@rollup/plugin-node-resolve";

const config = defineConfig({
  input: "src/community/index.ts",
  output: [{
    format: "umd",
    file: "dist/ad-notations.community.umd.js",
    name: "ADNotationsSmall",
  }, {
    format: "umd",
    file: "dist/ad-notations.community.min.js",
    plugins: [minify()],
    name: "ADNotationsSmall",
  }, {
    format: "esm",
    file: "dist/ad-notations.community.esm.js",
  }],
  plugins: [nodeResolve()]
});

export default config;
