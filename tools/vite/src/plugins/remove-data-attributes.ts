import { parse } from "node:path";
import type { Plugin } from "vite";

interface RemoveDataAttributesPluginOptions {
  /**
   * @property the data attributes to remove.
   */
  attributes: string[];

  /**
   * @property the extensions of files to search (`html` is already included).
   */
  extensions?: string[];
}

/**
 * Custom plugin for Vite to remove data attributes from source files before the build.
 * @param options the `RemoveDataAttributesPluginOptions` to configure the plugin's behavior
 * @returns the Remove Data Attributes plugin
 */
const removeDataAttributesPlugin = (
  options: RemoveDataAttributesPluginOptions
): Plugin => ({
  name: "vite-plugin-remove-data-attributes",
  apply: "build",
  enforce: "pre",
  transform: (code, id) => {
    if (!options.extensions) {
      options.extensions = [];
    }

    const { attributes, extensions } = options;

    if (
      [".html", ...extensions.map((ext) => `.${ext}`)].includes(parse(id).ext)
    ) {
      code = code.replaceAll(
        new RegExp(`data-(${attributes.join("|")})="\\w+"`, "gi"),
        ""
      );
    }

    return { code };
  },
});

export default removeDataAttributesPlugin;
