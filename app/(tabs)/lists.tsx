import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  TextInput,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { AppHeader } from "../../src/components/AppHeader";
import { useLibrary } from "../../src/store/LibraryContext";
import { LinearGradient } from "expo-linear-gradient";

type ViewMode = "grid" | "list";

export default function ListsScreen() {
  const [mode, setMode] = useState<ViewMode>("list");
  const [createOpen, setCreateOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const { width } = useWindowDimensions();
  const { lists, books, deleteList, createList } = useLibrary();

  const router = useRouter();

  const isMobile = width < 520;

  const contentMaxWidth = 1000;
  const contentWidth = Math.min(width, contentMaxWidth);

  const horizontalPadding = 18 * 2;

  const listGap = 14;
  const gridGap = 12;

  const isTablet = width >= 768;
  const isDesktop = width >= 1100;

  const listColumns = isTablet ? 2 : 1;
  const gridColumns = isDesktop ? 3 : 2;

  const listCardWidth =
    (contentWidth - horizontalPadding - listGap * (listColumns - 1)) /
    listColumns;

  const gridCardWidth =
    (contentWidth - horizontalPadding - gridGap * (gridColumns - 1)) /
    gridColumns;

  const enrichedLists = useMemo(() => {
      return lists.map((list) => {
        const listBooks = list.bookIds
          .map((bookId) => books.find((book) => book.id === bookId))
          .filter(Boolean);
    
        return {
          ...list,
          subtitle: `${list.bookIds.length} book${list.bookIds.length === 1 ? "" : "s"}`,
          covers: listBooks.slice(0, 3).map((book) => book!.coverUrl),
          previewCover: listBooks[0]?.coverUrl ?? null,
        };
      });
    }, [lists, books]);

  const onMenu = (list: (typeof enrichedLists)[number]) => {
    Alert.alert(list.title, "What do you want to do?", [
      { text: "Share", onPress: () => Alert.alert("Share", "Coming soon") },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteList(list.id),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const onCreateList = () => {
    setCreateOpen(true);
  };

  const onCloseCreate = () => {
    setCreateOpen(false);
    setNewListTitle("");
  };

  const onSubmitCreate = () => {
    const trimmed = newListTitle.trim();

    if (!trimmed) {
      Alert.alert("Missing title", "Please enter a name for your list.");
      return;
    }

    createList(trimmed);
    onCloseCreate();
  };

  return (
    <Screen>
      <AppHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Content>
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

            <CreateButton onPress={onCreateList}>
              {isMobile ? (
                <Ionicons name="add" size={24} color="#fff" />
              ) : (
                <CreateButtonText>+ Create List</CreateButtonText>
              )}
            </CreateButton>
          </ActionsRow>

          {mode === "list" ? (
            <ListWrap>
              {enrichedLists.map((list) => (
                <ListCard key={list.id} style={{ width: listCardWidth }} onPress={() => router.push(`/list/${list.id}`)}>
                  <ListCardTop>
                    <ListTextWrap>
                      <ListTitle numberOfLines={1}>{list.title}</ListTitle>
                      <ListMeta>{list.subtitle}</ListMeta>
                    </ListTextWrap>

                    <MenuButton onPress={() => onMenu(list)}>
                      <Ionicons
                        name="ellipsis-horizontal"
                        size={18}
                        color="#6b7280"
                      />
                    </MenuButton>
                  </ListCardTop>

                  <CoverRow>
                    {list.covers.length > 0 ? (
                      list.covers.map((cover, index) => (
                        <MiniCover
                          key={`${list.id}-${index}`}
                          source={{ uri: cover }}
                        />
                      ))
                    ) : (
                      <EmptyCoverPlaceholder>
                        <EmptyCoverText>No books yet</EmptyCoverText>
                      </EmptyCoverPlaceholder>
                    )}
                  </CoverRow>
                </ListCard>
              ))}
            </ListWrap>
          ) : (
            <GridWrap>
              {enrichedLists.map((list) => (
                <GridCard
                  key={list.id}
                  style={{ width: gridCardWidth }}
                  onPress={() => router.push(`/list/${list.id}`)}
                >
                  {list.previewCover ? (
                    <GridBackgroundImage
                      source={{ uri: list.previewCover }}
                      resizeMode="cover"
                    />
                  ) : (
                    <GridEmptyBackground>
                      <Ionicons name="book-outline" size={28} color="#6b7280" />
                    </GridEmptyBackground>
                  )}

                  <GridOverlay pointerEvents="none">
                    <LinearGradient
                      colors={[
                        "rgba(18, 18, 24, 0.05)",
                        "rgba(18, 18, 24, 0.25)",
                        "rgba(18, 18, 24, 0.65)",
                      ]}
                      locations={[0, 0.5, 1]}
                      style={{ flex: 1 }}
                    />
                  </GridOverlay>

                  <GridCardTop>
                    <GridMenuButton onPress={() => onMenu(list)}>
                      <Ionicons
                        name="ellipsis-horizontal"
                        size={18}
                        color="#ffffff"
                      />
                    </GridMenuButton>
                  </GridCardTop>

                  <GridCardBottom>
                    <GridTitleOnImage numberOfLines={2}>{list.title}</GridTitleOnImage>
                    <GridMetaOnImage>{list.subtitle}</GridMetaOnImage>
                  </GridCardBottom>
                </GridCard>
              ))}
            </GridWrap>
          )}
        </Content>
      </ScrollView>

      <Modal
        visible={createOpen}
        transparent
        animationType="fade"
        onRequestClose={onCloseCreate}
      >
        <ModalOverlay>
          <ModalCard>
            <ModalTitle>Create New List</ModalTitle>
            <ModalSubtitle>
              Give your new reading list a name
            </ModalSubtitle>

            <TitleInput
              value={newListTitle}
              onChangeText={setNewListTitle}
              placeholder="e.g. Cozy Autumn Reads"
              placeholderTextColor="rgba(113, 113, 130, 0.9)"
              autoFocus
            />

            <ModalActions>
              <SecondaryButton onPress={onCloseCreate}>
                <SecondaryButtonText>Cancel</SecondaryButtonText>
              </SecondaryButton>

              <PrimaryButton onPress={onSubmitCreate}>
                <PrimaryButtonText>Create</PrimaryButtonText>
              </PrimaryButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      </Modal>
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
`;

const Content = styled.View`
  width: 100%;
  max-width: 1000px;
  align-self: center;
`;

const TopRow = styled.View`
  padding: 18px 18px 8px 18px;
`;

const TitleBlock = styled.View`
  gap: 6px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
  letter-spacing: -0.4px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.font.family.medium};
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
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
`;

const CreateButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-weight: ${({ theme }) => theme.font.family.semibold};
  font-size: 15px;
  padding: 0 14px;
`;

const ListWrap = styled.View`
  padding: 0 18px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 14px;
`;

const ListCard = styled.Pressable`
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
  font-weight: ${({ theme }) => theme.font.family.semibold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const ListMeta = styled.Text`
  margin-top: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
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
  min-height: 110px;
`;

const MiniCover = styled.Image`
  width: 74px;
  height: 110px;
  border-radius: 10px;
`;

const EmptyCoverPlaceholder = styled.View`
  width: 100%;
  min-height: 110px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.muted};
  align-items: center;
  justify-content: center;
`;

const EmptyCoverText = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const GridWrap = styled.View`
  padding: 0 18px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const GridCard = styled.Pressable`
  position: relative;
  min-height: 210px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.xl}px;
  
  background: ${({ theme }) => theme.colors.card};

  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 12px;
  shadow-offset: 0px 6px;
  elevation: 4;
`;

const GridBackgroundImage = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const GridEmptyBackground = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.muted};
  align-items: center;
  justify-content: center;
`;

const GridOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

const GridCardTop = styled.View`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
`;

const GridMenuButton = styled.Pressable`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.28);
`;

const GridCardBottom = styled.View`
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 14px;
  z-index: 2;
`;

const GridTitleOnImage = styled.Text`
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
  font-weight: ${({ theme }) => theme.font.family.bold};
  text-shadow-color: rgba(0, 0, 0, 0.35);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 3px;
`;

const GridMetaOnImage = styled.Text`
  margin-top: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: ${({ theme }) => theme.font.family.medium};
  text-shadow-color: rgba(0, 0, 0, 0.35);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 3px;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background: rgba(0, 0, 0, 0.35);
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalCard = styled.View`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const ModalSubtitle = styled.Text`
  margin-top: 6px;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const TitleInput = styled(TextInput)`
  margin-top: 16px;
  height: 48px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 16px;
`;

const ModalActions = styled.View`
  margin-top: 18px;
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
`;

const SecondaryButton = styled.Pressable`
  height: 42px;
  padding: 0 16px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  align-items: center;
  justify-content: center;
`;

const SecondaryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const PrimaryButton = styled.Pressable`
  height: 42px;
  padding: 0 16px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

const PrimaryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;