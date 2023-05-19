import { resolve } from "node:path";
import { mergeConfig, defineConfig } from "vite";
import { libConfig } from "@monorepo-test/vite/configs";

export default mergeConfig(
  libConfig,
  defineConfig({
    resolve: {
      alias: {
        $root: resolve(__dirname, "src"),
        $url: resolve(__dirname, "src", "url"),
      },
    },
  })
);
