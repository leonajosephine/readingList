export type ThemeKey =
  | "light"
  | "dark"
  | "fantasy"
  | "romance"
  | "mystery"
  | "scifi"
  | "glass"
  | "matcha";

export type Tokens = {
  background: string;
  foreground: string;

  card: string;
  cardForeground: string;

  primary: string;
  primaryForeground: string;

  secondary: string;
  secondaryForeground: string;

  muted: string;
  mutedForeground: string;

  accent: string;
  accentForeground: string;

  border: string;

  inputBackground: string;

  destructive: string;
  destructiveForeground: string;

  radius: number; // base radius (px)
};

export const TOKENS: Record<ThemeKey, Tokens> = {
  light: {
    background: "#ffffff",
    foreground: "#1a1a1a", //#171717" #222129"
    card: "#ffffff",
    cardForeground: "#1a1a1a",

    primary: "#030213",
    primaryForeground: "#ffffff",

    secondary: "#F1F1F4",
    secondaryForeground: "#030213",

    muted: "#ECECF0",
    mutedForeground: "#717182",

    accent: "#E9EBEF",
    accentForeground: "#030213",

    border: "rgba(0,0,0,0.10)",

    inputBackground: "#F3F3F5",

    destructive: "#D4183D",
    destructiveForeground: "#ffffff",

    radius: 10, // ~0.625rem
  },

  dark: {
    background: "#151515",
    foreground: "#F3F3F3",

    card: "#151515",
    cardForeground: "#F3F3F3",

    primary: "#F3F3F3",
    primaryForeground: "#1a1a1a",

    secondary: "#2b2b2b",
    secondaryForeground: "#F3F3F3",

    muted: "#2b2b2b",
    mutedForeground: "#b5b5b5",

    accent: "#2b2b2b",
    accentForeground: "#F3F3F3",

    border: "rgba(255,255,255,0.14)",

    inputBackground: "#232323",

    destructive: "#ef4444",
    destructiveForeground: "#ffffff",

    radius: 10,
  },

  fantasy: {
    background: "#faf8f5",
    foreground: "#2d1810",

    card: "#ffffff",
    cardForeground: "#2d1810",

    primary: "#6b4423",
    primaryForeground: "#faf8f5",

    secondary: "#e8dcc8",
    secondaryForeground: "#2d1810",

    muted: "#f0e8d8",
    mutedForeground: "#8b7355",

    accent: "#d4af37",
    accentForeground: "#2d1810",

    border: "rgba(107,68,35,0.20)",

    inputBackground: "#f5ede0",

    destructive: "#8b2f2f",
    destructiveForeground: "#ffffff",

    radius: 10,
  },

  romance: {
    background: "#fff5f8",
    foreground: "#4a1942",

    card: "#ffffff",
    cardForeground: "#4a1942",

    primary: "#d946a6",
    primaryForeground: "#ffffff",

    secondary: "#fce7f3",
    secondaryForeground: "#4a1942",

    muted: "#fce7f3",
    mutedForeground: "#9d4b8d",

    accent: "#ec4899",
    accentForeground: "#ffffff",

    border: "rgba(217,70,166,0.20)",

    inputBackground: "#fdf2f8",

    destructive: "#be185d",
    destructiveForeground: "#ffffff",

    radius: 10,
  },

  mystery: {
    background: "#0f0f1e",
    foreground: "#e8e8f0",

    card: "#1a1a2e",
    cardForeground: "#e8e8f0",

    primary: "#7c3aed",
    primaryForeground: "#ffffff",

    secondary: "#2d2d44",
    secondaryForeground: "#e8e8f0",

    muted: "#2d2d44",
    mutedForeground: "#9999b3",

    accent: "#8b5cf6",
    accentForeground: "#ffffff",

    border: "rgba(124,58,237,0.30)",

    inputBackground: "#16162a",

    destructive: "#dc2626",
    destructiveForeground: "#ffffff",

    radius: 10,
  },

  scifi: {
    background: "#0a0e1a",
    foreground: "#e0f2fe",

    card: "#0f1729",
    cardForeground: "#e0f2fe",

    primary: "#06b6d4",
    primaryForeground: "#0a0e1a",

    secondary: "#1e293b",
    secondaryForeground: "#e0f2fe",

    muted: "#1e293b",
    mutedForeground: "#94a3b8",

    accent: "#22d3ee",
    accentForeground: "#0a0e1a",

    border: "rgba(6,182,212,0.30)",

    inputBackground: "#0c1220",

    destructive: "#ef4444",
    destructiveForeground: "#ffffff",

    radius: 10,
  },

  glass: {
    background: "#f4f7fb",
    foreground: "#1f2937",

    card: "#ffffff",
    cardForeground: "#1f2937",

    primary: "#7c8cff",
    primaryForeground: "#ffffff",

    secondary: "#e9eef8",
    secondaryForeground: "#1f2937",

    muted: "#eef3fb",
    mutedForeground: "#6b7280",

    accent: "#dbeafe",
    accentForeground: "#1f2937",

    border: "rgba(255,255,255,0.65)",

    inputBackground: "#f8fbff",

    destructive: "#ef4444",
    destructiveForeground: "#ffffff",

    radius: 14,
  },

  matcha: {
    background: "#f6f7f2",
    foreground: "#203126",

    card: "#ffffff",
    cardForeground: "#203126",

    primary: "#3f6b4b",
    primaryForeground: "#ffffff",

    secondary: "#dde8dd",
    secondaryForeground: "#203126",

    muted: "#e8efe6",
    mutedForeground: "#6b7b6d",

    accent: "#b8d5b0",
    accentForeground: "#203126",

    border: "rgba(63,107,75,0.18)",

    inputBackground: "#f3f7f1",

    destructive: "#b42318",
    destructiveForeground: "#ffffff",

    radius: 12,
  },

};

