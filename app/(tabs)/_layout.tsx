import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";
import { Image } from "react-native";

export default function TabsLayout() {
  const theme = useTheme();

  const renderIcon = (
    icon: typeof theme.meta.navigationIcons.home,
    color: string,
    size: number
  ) => {
    if (icon.type === "ionicon") {
      return (
        <Ionicons
          name={icon.name}
          size={size}
          color={color}
        />
      );
    }
  
    return (
      <Image
        source={icon.source}
        resizeMode="contain"
        style={{
          width: size,
          height: size,
        }}
      />
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        sceneStyle: {
          backgroundColor: theme.colors.background,
        },

        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedForeground,

        tabBarStyle: {
          height: 80,
          paddingTop: 10,
          paddingBottom: 14,
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          elevation: 6,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.font.family.semibold,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) =>
            renderIcon(theme.meta.navigationIcons.home, color, size)
        }}
      />

      <Tabs.Screen
        name="lists"
        options={{
          title: "Lists",
          tabBarIcon: ({ color, size }) =>
            renderIcon(theme.meta.navigationIcons.lists, color, size)
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) =>
            renderIcon(theme.meta.navigationIcons.search, color, size)
        }}
      />

      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, size }) =>
            renderIcon(theme.meta.navigationIcons.friends, color, size)
        }}
      />
    </Tabs>
  );
}