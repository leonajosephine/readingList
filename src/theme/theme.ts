import type { Tokens } from "./tokens";

export const makeTheme = (t: Tokens) => ({
  colors: {
    background: t.background,
    foreground: t.foreground,

    card: t.card,
    cardForeground: t.cardForeground,

    primary: t.primary,
    primaryForeground: t.primaryForeground,

    readingCard: t.readingCard,
    readingCardForeground: t.readingCardForeground,
    readingCardMutedForeground: t.readingCardMutedForeground,

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

  meta: {
    name: t.name,
    displayName: t.displayName,
    assets: t.assets,
    navigationIcons: t.navigationIcons,
    capabilities: t.capabilities,
    shadowOpacity: t.shadowOpacity,
    shadowRadius: t.shadowRadius,
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
    family: {
      regular: "Inter_400Regular",
      medium: "Inter_500Medium",
      semibold: "Inter_600SemiBold",
      bold: "Inter_700Bold",
    },
    base: 16,
    weight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
});

export type AppTheme = ReturnType<typeof makeTheme>;