<script context="module" lang="ts">
  export interface UrlParamsProps {
    url?: string;
  }
</script>

<script lang="ts">
  import { getPrefixedParams } from "@monorepo-test/helpers/url";

  export let url = window.location.href;
  let params: ReturnType<typeof getPrefixedParams>;

  $: if (url) {
    params = getPrefixedParams(url, "utm_", "hc_");
  }
</script>

<p>URL params of {url}:</p>
<ul>
  {#each Object.entries(params) as [k, v]}
    <li>{k}: {v}</li>
  {/each}
</ul>
