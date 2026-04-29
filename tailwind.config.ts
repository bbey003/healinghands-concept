import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette: warm cream, lavender/purple, soft tan
        cream: {
          50: "#FBF8F3",
          100: "#F5F0E8",
          200: "#EDE5D6",
          300: "#E0D4BD",
        },
        sage: {
          50: "#F5F2F9",
          100: "#E8E1F4",
          200: "#D0C5E8",
          300: "#B5A7D8",
          400: "#9B8CC8",
          500: "#8273B8",
          600: "#6B5EA5",
          700: "#574D8A",
          800: "#443C6E",
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
        soft: "0 4px 24px -8px rgba(60, 50, 80, 0.08)",
        float: "0 12px 40px -12px rgba(60, 50, 80, 0.18)",
        floathover: "0 20px 50px -12px rgba(60, 50, 80, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
