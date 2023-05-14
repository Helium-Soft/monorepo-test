import { mergeConfig, defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import packageConfig from "./package.js";

/**
 * Svelte configuration for Vite.
 * It uses the package configuration and adds the svelte plugin.
 */
const svelteConfig = mergeConfig(
  packageConfig,
  defineConfig({
    plugins: [svelte({ emitCss: false })],
  })
);

export default svelteConfig;
