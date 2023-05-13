import { resolve } from "node:path";
import { rmSync } from "node:fs";
import type { Plugin } from "vite";

/**
 * Custom plugin for Vite to clean the build directory by removing unnecessary
 * files and directories.
 * @param paths the files and directories to remove from the build directory
 * @returns the Clean Build plugin
 */
const cleanBuildPlugin = (...paths: string[]): Plugin => ({
  name: "vite-plugin-clean-build",
  apply: "build",
  enforce: "post",
  writeBundle: () => {
    const buildDir = resolve(process.cwd(), "dist");

    for (const path of paths) {
      if (path.includes(".")) {
        rmSync(resolve(buildDir, path));
      } else {
        rmSync(resolve(buildDir, path), { recursive: true, force: true });
      }
    }
  },
});

export default cleanBuildPlugin;
