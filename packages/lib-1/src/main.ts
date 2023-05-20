import UrlParams, { type UrlParamsProps } from "$components/UrlParams.svelte";

customElements.define(
  "url-params",
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      let props: UrlParamsProps;

      if (this.getAttribute("url")) {
        props = {
          url: this.getAttribute("url"),
        };
      }

      new UrlParams({ target: this.shadowRoot, props });
    }
  }
);
