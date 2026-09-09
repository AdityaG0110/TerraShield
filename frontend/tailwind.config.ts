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
        background: "#F4F6F8",
        surface: "#FFFFFF",
        "surface-border": "#EAECF0",
        "primary-green": {
          DEFAULT: "#164E3A",
          hover: "#123F2F",
          light: "#E8F5E9",
        },
        risk: {
          critical: "#EF4444",
          high: "#F97316",
          moderate: "#FBBF24",
          low: "#22C55E",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
