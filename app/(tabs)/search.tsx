import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, useWindowDimensions } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { AppHeader } from "../../src/components/AppHeader";
import { BookCard, BookCardBook } from "../../src/components/BookCard";
import { Ionicons } from "@expo/vector-icons";
import { useLibrary } from "../../src/store/LibraryContext";
import { useRouter } from "expo-router";
import { BookActionsSheet } from "../../src/components/BookActionsSheet";
import { BookListPickerModal } from "../../src/components/BookListPickerModal";
import { searchBooks, ExternalBook } from "../../src/services/bookApi";

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
  const theme = useTheme();

  const { books, updateBookStatus, addExternalBookToLibrary } = useLibrary();

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");

  const [selectedBook, setSelectedBook] = useState<BookCardBook | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [listPickerOpen, setListPickerOpen] = useState(false);

  const [apiResults, setApiResults] = useState<ExternalBook[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [addingBookId, setAddingBookId] = useState<string | null>(null);

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

  const onSearchApi = async () => {
    const trimmed = query.trim();

    if (trimmed.length < 3) {
      setApiResults([]);
      return;
    }

    try {
      setApiLoading(true);
      const results = await searchBooks(trimmed);
      setApiResults(results);
    } catch (error) {
      console.log("API search error:", error);
      Alert.alert("Search failed", "Could not search books online.");
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 3) {
      setApiResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      onSearchApi();
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  const onAddExternalBook = async (book: ExternalBook) => {
    try {
      setAddingBookId(book.externalId);

      const bookId = await addExternalBookToLibrary(book);

      if (!bookId) {
        Alert.alert("Could not add book", "Something went wrong.");
        return;
      }

      router.push(`/book/${bookId}`);
    } finally {
      setAddingBookId(null);
    }
  };

  const isAlreadyInLibrary = (externalBook: ExternalBook) => {
    return books.some(
      (book) =>
        book.title.toLowerCase() === externalBook.title.toLowerCase() &&
        book.author.toLowerCase() === externalBook.author.toLowerCase()
    );
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
                returnKeyType="search"
                onSubmitEditing={onSearchApi}
              />

              <SearchSubmitButton onPress={onSearchApi} disabled={apiLoading}>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={theme.colors.primaryForeground}
                />
              </SearchSubmitButton>
            </SearchBox>
          </SearchWrap>

          {apiLoading ? (
            <SearchHint>Searching online...</SearchHint>
          ) : query.trim().length > 0 && query.trim().length < 3 ? (
            <SearchHint>Type at least 3 characters to search online</SearchHint>
          ) : null}

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

          <ResultsText>{filtered.length} books in your library</ResultsText>

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

          {apiResults.length > 0 ? (
            <>
              <OnlineSectionHeader>
                <OnlineSectionTitle>Online Results</OnlineSectionTitle>
                <OnlineSectionSub>
                  Add books from Open Library to your personal library
                </OnlineSectionSub>
              </OnlineSectionHeader>

              <ApiResultsWrap>
                {apiResults.map((book) => {
                  const alreadyAdded = isAlreadyInLibrary(book);
                  const isAdding = addingBookId === book.externalId;

                  return (
                    <ApiResultCard key={book.externalId}>
                      <ApiCover source={{ uri: book.coverUrl }} resizeMode="cover" />

                      <ApiResultInfo>
                        <ApiResultTitle numberOfLines={2}>
                          {book.title}
                        </ApiResultTitle>

                        <ApiResultAuthor numberOfLines={1}>
                          {book.author}
                        </ApiResultAuthor>

                        <ApiMetaRow>
                          {book.publishedYear ? (
                            <ApiMetaPill>
                              <ApiMetaText>{book.publishedYear}</ApiMetaText>
                            </ApiMetaPill>
                          ) : null}

                          {book.totalPages ? (
                            <ApiMetaPill>
                              <ApiMetaText>{book.totalPages} pages</ApiMetaText>
                            </ApiMetaPill>
                          ) : null}
                        </ApiMetaRow>

                        <AddBookButton
                          disabled={alreadyAdded || isAdding}
                          onPress={() => onAddExternalBook(book)}
                        >
                          <AddBookButtonText>
                            {alreadyAdded
                              ? "Already in Library"
                              : isAdding
                                ? "Adding..."
                                : "Add to Library"}
                          </AddBookButtonText>
                        </AddBookButton>
                      </ApiResultInfo>
                    </ApiResultCard>
                  );
                })}
              </ApiResultsWrap>
            </>
          ) : null}
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
  padding: 0 6px 0 14px;
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

const SearchSubmitButton = styled.Pressable`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.65 : 1)};
`;

const SearchHint = styled.Text`
  padding: 0 18px 14px 18px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.family.medium};
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

const OnlineSectionHeader = styled.View`
  padding: 28px 18px 12px 18px;
`;

const OnlineSectionTitle = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 24px;
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const OnlineSectionSub = styled.Text`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 14px;
  line-height: 20px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const ApiResultsWrap = styled.View`
  padding: 0 18px 24px 18px;
  gap: 12px;
`;

const ApiResultCard = styled.View`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 12px;
  flex-direction: row;
  gap: 12px;
`;

const ApiCover = styled.Image`
  width: 72px;
  height: 108px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.muted};
`;

const ApiResultInfo = styled.View`
  flex: 1;
`;

const ApiResultTitle = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 16px;
  line-height: 22px;
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const ApiResultAuthor = styled.Text`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const ApiMetaRow = styled.View`
  margin-top: 8px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
`;

const ApiMetaPill = styled.View`
  padding: 5px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.muted};
`;

const ApiMetaText = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const AddBookButton = styled.Pressable`
  align-self: flex-start;
  margin-top: 12px;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const AddBookButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;