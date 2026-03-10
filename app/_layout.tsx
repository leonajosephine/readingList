import { Stack } from "expo-router";
import { AppThemeProvider } from "../src/theme/ThemeContext";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <AppThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppThemeProvider>
  );
}