import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import Icons from "unplugin-icons/vite";
import tailwind from "@astrojs/tailwind";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
// loader helpers
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import prefetch from "@astrojs/prefetch";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  server: {
    proxy: {
      './src/upload': 'http://localhost:3000',
    },
  },
  site: 'https://nif-dashboard-riley45-c15310d27d07474987c11102447766eb05df9900c.sd-pages.llnl.gov/',
  outDir: 'public',
  publicDir: 'static',
  vite: {
    resolve: {
      alias: {
        "@": "./src",
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
          // key as the collection name
          // a helper to load icons from the file system
          // files under `./assets/icons` with `.svg` extension will be loaded as it's file name
          // you can also provide a transform callback to change each icon (optional)
          "my-icons": FileSystemIconLoader("src/assets/icons", (svg) =>
            svg.replace(/^<svg /, '<svg fill="currentColor" ')
          ),
        },
        autoInstall: true,
      }),
    ],
  },
  // Enable Vue to support Vue components.
  integrations: [
    vue({
    //   appEntrypoint: "/src/pages/_app",
    }),
    tailwind(),
    prefetch(),
    sitemap({
      // filter: (page) =>
        // page !== "https://www.yoursite.com/checkout/" &&
        // page !== "https://www.yoursite.com/checkout-cart/" &&
    }),
  ],
  
});
