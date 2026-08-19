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
        canvas: "#090E17",
        panel: "#111A28",
        panelSubtle: "#0E1624",
        panelBorder: "#1E293B",
        divider: "#1C273A",
        lime: "#22C55E",
        limeDim: "#16A34A",
        ink: "#FFFFFF",
        muted: "#94A3B8",
        danger: "#EF4444"
      },
      borderRadius: {
        panel: "0.75rem"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34, 197, 94, 0.2), 0 0 28px rgba(34, 197, 94, 0.1)"
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-courier-prime)", "JetBrains Mono", "monospace"]
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(30,41,59,0.9) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,41,59,0.9) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
