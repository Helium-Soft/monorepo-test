import eslintJS from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import svelteParser from "svelte-eslint-parser";
import sveltePlugin from "eslint-plugin-svelte";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  eslintJS.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    plugins: {
      svelte: sveltePlugin,
    },
    rules: {
      ...sveltePlugin.configs.recommended.rules,
      ...sveltePlugin.configs.prettier.rules,
    },
  },
  {
    files: ["**/*.{js,cjs,mjs,ts,svelte}"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-var": "error",
      "no-await-in-loop": "error",
      "no-duplicate-imports": "error",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["{libs,packages}/**/*.{js,cjs,mjs,ts,svelte}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  prettierConfig,
];
