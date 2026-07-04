/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: "#00ff41",
          cyan: "#00d4ff",
          purple: "#bf00ff",
        },
        surface: {
          DEFAULT: "#0d1117",
          light: "#161b22",
          dark: "#0a0a0a",
          darker: "#010409",
        },
      },
      fontFamily: {
        mono: ["'Fira Code'", "'JetBrains Mono'", "'Courier New'", "monospace"],
      },
    },
  },
  plugins: [],
}
