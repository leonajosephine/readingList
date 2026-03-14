import React, { useMemo, useState } from "react";
import { Image, ScrollView } from "react-native";
import styled from "styled-components/native";
import { useRouter } from "expo-router";

import { useAppTheme } from "../src/theme/ThemeContext";
import type { ThemeKey } from "../src/theme/tokens";

import { Screen, Page } from "../src/ui/Screen";
import { Card, CardBody } from "../src/ui/Card";
import { H1, H2, P, Small } from "../src/ui/Text";
import { Button, ButtonText } from "../src/ui/Button";
import { Input } from "../src/ui/Input";
import { softShadow } from "../src/ui/shadows";

type ThemeOption = {
  key: ThemeKey;
  name: string;
  description: string;
  // kleine Preview-Farbfläche (ähnlich wie die div preview box in deinem Web)
  previewBg: string;
  previewBorder: string;
};

export default function SettingsScreen() {
  const router = useRouter();
  const { themeKey, setThemeKey } = useAppTheme();

  // Dummy user (später aus Store)
  const [name, setName] = useState("Leona");
  const [email, setEmail] = useState("leona@example.com");
  const [bio, setBio] = useState("Building a reading app ✨");

  const themeOptions = useMemo<ThemeOption[]>( // add more: cherry, very girly, classy, 
    () => [
      { key: "light", name: "Light Mode", description: "Clean and bright", previewBg: "#ffffff", previewBorder: "rgba(0,0,0,0.12)" },
      { key: "dark", name: "Dark Mode", description: "Easy on the eyes", previewBg: "#0f0f10", previewBorder: "rgba(255,255,255,0.16)" },
      { key: "fantasy", name: "Fantasy - Dragons & Faes", description: "Magical adventures", previewBg: "#faf8f5", previewBorder: "rgba(107,68,35,0.22)" },
      { key: "romance", name: "Romance", description: "Love stories", previewBg: "#fff5f8", previewBorder: "rgba(217,70,166,0.22)" },
      { key: "mystery", name: "Mystery", description: "Dark and thrilling", previewBg: "#0f0f1e", previewBorder: "rgba(124,58,237,0.35)" },
      { key: "scifi", name: "Sci-Fi", description: "Future worlds", previewBg: "#0a0e1a", previewBorder: "rgba(6,182,212,0.35)" },
      { key: "glass", name: "Glass", description: "Soft frosted elegance", previewBg: "#f4f7fb", previewBorder: "rgba(255,255,255,0.75)" },
      { key: "matcha", name: "Matcha Time", description: "Calm natural reading", previewBg: "#f6f7f2", previewBorder: "rgba(63,107,75,0.20)" },
    ],
    []
  );

  return (
    <Screen>
      <StickyHeader>
        <Page>
          <HeaderRow>
            <BackPress onPress={() => router.back()}>
              <BackText>‹ Back</BackText>
            </BackPress>
            <HeaderCenter />
          </HeaderRow>
        </Page>
      </StickyHeader>
  
      <ScrollView contentContainerStyle={{ paddingBottom: 80, paddingTop: 85 }}>
        <Page>
          <HeaderBlock>
            <H1>Settings</H1>
            <P>Customize your reading experience</P>
          </HeaderBlock>
  
          {/* Profile */}
          <Card style={[{ marginTop: 14 }, softShadow]}>
            <CardBody>
              <H2>Profile</H2>
  
              <ProfileRow>
                <AvatarWrap>
                  <Avatar
                    source={{
                      uri: "https://i.pravatar.cc/300?img=32",
                    }}
                  />
                  <MiniIconButton onPress={() => {}}>
                    <MiniIconText>🎨</MiniIconText>
                  </MiniIconButton>
                </AvatarWrap>
  
                <FormCol>
                  <Field>
                    <Label>Name</Label>
                    <Input value={name} onChangeText={setName} placeholder="Your name" />
                  </Field>
  
                  <Field>
                    <Label>Email</Label>
                    <Input
                      value={email}
                      onChangeText={setEmail}
                      placeholder="you@email.com"
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </Field>
  
                  <Field>
                    <Label>Bio</Label>
                    <BioInput
                      value={bio}
                      onChangeText={setBio}
                      placeholder="Tell us about your reading taste..."
                      multiline
                      textAlignVertical="top"
                    />
                  </Field>
                </FormCol>
              </ProfileRow>
  
              <RightRow>
                <Button onPress={() => {}}>
                  <ButtonText>Save Changes</ButtonText>
                </Button>
              </RightRow>
            </CardBody>
          </Card>
  
          {/* Appearance */}
          <Card style={[{ marginTop: 16 }, softShadow]}>
            <CardBody>
              <H2>Appearance</H2>
              <Small style={{ marginTop: 6 }}>
                Choose a theme that matches your reading mood
              </Small>
  
              <ThemeGrid>
                {themeOptions.map((opt) => {
                  const active = opt.key === themeKey;
  
                  return (
                    <ThemeTile
                      key={opt.key}
                      active={active}
                      onPress={() => setThemeKey(opt.key)}
                    >
                      {active && <CheckPill>✓</CheckPill>}
  
                      <PreviewBox
                        style={{
                          backgroundColor: opt.previewBg,
                          borderColor: opt.previewBorder,
                        }}
                      />
  
                      <TileTitleRow>
                        <TileTitle numberOfLines={1}>{opt.name}</TileTitle>
                      </TileTitleRow>
  
                      <TileDesc numberOfLines={2}>{opt.description}</TileDesc>
                    </ThemeTile>
                  );
                })}
              </ThemeGrid>
            </CardBody>
          </Card>
  
          <FooterSpace />
        </Page>
      </ScrollView>
    </Screen>
  );
}

/* ------- styles ------- */

const StickyHeader = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding-top: 40px;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const BackPress = styled.Pressable`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const BackText = styled.Text`
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const HeaderCenter = styled.View`
  width: 60px;
`;

const HeaderBlock = styled.View`
  margin-top: 12px;
  gap: 6px;
`;

const ProfileRow = styled.View`
  margin-top: 14px;
  gap: 16px;
`;

const AvatarWrap = styled.View`
  align-self: flex-start;
  width: 96px;
  height: 96px;
  border-radius: 48px;
  overflow: hidden;
  border-width: 3px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const Avatar = styled(Image)`
  width: 96px;
  height: 96px;
`;

const MiniIconButton = styled.Pressable`
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  border-width: 3px;
  border-color: ${({ theme }) => theme.colors.card};
`;

const MiniIconText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-size: 14px;
`;

const FormCol = styled.View`
  gap: 12px;
`;

const Field = styled.View`
  gap: 6px;
`;

const Label = styled.Text`
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const BioInput = styled.TextInput`
  min-height: 90px;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 16px;
`;

const RightRow = styled.View`
  margin-top: 14px;
  flex-direction: row;
  justify-content: flex-end;
`;

const ThemeGrid = styled.View`
  margin-top: 14px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const ThemeTile = styled.Pressable<{ active: boolean }>`
  width: 48%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 2px;
  border-color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  position: relative;
`;

const CheckPill = styled.Text`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 999px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const PreviewBox = styled.View`
  width: 100%;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 2px;
  margin-bottom: 10px;
`;

const TileTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const TileTitle = styled.Text`
  flex: 1;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.cardForeground};
`;

const TileDesc = styled.Text`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
  font-size: 13px;
  line-height: 18px;
`;

const FooterSpace = styled.View`
  height: 30px;
`;