import { resolve } from "node:path";
import { mergeConfig, defineConfig } from "vite";
import { libConfig } from "@monorepo-test/vite/configs";

export default mergeConfig(
  libConfig,
  defineConfig({
    resolve: {
      alias: {
        "%helpers": resolve(__dirname, "src"),
      },
    },
  })
);
