/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#BA307A"
        },
        alert: {
          DEFAULT: "#FFE6F2",
        },
      },
      screens: {
        tablet: "834px", // ipad Pro 11
        // => @media (min-width: 834px) { ... }

        laptop: "1280px", // MacBook Pro
        // => @media (min-width: 1280px) { ... }

        desktop: "1920px",
        // => @media (min-width: 1920px) { ... }

        widescreen: "2880px",
        // => @media (min-width: 2880) { ... }
      },
    },
  },
  plugins: [],
};

