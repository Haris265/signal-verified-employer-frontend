import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#1A1525",
        brand: {
          DEFAULT: "#7A5CFF",
          50: "#F3F0FF",
          100: "#EBE6FF",
          200: "#D8CFFF",
          300: "#B8A6FF",
          400: "#9780FF",
          500: "#7A5CFF",
          600: "#6346E6",
          700: "#4F35C4",
          800: "#3F2A9E",
          900: "#33247F",
          tint: "#F3F0FF",
          soft: "#EBE6FF",
        },
        signal: {
          DEFAULT: "#86EFAC",
          tint: "#ECFDF3",
          foreground: "#166534",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "#FAF9FC",
          soft: "#F3F0FF",
        },
        "primary-dark": "rgb(var(--primary-dark) / <alpha-value>)",
        secondary: {
          DEFAULT: "#F3F0F7",
          foreground: "#1A1525",
        },
        muted: {
          DEFAULT: "#F3F0F7",
          foreground: "#6B6578",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1525",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          50: "#FAF9FC",
          100: "#F3F0F7",
          200: "#E8E4EF",
          500: "#6B6578",
          700: "#3D3750",
          900: "#1A1525",
        },
        mist: "rgb(var(--mist) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--border) / <alpha-value>)",
        destructive: "rgb(var(--destructive) / <alpha-value>)",
      },
      borderRadius: {
        DEFAULT: "0.625rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      fontFamily: {
        sans: [
          "var(--font-dm-sans)",
          "DM Sans",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-dm-sans)",
          "DM Sans",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(26, 21, 37, 0.04), 0 6px 20px rgba(26, 21, 37, 0.05)",
        cardHover:
          "0 1px 2px rgba(16, 17, 26, 0.04), 0 12px 32px -16px rgba(16, 17, 26, 0.18)",
        elevated: "0 4px 24px rgba(24, 24, 27, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
