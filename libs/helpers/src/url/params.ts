import { StringObject } from "$root/types";

/**
 * Extract all the matching params from a url.
 * @param url the url to get the prefixed params from
 * @param prefixes the prefixes to look for in the given `url`
 * @returns the params matching the gven `prefixes` as a `StringObject`
 */
export const getPrefixedParams = (
  url: string,
  ...prefixes: string[]
): StringObject => {
  const urlParams = [...new URLSearchParams(new URL(url).search).entries()];
  let extractedParams: [string, string][] = [];

  for (const prefix of prefixes) {
    extractedParams = [
      ...extractedParams,
      ...urlParams.filter(
        (entry) => entry[0].substring(0, prefix.length) === prefix
      ),
    ];
  }

  return extractedParams.reduce(
    (acc, [key, value]) => Object.assign(acc, { [key]: value }),
    {}
  );
};
