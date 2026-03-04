import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider } from "styled-components/native";
import { TOKENS, ThemeKey } from "./tokens";
import { makeTheme } from "./theme";

type ThemeCtx = {
  themeKey: ThemeKey;
  setThemeKey: (k: ThemeKey) => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeKey, setThemeKey] = useState<ThemeKey>("light");

  const theme = useMemo(() => makeTheme(TOKENS[themeKey]), [themeKey]);

  return (
    <Ctx.Provider value={{ themeKey, setThemeKey }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Ctx.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppTheme must be used within AppThemeProvider");
  return ctx;
}