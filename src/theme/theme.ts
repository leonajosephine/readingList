import type { Tokens } from "./tokens";

export const makeTheme = (t: Tokens) => ({
  colors: {
    background: t.background,
    foreground: t.foreground,

    card: t.card,
    cardForeground: t.cardForeground,

    primary: t.primary,
    primaryForeground: t.primaryForeground,

    secondary: t.secondary,
    secondaryForeground: t.secondaryForeground,

    muted: t.muted,
    mutedForeground: t.mutedForeground,

    accent: t.accent,
    accentForeground: t.accentForeground,

    border: t.border,

    inputBackground: t.inputBackground,

    destructive: t.destructive,
    destructiveForeground: t.destructiveForeground,
  },
  radius: {
    sm: Math.max(4, t.radius - 4),
    md: Math.max(6, t.radius - 2),
    lg: t.radius,
    xl: t.radius + 6,
  },
  space: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  font: {
    base: 16,
    weight: {
      normal: "400" as const,
      medium: "500" as const,
      bold: "700" as const,
      black: "900" as const,
    },
  },
});

export type AppTheme = ReturnType<typeof makeTheme>;