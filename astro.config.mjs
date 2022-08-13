import { defineConfig } from 'astro/config';
import prefetch from "@astrojs/prefetch";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://3n3a.ch",
  integrations: [prefetch(), sitemap()]
});