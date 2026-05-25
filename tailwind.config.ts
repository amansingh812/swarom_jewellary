import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Swarom brand palette
        cream: {
          DEFAULT: "#F6F1EA",
          50: "#FBF8F4",
          100: "#F6F1EA",
          200: "#EDE3D4",
        },
        charcoal: {
          DEFAULT: "#1F1B16",
          800: "#2A241D",
          700: "#3A332A",
        },
        silver: {
          DEFAULT: "#C9C7C2",
          light: "#E6E4DF",
          dark: "#9A9893",
        },
        gold: {
          DEFAULT: "#B8956A",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wider: "0.08em",
        widest: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
