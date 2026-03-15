import React, { useMemo, useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { AppHeader } from "../../src/components/AppHeader";
import { BookCard } from "../../src/components/BookCard";
import { Ionicons } from "@expo/vector-icons";
import { useLibrary } from "../../src/store/LibraryContext";
import { useRouter } from "expo-router";

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
  const { books } = useLibrary();

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");

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

  const router = useRouter();

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
            {filtered.map((book) => (
              <BookCard
                key={book.id}
                style={{ width: cardWidth }}
                onPress={() => router.push(`/book/${book.id}`)}
                book={{
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  rating: book.rating ?? "0.0",
                  coverUrl: book.coverUrl,
                  status: book.status,
                }}
              />
            ))}
          </Grid>
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
