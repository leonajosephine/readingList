import React, { useMemo, useState } from "react";
import { Alert, ScrollView, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

import { AppHeader } from "../../src/components/AppHeader";

type ViewMode = "grid" | "list";

type ReadingList = {
  id: string;
  title: string;
  subtitle?: string;
  covers: string[];
};

export default function ListsScreen() {
  const [mode, setMode] = useState<ViewMode>("list");
  const { width } = useWindowDimensions();

  const isMobile = width < 520;

  const lists = useMemo<ReadingList[]>(
    () => [
      {
        id: "1",
        title: "Summer Reads 2026",
        subtitle: "2 books",
        covers: [
          "https://picsum.photos/200/300?random=11",
          "https://picsum.photos/200/300?random=12",
        ],
      },
      {
        id: "2",
        title: "Book Club Picks",
        subtitle: "3 books",
        covers: [
          "https://picsum.photos/200/300?random=13",
          "https://picsum.photos/200/300?random=14",
          "https://picsum.photos/200/300?random=15",
        ],
      },
      {
        id: "3",
        title: "Fantasy Favorites",
        subtitle: "4 books",
        covers: [
          "https://picsum.photos/200/300?random=16",
          "https://picsum.photos/200/300?random=17",
          "https://picsum.photos/200/300?random=18",
        ],
      },
    ],
    []
  );

  const onMenu = (list: ReadingList) => {
    Alert.alert(list.title, "What do you want to do?", [
      { text: "Share", onPress: () => Alert.alert("Share", "Coming soon") },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => Alert.alert("Delete", "Coming soon"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <Screen>
      <AppHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <TopRow>
          <TitleBlock>
            <Title>My Reading Lists</Title>
            <Subtitle>Organize your books into custom collections</Subtitle>
          </TitleBlock>
        </TopRow>

        <ActionsRow>
          <ViewToggle>
            <ToggleButton
              active={mode === "list"}
              onPress={() => setMode("list")}
            >
              <Ionicons
                name="list-outline"
                size={18}
                color={mode === "list" ? "#fff" : "#6b7280"}
              />
            </ToggleButton>

            <ToggleButton
              active={mode === "grid"}
              onPress={() => setMode("grid")}
            >
              <Ionicons
                name="grid-outline"
                size={18}
                color={mode === "grid" ? "#fff" : "#6b7280"}
              />
            </ToggleButton>
          </ViewToggle>

          <CreateButton onPress={() => Alert.alert("Create List", "Coming soon")}>
            <CreateButtonText>{isMobile ? "+" : "+ Create List"}</CreateButtonText>
          </CreateButton>
        </ActionsRow>

        {mode === "list" ? (
          <ListWrap>
            {lists.map((list) => (
              <ListCard key={list.id}>
                <ListCardTop>
                  <ListTextWrap>
                    <ListTitle numberOfLines={1}>{list.title}</ListTitle>
                    {!!list.subtitle && <ListMeta>{list.subtitle}</ListMeta>}
                  </ListTextWrap>

                  <MenuButton onPress={() => onMenu(list)}>
                    <Ionicons name="ellipsis-horizontal" size={18} color="#6b7280" />
                  </MenuButton>
                </ListCardTop>

                <CoverRow>
                  {list.covers.map((cover, index) => (
                    <MiniCover key={`${list.id}-${index}`} source={{ uri: cover }} />
                  ))}
                </CoverRow>
              </ListCard>
            ))}
          </ListWrap>
        ) : (
          <GridWrap>
            {lists.map((list) => (
              <GridCard key={list.id}>
                <GridTop>
                  <GridTitle numberOfLines={2}>{list.title}</GridTitle>
                  <MenuButton onPress={() => onMenu(list)}>
                    <Ionicons name="ellipsis-horizontal" size={18} color="#6b7280" />
                  </MenuButton>
                </GridTop>

                <GridMeta>{list.subtitle}</GridMeta>

                {/* Später kannst du hier ein Cover als Hintergrund setzen */}
                <GridPreview />
              </GridCard>
            ))}
          </GridWrap>
        )}
      </ScrollView>
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
`;

const TopRow = styled.View`
  padding: 18px 18px 8px 18px;
`;

const TitleBlock = styled.View`
  gap: 6px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-family: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
  letter-spacing: -0.4px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.font.family.medium};
  color: ${({ theme }) => theme.colors.mutedForeground};
`;

const ActionsRow = styled.View`
  padding: 0 18px 16px 18px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ViewToggle = styled.View`
  flex-direction: row;
  align-items: center;
  background: ${({ theme }) => theme.colors.muted};
  border-radius: 999px;
  padding: 4px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const ToggleButton = styled.Pressable<{ active: boolean }>`
  width: 38px;
  height: 38px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : "transparent"};
`;

const CreateButton = styled.Pressable`
  min-width: 44px;
  height: 44px;
  padding: 0 14px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
`;

const CreateButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-family: ${({ theme }) => theme.font.family.semibold};
  font-size: 15px;
`;

const ListWrap = styled.View`
  padding: 0 18px;
  gap: 14px;
`;

const ListCard = styled.View`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 16px;

  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 10px;
  shadow-offset: 0px 6px;
  elevation: 3;
`;

const ListCardTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const ListTextWrap = styled.View`
  flex: 1;
`;

const ListTitle = styled.Text`
  font-size: 20px;
  font-family: ${({ theme }) => theme.font.family.semibold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const ListMeta = styled.Text`
  margin-top: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-family: ${({ theme }) => theme.font.family.medium};
`;

const MenuButton = styled.Pressable`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
`;

const CoverRow = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 16px;
`;

const MiniCover = styled.Image`
  width: 74px;
  height: 110px;
  border-radius: 10px;
`;

const GridWrap = styled.View`
  padding: 0 18px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const GridCard = styled.View`
  width: 48%;
  min-height: 180px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 14px;

  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 10px;
  shadow-offset: 0px 6px;
  elevation: 3;
`;

const GridTop = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const GridTitle = styled.Text`
  flex: 1;
  font-size: 16px;
  font-family: ${({ theme }) => theme.font.family.semibold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const GridMeta = styled.Text`
  margin-top: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-family: ${({ theme }) => theme.font.family.medium};
`;

const GridPreview = styled.View`
  margin-top: 14px;
  flex: 1;
  min-height: 90px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.muted};
`;