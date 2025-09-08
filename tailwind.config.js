/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./components/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/radix-vue/dist/**/*.mjs"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
