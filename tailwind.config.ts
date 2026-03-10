import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        "primary-light": "#dbeafe",
        secondary: "#6b7280",
        "secondary-light": "#f5f5f5",
        accent: "#ef4444",
        "accent-light": "#fecaca",
        "balance-positive": "#84cc16",
        "balance-negative": "#dc2626",
        "gray-light": "#f3f4f6",
        gray: "#6b7280",
        "gray-dark": "#374151",
      },
    },
  },
  plugins: [],
} satisfies Config;
