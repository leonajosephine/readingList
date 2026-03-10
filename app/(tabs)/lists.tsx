import React, { useMemo, useState } from "react";
import { Alert, ScrollView } from "react-native";
import styled from "styled-components/native";
import { AppHeader } from "../../src/components/AppHeader";
import { SegmentedControl } from "../../src/components/SegmentedControl";
import { softShadow } from "../../src/ui/shadows";

type ViewMode = "grid" | "list";
type ReadingList = { id: string; title: string; subtitle?: string };

export default function ListsScreen() {
  const [mode, setMode] = useState<ViewMode>("grid");

  const lists = useMemo<ReadingList[]>(
    () => [
      { id: "1", title: "Fantasy Favorites", subtitle: "12 books" },
      { id: "2", title: "Mystery & Thriller", subtitle: "8 books" },
      { id: "3", title: "2024 Reading List", subtitle: "14 books" },
      { id: "4", title: "Romance", subtitle: "5 books" },
    ],
    []
  );

  const onMenu = (list: ReadingList) => {
    Alert.alert(list.title, "What do you want to do?", [
      { text: "Share", onPress: () => Alert.alert("Share", "Coming soon") },
      { text: "Delete", style: "destructive", onPress: () => Alert.alert("Delete", "Coming soon") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <Screen>
      <AppHeader />
      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
        <TopRow>
          <Title>My Reading Lists</Title>
          <CreateButton onPress={() => Alert.alert("Create List", "Coming soon")}>
            <CreateText>+ Create</CreateText>
          </CreateButton>
        </TopRow>

        <SegmentWrap>
          <SegmentedControl
            value={mode}
            onChange={(k) => setMode(k as ViewMode)}
            options={[
              { key: "list", label: "List" },
              { key: "grid", label: "Grid" },
            ]}
          />
        </SegmentWrap>

        {mode === "grid" ? (
          <Grid>
            {lists.map((l) => (
              <GridCard key={l.id} style={softShadow}>
                <CardTop>
                  <CardTitle numberOfLines={2}>{l.title}</CardTitle>
                  <DotsPress onPress={() => onMenu(l)}>
                    <DotsText>⋯</DotsText>
                  </DotsPress>
                </CardTop>
                <CardMeta>{l.subtitle ?? ""}</CardMeta>
              </GridCard>
            ))}
          </Grid>
        ) : (
          <List>
            {lists.map((l) => (
              <Row key={l.id} style={softShadow}>
                <RowText>
                  <RowTitle numberOfLines={1}>{l.title}</RowTitle>
                  {!!l.subtitle && <RowMeta>{l.subtitle}</RowMeta>}
                </RowText>
                <DotsPress onPress={() => onMenu(l)}>
                  <DotsText>⋯</DotsText>
                </DotsPress>
              </Row>
            ))}
          </List>
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
  padding: 18px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.Text`
  flex: 1;
  font-size: 32px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const CreateButton = styled.Pressable`
  background: ${({ theme }) => theme.colors.primary};
  padding: 10px 16px;
  border-radius: 999px;
`;

const CreateText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const SegmentWrap = styled.View`
  padding: 0 18px 14px 18px;
`;

const Grid = styled.View`
  padding: 0 18px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const GridCard = styled.View`
  width: 48%;
  min-height: 150px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 14px;
  justify-content: space-between;
`;

const CardTop = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const CardTitle = styled.Text`
  flex: 1;
  font-size: 16px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const CardMeta = styled.Text`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const List = styled.View`
  padding: 0 18px;
  gap: 12px;
`;

const Row = styled.View`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RowText = styled.View`
  flex: 1;
  gap: 4px;
`;

const RowTitle = styled.Text`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const RowMeta = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const DotsPress = styled.Pressable`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
`;

const DotsText = styled.Text`
  font-size: 22px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;