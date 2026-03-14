import { Stack } from "expo-router";
import { AppThemeProvider } from "../src/theme/ThemeContext";
import { LibraryProvider } from "../src/store/LibraryContext";
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
    <LibraryProvider>
      <AppThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AppThemeProvider>
    </LibraryProvider>
  );
}