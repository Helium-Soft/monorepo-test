import { resolve } from "node:path";
import {
  type UserConfig,
  defineConfig as defineTestConfig,
} from "vitest/config";
import { mergeConfig, defineConfig } from "vite";
import {
  cleanBuildPlugin,
  removeDataAttributesPlugin,
} from "../plugins/manifest.js";

/**
 * Base configuration for Vitest.
 * It uses `happy-dom` for browser implementations in the test environment and
 * `c8` for code coverage
 */
export const baseTestConfig: UserConfig = {
  test: {
    environment: "happy-dom",
    coverage: {
      provider: "c8",
      reportsDirectory: resolve(process.cwd(), "public", "coverage"),
    },
  },
};

/**
 * Base configuration for Vite.
 * It uses the custom plugins `clean-build` and `remove-data-attributes` to get rid of
 * test coverage files from the build directory and remove `data-testid` attributes
 * respectively
 */
const baseConfig = mergeConfig(
  defineTestConfig(baseTestConfig),
  defineConfig({
    server: {
      host: "0.0.0.0",
    },
    plugins: [
      removeDataAttributesPlugin({
        attributes: ["testid"],
      }),
      cleanBuildPlugin("coverage"),
    ],
  })
);

export default baseConfig;
