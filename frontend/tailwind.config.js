/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#050505", // Deep black
        foreground: "#fafafa",
        primary: {
          DEFAULT: "#00f0ff", // Neon Cyan
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#7000ff", // Neon Purple
          foreground: "#fafafa",
        },
        destructive: {
          DEFAULT: "#ff003c", // Neon Red
          foreground: "#fafafa",
        },
        muted: {
          DEFAULT: "#1a1a1a",
          foreground: "#a1a1aa",
        },
        accent: {
          DEFAULT: "#27272a",
          foreground: "#fafafa",
        },
        card: {
          DEFAULT: "#0a0a0a",
          foreground: "#fafafa",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
         sans: ['Inter', 'ui-sans-serif', 'system-ui'],
         mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular'],
      }
    },
  },
  plugins: [],
}
