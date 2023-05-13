import { mergeConfig, defineConfig } from "vite";
import baseConfig from "./base.js";

/**
 * Package configuration for Vite.
 * A `package` project is built as a minified bundle with a `iife` format.
 */
const packageConfig = mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      rollupOptions: {
        output: {
          format: "iife",
          entryFileNames: ({ name }) => `${name}.min.js`,
        },
      },
    },
  })
);

export default packageConfig;
