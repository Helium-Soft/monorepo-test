import eslintJS from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
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
    files: ["**/*.{js,cjs,mjs,ts}"],
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
    files: ["{libs,packages}/**/*.{js,cjs,mjs,ts}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  prettierConfig,
];
