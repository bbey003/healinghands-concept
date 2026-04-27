import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette: warm white, sage green, soft tan
        cream: {
          50: "#FBF8F3",
          100: "#F5F0E8",
          200: "#EDE5D6",
          300: "#E0D4BD",
        },
        sage: {
          50: "#F1F4F0",
          100: "#DDE5DA",
          200: "#B8C7B2",
          300: "#94A98C",
          400: "#7D9B76",
          500: "#5F7E58",
          600: "#4A6444",
          700: "#3A4F35",
          800: "#2D3D29",
        },
        tan: {
          100: "#EFE3CE",
          200: "#DCC9A8",
          300: "#C4A882",
          400: "#A8895F",
          500: "#8A6E48",
          600: "#6B5436",
        },
        ink: {
          DEFAULT: "#2A2520",
          light: "#5C544B",
          subtle: "#857B70",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-up": "fadeUp 0.8s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(60, 50, 35, 0.08)",
        float: "0 12px 40px -12px rgba(60, 50, 35, 0.18)",
        floathover: "0 20px 50px -12px rgba(60, 50, 35, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
