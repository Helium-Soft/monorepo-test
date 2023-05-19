import { describe, it, expect } from "vitest";
import { getPrefixedParams } from "$url/params";

describe.concurrent("[Helpers] URL - Params", () => {
  it("should return the requested params from the url", () => {
    const url =
      "https://www.website.com/?f=3&hc_track=1&utm_source=google&gd=rel&utm_campaign=newsletter";

    const expected = {
      hc_track: "1",
      utm_source: "google",
      utm_campaign: "newsletter",
    };

    expect(getPrefixedParams(url, "hc_", "utm_")).toEqual(expected);
    expect(getPrefixedParams(url, "gid_")).toEqual({});
  });
});
