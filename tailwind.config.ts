import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          dark: "#131921",
          subnav: "#232f3e",
          bg: "#eaeded",
          yellow: "#ffd814",
          "yellow-hover": "#f7ca00",
          orange: "#ffa41c",
          "orange-hover": "#fa8900",
          search: "#febd69",
          "search-hover": "#f3a847",
          blue: "#007185",
          "blue-hover": "#c7511f",
          deal: "#cc0c39",
          star: "#de7921",
          green: "#007600",
          border: "#d5d9d9",
          text: "#0f1111",
          muted: "#565959",
        },
      },
      fontFamily: {
        sans: [
          "Amazon Ember",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
