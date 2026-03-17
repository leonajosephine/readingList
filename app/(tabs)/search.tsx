import React, { useMemo, useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { AppHeader } from "../../src/components/AppHeader";
import { BookCard, BookCardBook } from "../../src/components/BookCard";
import { Ionicons } from "@expo/vector-icons";
import { useLibrary } from "../../src/store/LibraryContext";
import { useRouter } from "expo-router";
import { BookActionsSheet } from "../../src/components/BookActionsSheet";
import { BookListPickerModal } from "../../src/components/BookListPickerModal";

const GENRES = [
  "All",
  "Fantasy",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Classics",
  "Non-Fiction",
];

export default function SearchScreen() {
  const router = useRouter();
  const { books, updateBookStatus } = useLibrary();

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");

  const [selectedBook, setSelectedBook] = useState<BookCardBook | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [listPickerOpen, setListPickerOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return books.filter((b) => {
      const matchGenre = genre === "All" ? true : b.genre === genre;
      const matchQuery =
        q.length === 0
          ? true
          : b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q);

      return matchGenre && matchQuery;
    });
  }, [books, genre, query]);

  const { width } = useWindowDimensions();

  const contentMaxWidth = 1000;
  const contentWidth = Math.min(width, contentMaxWidth);

  const horizontalPadding = 18 * 2;
  const gap = 12;

  const isTablet = width >= 768;
  const isDesktop = width >= 1100;

  const columns = isDesktop ? 4 : isTablet ? 3 : 2;

  const cardWidth =
    (contentWidth - horizontalPadding - gap * (columns - 1)) / columns;

  const openBookActions = (book: BookCardBook) => {
    setSelectedBook(book);
    setActionsOpen(true);
  };

  const closeBookActions = () => {
    setActionsOpen(false);
  };

  const closeAllBookMenus = () => {
    setActionsOpen(false);
    setListPickerOpen(false);
    setSelectedBook(null);
  };

  return (
    <Screen>
      <AppHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
        <Content>
          <Title>Search Books</Title>

          <SearchWrap>
            <SearchBox>
              <SearchIconWrap>
                <Ionicons
                  name="search-outline"
                  size={20}
                  color="rgba(113, 113, 130, 0.9)"
                />
              </SearchIconWrap>

              <SearchInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by title, author..."
                placeholderTextColor="rgba(113, 113, 130, 0.9)"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </SearchBox>
          </SearchWrap>

          <ChipsScroll
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 18, paddingRight: 18 }}
          >
            <ChipsRow>
              {GENRES.map((g) => {
                const active = g === genre;

                return (
                  <Chip key={g} active={active} onPress={() => setGenre(g)}>
                    <ChipText active={active}>{g}</ChipText>
                  </Chip>
                );
              })}
            </ChipsRow>
          </ChipsScroll>

          <ResultsText>{filtered.length} books found</ResultsText>

          <Grid>
            {filtered.map((book) => {
              const mappedBook: BookCardBook = {
                id: book.id,
                title: book.title,
                author: book.author,
                rating: book.rating ?? "0.0",
                coverUrl: book.coverUrl,
                status: book.status,
              };

              return (
                <BookCard
                  key={book.id}
                  style={{ width: cardWidth }}
                  onPress={() => router.push(`/book/${book.id}`)}
                  onLongPress={() => openBookActions(mappedBook)}
                  book={mappedBook}
                />
              );
            })}
          </Grid>
        </Content>
      </ScrollView>

      <BookActionsSheet
        visible={actionsOpen}
        title={selectedBook?.title}
        author={selectedBook?.author}
        coverUrl={selectedBook?.coverUrl}
        currentStatus={selectedBook?.status}
        onClose={closeAllBookMenus}
        onAddToList={() => {
          closeBookActions();
          setTimeout(() => {
            setListPickerOpen(true);
          }, 180);
        }}
        onMarkReading={() => {
          if (!selectedBook) return;
          updateBookStatus(selectedBook.id, "reading");
          closeAllBookMenus();
        }}
        onMarkCompleted={() => {
          if (!selectedBook) return;
          updateBookStatus(selectedBook.id, "done");
          closeAllBookMenus();
        }}
        onMarkToRead={() => {
          if (!selectedBook) return;
          updateBookStatus(selectedBook.id, "to-read");
          closeAllBookMenus();
        }}
      />

      <BookListPickerModal
        visible={listPickerOpen}
        bookId={selectedBook?.id}
        onClose={closeAllBookMenus}
      />
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

const Title = styled.Text`
  font-size: 32px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
  padding: 8px 18px 12px 18px;
`;

const SearchWrap = styled.View`
  padding: 0 18px 14px 18px;
`;

const SearchBox = styled.View`
  height: 48px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  flex-direction: row;
  align-items: center;
  padding: 0 14px;
`;

const SearchIconWrap = styled.View`
  margin-right: 10px;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  height: 100%;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.foreground};
  font-family: ${({ theme }) => theme.font.family.medium};
`;

const ChipsScroll = styled.ScrollView`
  margin-bottom: 24px;
`;

const ChipsRow = styled.View`
  flex-direction: row;
  gap: 10px;
`;

const Chip = styled.Pressable<{ active: boolean }>`
  padding: 8px 14px;
  border-radius: 20px;
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.muted};
`;

const ChipText = styled.Text<{ active: boolean }>`
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ active, theme }) =>
    active ? theme.colors.primaryForeground : theme.colors.foreground};
`;

const ResultsText = styled.Text`
  padding: 2px 18px 14px 18px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 14px;
  font-family: ${({ theme }) => theme.font.family.medium};
`;

const Grid = styled.View`
  padding: 0 18px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;
