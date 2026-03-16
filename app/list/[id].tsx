import React, { useMemo } from "react";
import { Alert, ScrollView, useWindowDimensions } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useLibrary } from "../../src/store/LibraryContext";
import { BookCard } from "../../src/components/BookCard";

export default function ListDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lists, books, removeBookFromList } = useLibrary();

  const list = lists.find((item) => item.id === id);

  const listBooks = useMemo(() => {
    if (!list) return [];

    return list.bookIds
      .map((bookId) => books.find((book) => book.id === bookId))
      .filter(Boolean);
  }, [list, books]);

  const contentMaxWidth = 1000;
  const contentWidth = Math.min(width, contentMaxWidth);

  const horizontalPadding = 18 * 2;
  const gap = 12;

  const isTablet = width >= 768;
  const isDesktop = width >= 1100;

  const columns = isDesktop ? 4 : isTablet ? 3 : 2;

  const cardWidth =
    (contentWidth - horizontalPadding - gap * (columns - 1)) / columns;

  const onRemoveBook = (bookId: string, title: string) => {
    if (!list) return;

    Alert.alert(
      "Remove book",
      `Remove "${title}" from this list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeBookFromList(bookId, list.id),
        },
      ]
    );
  };

  if (!list) {
    return (
      <Screen>
        <StickyTopBar>
          <TopBarInner>
            <BackButton onPress={() => router.back()}>
              <Ionicons
                name="chevron-back"
                size={20}
                color={theme.colors.foreground}
              />
            </BackButton>
          </TopBarInner>
        </StickyTopBar>

        <Centered>
          <EmptyTitle>List not found</EmptyTitle>
          <EmptyText>This list could not be loaded.</EmptyText>
        </Centered>
      </Screen>
    );
  }

  return (
    <Screen>
      <StickyTopBar>
        <TopBarInner>
          <BackButton onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={20}
              color={theme.colors.foreground}
            />
          </BackButton>
        </TopBarInner>
      </StickyTopBar>

      <ScrollView contentContainerStyle={{ paddingTop: 82, paddingBottom: 40 }}>
        <Content>
          <HeaderBlock>
            <Title>{list.title}</Title>
            <Subtitle>
              {list.bookIds.length} book{list.bookIds.length === 1 ? "" : "s"} in this list
            </Subtitle>
          </HeaderBlock>

          <TopActions>
            <PrimaryAction onPress={() => Alert.alert("Add Books", "Coming soon")}>
              <PrimaryActionText>Add Books</PrimaryActionText>
            </PrimaryAction>

            <SecondaryAction onPress={() => Alert.alert("Share List", "Coming soon")}>
              <SecondaryActionText>Share</SecondaryActionText>
            </SecondaryAction>
          </TopActions>

          {listBooks.length > 0 ? (
            <Grid>
              {listBooks.map((book) => (
                <BookCardWrap key={book!.id}>
                  <BookCard
                    style={{ width: cardWidth }}
                    onPress={() => router.push(`/book/${book!.id}`)}
                    book={{
                      id: book!.id,
                      title: book!.title,
                      author: book!.author,
                      rating: book!.rating ?? "0.0",
                      coverUrl: book!.coverUrl,
                      status: book!.status,
                    }}
                  />

                  <RemoveButton
                    onPress={() => onRemoveBook(book!.id, book!.title)}
                  >
                    <Ionicons
                      name="close"
                      size={16}
                      color={theme.colors.foreground}
                    />
                  </RemoveButton>
                </BookCardWrap>
              ))}
            </Grid>
          ) : (
            <EmptyStateCard>
              <EmptyStateTitle>No books yet</EmptyStateTitle>
              <EmptyStateText>
                Start adding books to this list to organize your reading.
              </EmptyStateText>
            </EmptyStateCard>
          )}
        </Content>
      </ScrollView>
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
  padding: 0 18px;
`;

const StickyTopBar = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding-top: 36px;
  background: ${({ theme }) => theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const TopBarInner = styled.View`
  width: 100%;
  max-width: 1000px;
  align-self: center;
  padding: 0 18px 12px 18px;
`;

const BackButton = styled.Pressable`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const HeaderBlock = styled.View`
  gap: 8px;
  margin-top: 26px;
`;

const Title = styled.Text`
  font-size: 32px;
  line-height: 38px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.bold};
  letter-spacing: -0.4px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const TopActions = styled.View`
  margin-top: 18px;
  flex-direction: row;
  gap: 12px;
`;

const PrimaryAction = styled.Pressable`
  flex: 1;
  height: 46px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
`;

const PrimaryActionText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const SecondaryAction = styled.Pressable`
  min-width: 110px;
  height: 46px;
  padding: 0 16px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const SecondaryActionText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const Grid = styled.View`
  margin-top: 24px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const BookCardWrap = styled.View`
  position: relative;
`;

const RemoveButton = styled.Pressable`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 5;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const EmptyStateCard = styled.View`
  margin-top: 24px;
  border-radius: ${({ theme }) => theme.radius.xl}px;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 22px;
  gap: 8px;
`;

const EmptyStateTitle = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const EmptyStateText = styled.Text`
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const Centered = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const EmptyTitle = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const EmptyText = styled.Text`
  margin-top: 8px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.mutedForeground};
`;