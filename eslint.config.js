// @ts-check
import vue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin";

const config = [
  ...vue.configs["flat/vue2-recommended"],
  stylistic.configs.recommended,
  {
    rules: {
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/curly-newline": ["error", "always"],
      "@stylistic/brace-style": ["error", "1tbs"],
    },
  },
];

export default config;
