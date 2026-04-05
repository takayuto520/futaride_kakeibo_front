import type { Config } from "tailwindcss";
import { COLOR_TOKENS } from "./src/constants/colorTokens";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: COLOR_TOKENS.primary,
        "primary-light": COLOR_TOKENS.primaryHover,
        "primary-active": COLOR_TOKENS.primaryActive,
        "primary-nav-default": COLOR_TOKENS.primaryNavDefault,
        "primary-nav-hover": COLOR_TOKENS.primaryNavHover,
        "primary-nav-active": COLOR_TOKENS.primaryNavActive,
        "primary-nav-active-text": COLOR_TOKENS.primaryNavActiveText,
        "primary-nav-inactive": COLOR_TOKENS.primaryNavInactive,
        background: COLOR_TOKENS.background,
        surface: COLOR_TOKENS.surface,
        secondary: COLOR_TOKENS.secondary,
        "secondary-light": COLOR_TOKENS.secondaryLight,
        "text-primary": COLOR_TOKENS.textPrimary,
        "text-secondary": COLOR_TOKENS.textSecondary,
        border: COLOR_TOKENS.border,
        disabled: COLOR_TOKENS.disabled,
        success: COLOR_TOKENS.success,
        warning: COLOR_TOKENS.warning,
        error: COLOR_TOKENS.error,
        accent: COLOR_TOKENS.accent,
        "accent-light": COLOR_TOKENS.accentLight,
        "balance-positive": COLOR_TOKENS.balancePositive,
        "balance-negative": COLOR_TOKENS.balanceNegative,
        "gray-light": COLOR_TOKENS.grayLight,
        gray: COLOR_TOKENS.gray,
        "gray-dark": COLOR_TOKENS.grayDark,
      },
    },
  },
  plugins: [],
} satisfies Config;
