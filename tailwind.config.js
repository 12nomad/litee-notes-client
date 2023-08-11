/** @type {import('tailwindcss').Config} */
import * as flowbite from "flowbite/plugin";
import * as defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lobster: ['"Lobster"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [flowbite],
};
