import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:        "#0B0F19",
        "navy-h":    "#151c30",
        card:        "#F5F3F8",
        "card-b":    "#EBE8F0",
        muted:       "#667780",
        accent:      "#FF2D1A",
        "accent-h":  "#CC2415",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        btn: "8px",
      },
      animation: {
        orbit:    "orbit 6s linear infinite",
        "fade-up": "fade-up 0.55s ease forwards",
      },
      keyframes: {
        orbit: {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
