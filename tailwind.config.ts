import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF9FC",
        foreground: "#1A1525",
        brand: {
          DEFAULT: "#C026F5",
          50: "#FBF5FF",
          100: "#F5E8FF",
          200: "#EDD1FE",
          300: "#DFA9FC",
          400: "#D074F8",
          500: "#C026F5",
          600: "#A91BE0",
          700: "#8B16B8",
          800: "#721695",
          900: "#5E1778",
          tint: "#F7F3FB",
          soft: "#E8D9F5",
        },
        signal: {
          DEFAULT: "#86EFAC",
          tint: "#ECFDF3",
          foreground: "#166534",
        },
        primary: {
          DEFAULT: "#7C3AED",
          foreground: "#FAF9FC",
          soft: "#F3F0F7",
        },
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
        border: "#E8E4EF",
        input: "#E8E4EF",
        ink: {
          50: "#FAF9FC",
          100: "#F3F0F7",
          200: "#E8E4EF",
          500: "#6B6578",
          700: "#3D3750",
          900: "#1A1525",
        },
      },
      borderRadius: {
        DEFAULT: "0.625rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-sans)"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(26, 21, 37, 0.04), 0 6px 20px rgba(26, 21, 37, 0.05)",
        cardHover:
          "0 1px 2px rgba(16, 17, 26, 0.04), 0 12px 32px -16px rgba(16, 17, 26, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
