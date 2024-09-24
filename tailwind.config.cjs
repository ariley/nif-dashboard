/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode using the 'class' strategy
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
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '1350px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1600px',
        // => @media (min-width: 1024px) { ... }
      },
    },
  },
  plugins: [],
};

