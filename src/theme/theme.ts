export const theme = {
    colors: {
      bg: "#FFFFFF",        // warm off-white FAF7F2
      card: "#FFFFFF",
      text: "#1D1B16",
      muted: "#7C756C",
      border: "rgba(29,27,22,0.10)",
      shadow: "rgba(29,27,22,0.12)",
      primary: "#0B0B16",   // dunkler Button (Create List, Add Friend)
      chipBg: "#EEE7DC",
      chipActiveBg: "#FFFFFF",
    },
    radius: {
      lg: 22,
      md: 16,
      sm: 12,
    },
    space: {
      xs: 6,
      sm: 10,
      md: 16,
      lg: 24,
    },
  };
  export type AppTheme = typeof theme;

  export const lightTheme = {
    colors: {
      background: "#FFFFFF",
      foreground: "#1A1A1A",
  
      card: "#FFFFFF",
      cardForeground: "#1A1A1A",
  
      primary: "#030213",
      primaryForeground: "#FFFFFF",
  
      secondary: "#F1F1F4",
      secondaryForeground: "#030213",
  
      muted: "#ECECF0",
      mutedForeground: "#717182",
  
      border: "rgba(0,0,0,0.1)",
  
      inputBackground: "#F3F3F5",
  
      accent: "#E9EBEF",
      accentForeground: "#030213",
    },
  
    radius: {
      sm: 6,
      md: 8,
      lg: 10,
    },
  
    spacing: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 24,
    }
  };