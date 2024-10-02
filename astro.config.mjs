import {defineConfig} from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://nif-dashboard-riley45-c15310d27d07474987c11102447766eb05df9900c.sd-pages.llnl.gov/',
  server: {
      host: true, // Ensures it listens on 0.0.0.0 (all network interfaces)
      port: 3000, // Port where the app will run
      },
  prefetch: true,
  integrations: [tailwind(), sitemap()],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});