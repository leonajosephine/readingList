import React from "react";
import { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}