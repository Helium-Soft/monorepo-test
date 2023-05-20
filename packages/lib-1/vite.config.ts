import { resolve } from "node:path";
import { mergeConfig, defineConfig } from "vite";
import { svelteConfig } from "@monorepo-test/vite/configs";

export default mergeConfig(
  svelteConfig,
  defineConfig({
    resolve: {
      alias: {
        $root: resolve(__dirname, "src"),
        $components: resolve(__dirname, "src", "components"),
      },
    },
    build: {
      target: "es2015",
      rollupOptions: {
        input: {
          "lib-1": resolve(__dirname, "src", "main.ts"),
        },
      },
    },
  })
);
