import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#090E12",
        panel: "#10171D",
        panelSubtle: "#0C1217",
        panelBorder: "#1C252D",
        divider: "#151D23",
        lime: "#9DFF00",
        limeDim: "#87DD00",
        ink: "#E9EDF0",
        muted: "#98A2B0",
        danger: "#FF6B6B"
      },
      borderRadius: {
        panel: "0.75rem"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(157, 255, 0, 0.16), 0 0 28px rgba(157, 255, 0, 0.08)"
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)"],
        mono: ["var(--font-courier-prime)"]
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(21,29,35,0.9) 1px, transparent 1px), linear-gradient(to bottom, rgba(21,29,35,0.9) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;

