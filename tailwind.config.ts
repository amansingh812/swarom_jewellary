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
        cream: {
          DEFAULT: "#F6F1EA",
          50: "#FBF8F4",
          100: "#F6F1EA",
          200: "#EDE3D4",
        },
        charcoal: {
          // Softened from near-black to warm dark brown for a gentler
          // read against cream paper.
          DEFAULT: "#2E2A24",
          800: "#3A332A",
          700: "#4A4239",
        },
        silver: {
          DEFAULT: "#C9C7C2",
          light: "#E6E4DF",
          dark: "#9A9893",
        },
        gold: {
          DEFAULT: "#B8956A",
          soft: "#D9C09A",
        },
        moss: "#5A6B3F",      // success
        oxide: "#8B2E2E",     // error
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      letterSpacing: {
        tight: "-0.02em",
        wide: "0.04em",
        wider: "0.08em",
        widest: "0.20em",
      },
      borderRadius: {
        pill: "999px",
        lg: "14px",
        xl: "24px",
      },
      boxShadow: {
        hairline: "0 0 0 1px rgba(46, 42, 36, 0.15)",
        soft: "0 1px 2px rgba(46,42,36,0.04), 0 8px 24px rgba(46,42,36,0.06)",
        card: "0 1px 3px rgba(46,42,36,0.06), 0 12px 40px rgba(46,42,36,0.08)",
        lift: "0 4px 12px rgba(46,42,36,0.08), 0 24px 60px rgba(46,42,36,0.12)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        inout: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      maxWidth: {
        marketing: "1280px",
        catalog: "1080px",
        editorial: "720px",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.3", transform: "scaleX(0.4)" },
          "50%": { opacity: "1", transform: "scaleX(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeup: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slidein: {
          from: { transform: "translateX(20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        slideup: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        fadeup: "fadeup 600ms cubic-bezier(0.22, 0.61, 0.36, 1) both",
        slidein: "slidein 250ms cubic-bezier(0.22, 0.61, 0.36, 1) both",
        slideup: "slideup 280ms cubic-bezier(0.22, 0.61, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
