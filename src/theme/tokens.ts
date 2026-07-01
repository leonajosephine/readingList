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

  readingCard: string;
  readingCardForeground: string;
  readingCardMutedForeground: string;

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

  radius: number;
};

export const TOKENS: Record<ThemeKey, Tokens> = {
  light: {
    background: "#FFFFFF",
    foreground: "#1C1B20",

    card: "#FFFFFF",
    cardForeground: "#1C1B20",

    primary: "#2E2945",
    primaryForeground: "#FFFFFF",

    readingCard: "#2E2945",
    readingCardForeground: "#FFFFFF",
    readingCardMutedForeground: "#C9C4D5",

    secondary: "#F3F2F6",
    secondaryForeground: "#1C1B20",

    muted: "#EEEFF3",
    mutedForeground: "#70707D",

    accent: "#ECEAF3",
    accentForeground: "#1C1B20",

    border: "rgba(28,27,32,0.09)",

    inputBackground: "#F6F6F8",

    destructive: "#D4183D",
    destructiveForeground: "#FFFFFF",

    radius: 10,
  },

  dark: {
    background: "#111113",
    foreground: "#F4F4F5",

    card: "#1A1A1D",
    cardForeground: "#F4F4F5",

    primary: "#F4F4F5",
    primaryForeground: "#111113",

    readingCard: "#171525",
    readingCardForeground: "#FFFFFF",
    readingCardMutedForeground: "#A7A7B5",

    secondary: "#242428",
    secondaryForeground: "#F4F4F5",

    muted: "#26262B",
    mutedForeground: "#A5A5AE",

    accent: "#303038",
    accentForeground: "#F4F4F5",

    border: "rgba(255,255,255,0.11)",

    inputBackground: "#202024",

    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",

    radius: 10,
  },

  fantasy: {
    background: "#FBF8F2",
    foreground: "#2D2118",

    card: "#FFFFFF",
    cardForeground: "#2D2118",

    primary: "#79552E",
    primaryForeground: "#FFF8EC",

    readingCard: "#413058",
    readingCardForeground: "#FFFFFF",
    readingCardMutedForeground: "#D6C6E8",

    secondary: "#EFE3D0",
    secondaryForeground: "#2D2118",

    muted: "#F2EADB",
    mutedForeground: "#7F674D",

    accent: "#D8B25C",
    accentForeground: "#2D2118",

    border: "rgba(45,33,24,0.09)",

    inputBackground: "#F6EEE1",

    destructive: "#9B2F2F",
    destructiveForeground: "#FFFFFF",

    radius: 11,
  },

  romance: {
    background: "#FFF8FA",
    foreground: "#49233F",

    card: "#FFFFFF",
    cardForeground: "#49233F",

    primary: "#C85A9B",
    primaryForeground: "#FFFFFF",

    readingCard: "#766082",
    readingCardForeground: "#FFFFFF",
    readingCardMutedForeground: "#E3D2E5",

    secondary: "#FDEEF5",
    secondaryForeground: "#49233F",

    muted: "#FAE8F1",
    mutedForeground: "#93547F",

    accent: "#EFA2C4",
    accentForeground: "#49233F",

    border: "rgba(73,35,63,0.09)",

    inputBackground: "#FFF1F7",

    destructive: "#BE185D",
    destructiveForeground: "#FFFFFF",

    radius: 14,
  },

  mystery: {
    background: "#11111D",
    foreground: "#ECEAF6",

    card: "#19192A",
    cardForeground: "#ECEAF6",

    primary: "#8B5CF6",
    primaryForeground: "#FFFFFF",

    readingCard: "#221F38",
    readingCardForeground: "#FFFFFF",
    readingCardMutedForeground: "#A9A5C2",

    secondary: "#282842",
    secondaryForeground: "#ECEAF6",

    muted: "#24243A",
    mutedForeground: "#A09CB8",

    accent: "#A78BFA",
    accentForeground: "#11111D",

    border: "rgba(236,234,246,0.11)",

    inputBackground: "#161627",

    destructive: "#DC2626",
    destructiveForeground: "#FFFFFF",

    radius: 10,
  },

  scifi: {
    background: "#09111F",
    foreground: "#E0F2FE",

    card: "#101B2D",
    cardForeground: "#E0F2FE",

    primary: "#2AB7D7",
    primaryForeground: "#06101C",

    readingCard: "#162B44",
    readingCardForeground: "#E0F2FE",
    readingCardMutedForeground: "#A7C7D6",

    secondary: "#1A2A3E",
    secondaryForeground: "#E0F2FE",

    muted: "#172235",
    mutedForeground: "#91AFC1",

    accent: "#5EE3FF",
    accentForeground: "#06101C",

    border: "rgba(94,227,255,0.16)",

    inputBackground: "#0D1728",

    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",

    radius: 9,
  },

  glass: {
    background: "#F5F8FD",
    foreground: "#24324A",

    card: "#FFFFFF",
    cardForeground: "#24324A",

    primary: "#7C8CFF",
    primaryForeground: "#FFFFFF",

    readingCard: "#EAF2FF",
    readingCardForeground: "#24324A",
    readingCardMutedForeground: "#71839C",

    secondary: "#EFF4FB",
    secondaryForeground: "#24324A",

    muted: "#EDF3FA",
    mutedForeground: "#6C7A90",

    accent: "#DCEAFF",
    accentForeground: "#24324A",

    border: "rgba(36,50,74,0.08)",

    inputBackground: "#FAFCFF",

    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",

    radius: 16,
  },

  matcha: {
    background: "#FEFFFD", // noch etwas heller
  
    foreground: "#203126",
  
    card: "#F7FBF5", // ganz sanftes Matcha
    cardForeground: "#203126",
  
    primary: "#4B6E53",
    primaryForeground: "#FFFFFF",
  
    // ← kräftigeres Matcha
    readingCard: "#AFC9B3",
  
    // dadurch wird die Karte jetzt hell statt dunkel
    readingCardForeground: "#183123",
  
    // Untertitel/Page etwas heller
    readingCardMutedForeground: "#4F6A59",
  
    secondary: "#EEF6EB",
    secondaryForeground: "#203126",
  
    muted: "#E8F1E5",
    mutedForeground: "#6A7C6D",
  
    accent: "#CFE4C8",
    accentForeground: "#203126",
  
    border: "rgba(32,49,38,0.08)",
  
    inputBackground: "#FAFCF8",
  
    destructive: "#B42318",
    destructiveForeground: "#FFFFFF",
  
    radius: 13,
  },
};