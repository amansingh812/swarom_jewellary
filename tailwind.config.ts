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
        // Legacy token names, remapped to the Lumière Atelier palette so
        // existing classes pick up the new design automatically.
        cream: {
          DEFAULT: "#FFF8F2", // surface / soft ivory
          50: "#FFFFFF",      // surface-container-lowest
          100: "#FAF2EB",     // surface-container-low
          200: "#F4EDE5",     // surface-container
        },
        charcoal: {
          DEFAULT: "#1E1B17", // on-surface
          800: "#33302B",     // inverse-surface
          700: "#4D463A",     // on-surface-variant
        },
        silver: {
          DEFAULT: "#D0C5B5", // outline-variant
          light: "#E8E1DA",   // surface-variant
          dark: "#7E7668",    // outline
        },
        gold: {
          DEFAULT: "#725B26", // primary (deep 18k gold, text-safe)
          soft: "#C6A96C",    // primary-container (18k gold accent)
        },
        moss: "#5A6B3F",      // success
        oxide: "#BA1A1A",     // error

        // Lumière Atelier design-system tokens (new code uses these).
        surface: {
          DEFAULT: "#FFF8F2",
          dim: "#E0D9D1",
          container: "#F4EDE5",
          "container-low": "#FAF2EB",
          "container-high": "#EEE7DF",
          "container-highest": "#E8E1DA",
        },
        "on-surface": "#1E1B17",
        "on-surface-variant": "#4D463A",
        "inverse-surface": "#33302B",
        "inverse-on-surface": "#F7F0E8",
        outline: "#7E7668",
        "outline-variant": "#D0C5B5",
        primary: {
          DEFAULT: "#725B26",
          container: "#C6A96C",
          fixed: "#FFDF9D",
          "fixed-dim": "#E1C383",
        },
        "on-primary": "#FFFFFF",
        "on-primary-container": "#523D0A",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Georgia", "serif"],
        script: ["var(--font-script)", "cursive"],
      },
      fontSize: {
        "display-lg": ["64px", { lineHeight: "1.1", letterSpacing: "0.05em", fontWeight: "400" }],
        "display-lg-mobile": ["40px", { lineHeight: "1.2", letterSpacing: "0.03em", fontWeight: "400" }],
        "headline-md": ["32px", { lineHeight: "1.3", letterSpacing: "0.02em", fontWeight: "400" }],
        "headline-sm": ["24px", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.2em", fontWeight: "600" }],
      },
      letterSpacing: {
        tight: "-0.01em",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.2em",
      },
      // Sharp shape language — precision of gemstone cutting.
      borderRadius: {
        pill: "0px",
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
      },
      boxShadow: {
        hairline: "0 0 0 1px rgba(30, 27, 23, 0.15)",
        soft: "0 1px 2px rgba(26,26,26,0.03), 0 8px 24px rgba(26,26,26,0.05)",
        card: "0 1px 3px rgba(26,26,26,0.04), 0 12px 40px rgba(26,26,26,0.05)",
        lift: "0 4px 12px rgba(26,26,26,0.05), 0 24px 60px rgba(26,26,26,0.08)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        inout: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      maxWidth: {
        marketing: "1440px",
        catalog: "1200px",
        editorial: "720px",
      },
      spacing: {
        gutter: "32px",
        "section-gap": "120px",
        "margin-desktop": "80px",
        "margin-mobile": "24px",
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
