import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare(),
  experimental: {
    session: true,
  },
  integrations: [react(), sitemap()],
  output: 'server',
  site: 'https://mnmm.xyz',
});
