import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import Icons from "unplugin-icons/vite";
import tailwind from "@astrojs/tailwind";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: 'https://nif-dashboard-riley45-c15310d27d07474987c11102447766eb05df9900c.sd-pages.llnl.gov/',
  outDir: './dist',
  publicDir: './public',
  server: {
    host: true,  // Ensures it listens on 0.0.0.0 (all network interfaces)
    port: 3000   // Port where the app will run
  },
  vite: {
    resolve: {
      alias: {
       "@": './src',
      },
    }, 
    plugins: [
      Components({
        resolvers: [
          IconsResolver({
            customCollections: ["my-icons"],
          }),
        ],
      }),
      Icons({
        customCollections: {
          "my-icons": FileSystemIconLoader("src/assets/icons", (svg) =>
            svg.replace(/^<svg /, '<svg fill="currentColor" ')
          ),
        },
        autoInstall: true,
      }),
    ],
  },
  integrations: [
    vue(),
    tailwind(),
    prefetch(),
    sitemap(),
  ],
});
