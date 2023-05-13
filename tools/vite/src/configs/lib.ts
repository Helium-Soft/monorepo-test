import { resolve } from "node:path";
import {
  mergeConfig as mergeTestConfig,
  defineConfig as defineTestConfig,
} from "vitest/config";
import { baseTestConfig } from "./base.js";

/**
 * Lib configuration for Vitest.
 * The `coverage` directory will be generated inside the test directory as there is
 * no `public` directory in a `lib` project.
 */
const libTestConfig = mergeTestConfig(
  defineTestConfig(baseTestConfig),
  defineTestConfig({
    test: {
      coverage: {
        reportsDirectory: resolve(process.cwd(), "test", "coverage"),
      },
    },
  })
);

export default libTestConfig;
