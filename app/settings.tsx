import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { useRouter } from "expo-router";

type Mode = "light" | "dark";
type ThemeKey = "minimal" | "instagram" | "mystery" | "scifi";

type ThemeOption = {
  key: ThemeKey;
  title: string;
  subtitle: string;
};

export default function SettingsScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("light");
  const [theme, setTheme] = useState<ThemeKey>("minimal");

  const themes = useMemo<ThemeOption[]>(
    () => [
      { key: "minimal", title: "Minimal", subtitle: "Clean + soft" },
      { key: "instagram", title: "Instagram Moments", subtitle: "Warm & bold" },
      { key: "mystery", title: "Mystery", subtitle: "Moody & dark" },
      { key: "scifi", title: "Sci-Fi", subtitle: "Techy neon" },
    ],
    []
  );

  return (
    <Screen>
      <TopBar>
        <Back onPress={() => router.back()}>
          <BackText>‹ Back</BackText>
        </Back>

        <TopTitle>Settings</TopTitle>

        <Spacer />
      </TopBar>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Section>
          <SectionTitle>Profile Settings</SectionTitle>
          <Card>
            <Row>
              <RowTitle>Name</RowTitle>
              <RowValue>Leona</RowValue>
            </Row>
            <Divider />
            <Row>
              <RowTitle>Language</RowTitle>
              <RowValue>English</RowValue>
            </Row>
          </Card>
        </Section>

        <Section>
          <SectionTitle>Create Appearance</SectionTitle>

          <ModeRow>
            <ModeCard active={mode === "light"} onPress={() => setMode("light")}>
              <ModeTitle active={mode === "light"}>Light Mode</ModeTitle>
              <ModeSub>Bright + clean</ModeSub>
            </ModeCard>

            <ModeCard active={mode === "dark"} onPress={() => setMode("dark")}>
              <ModeTitle active={mode === "dark"}>Dark Mode</ModeTitle>
              <ModeSub>Low light</ModeSub>
            </ModeCard>
          </ModeRow>

          <Grid>
            {themes.map((t) => {
              const active = t.key === theme;
              return (
                <ThemeTile
                  key={t.key}
                  active={active}
                  onPress={() => setTheme(t.key)}
                >
                  <TileTop>
                    <TileTitle active={active}>{t.title}</TileTitle>
                    {active && <ActivePill>Active</ActivePill>}
                  </TileTop>
                  <TileSub>{t.subtitle}</TileSub>
                </ThemeTile>
              );
            })}
          </Grid>

          <Hint>
            Later we’ll wire this to the global ThemeStore so the whole app updates instantly.
          </Hint>
        </Section>
      </ScrollView>
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.bg};
`;

const TopBar = styled.View`
  padding: 18px 18px 8px 18px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Back = styled.Pressable`
  padding: 8px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const BackText = styled.Text`
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

const TopTitle = styled.Text`
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

const Spacer = styled.View`
  width: 64px;
`;

const Section = styled.View`
  padding: 14px 18px 0 18px;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 10px;
`;

const Card = styled.View`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const Row = styled.View`
  padding: 14px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RowTitle = styled.Text`
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

const RowValue = styled.Text`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.muted};
`;

const Divider = styled.View`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

/* Mode switch cards */
const ModeRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 12px;
`;

const ModeCard = styled.Pressable<{ active: boolean }>`
  flex: 1;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background: ${({ theme }) => theme.colors.card};
  border-width: 2px;
  border-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.border};
`;

const ModeTitle = styled.Text<{ active: boolean }>`
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

const ModeSub = styled.Text`
  margin-top: 6px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
`;

/* Themes grid */
const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const ThemeTile = styled.Pressable<{ active: boolean }>`
  width: 48%;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background: ${({ theme }) => theme.colors.card};
  border-width: 2px;
  border-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.border};
`;

const TileTop = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const TileTitle = styled.Text<{ active: boolean }>`
  flex: 1;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

const TileSub = styled.Text`
  margin-top: 8px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
`;

const ActivePill = styled.Text`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 900;
  font-size: 11px;
  padding: 6px 8px;
  border-radius: 999px;
  overflow: hidden;
`;

const Hint = styled.Text`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 600;
  line-height: 20px;
`;