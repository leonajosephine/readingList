import React, { useMemo, useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { AppHeader } from "../../src/components/AppHeader";
import { BookCard } from "../../src/components/BookCard";

type Book = { id: string; title: string; author: string; rating?: string; coverUrl: string; genre: string };

const GENRES = ["All", "Fantasy", "Mystery", "Romance", "Sci-Fi", "Classics", "Non-Fiction"];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");

  const books = useMemo<Book[]>(
    () => [
      { id: "1", title: "The Midnight Library", author: "Matt Haig", rating: "4.5", coverUrl: "https://picsum.photos/400/601", genre: "Fantasy" },
      { id: "2", title: "The Name of the Wind", author: "Patrick Rothfuss", rating: "4.6", coverUrl: "https://picsum.photos/401/601", genre: "Fantasy" },
      { id: "3", title: "Gone Girl", author: "Gillian Flynn", rating: "4.1", coverUrl: "https://picsum.photos/402/601", genre: "Mystery" },
      { id: "4", title: "Pride and Prejudice", author: "Jane Austen", rating: "4.4", coverUrl: "https://picsum.photos/403/601", genre: "Classics" },
      { id: "5", title: "Dune", author: "Frank Herbert", rating: "4.3", coverUrl: "https://picsum.photos/404/601", genre: "Sci-Fi" },
      { id: "6", title: "It Ends With Us", author: "Colleen Hoover", rating: "4.2", coverUrl: "https://picsum.photos/405/601", genre: "Romance" },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      const matchGenre = genre === "All" ? true : b.genre === genre;
      const matchQuery = q.length === 0 ? true : b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      return matchGenre && matchQuery;
    });
  }, [books, genre, query]);

  const { width } = useWindowDimensions();

    const horizontalPadding = 18 * 2;
    const gap = 12;
    const availableWidth = width - horizontalPadding - gap;
    const cardWidth = Math.min(availableWidth / 2, 256);

  return (
    <Screen>
      <AppHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
        <Title>Search Books</Title>

        <SearchWrap>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by title, author…"
            placeholderTextColor="rgba(120,120,130,0.9)"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </SearchWrap>

        <ChipsScroll horizontal showsHorizontalScrollIndicator={false}>
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

        <Grid>
            {filtered.map((b) => (
                <BookCard
                key={b.id}
                style={{ width: cardWidth }}
                book={{
                    id: b.id,
                    title: b.title,
                    author: b.author,
                    rating: b.rating ?? "0.0",
                    coverUrl: b.coverUrl,
                    status: "to-read",
                }}
                />
            ))}
            </Grid>
      </ScrollView>
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
  padding: 8px 18px 12px 18px;
`;

const SearchWrap = styled.View`
  padding: 0 18px 12px 18px;
`;

const SearchInput = styled.TextInput`
  background: ${({ theme }) => theme.colors.inputBackground};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 14px 14px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.foreground};
`;

const ChipsScroll = styled.ScrollView`
  padding-left: 18px;
  margin-bottom: 14px;
`;

const ChipsRow = styled.View`
  flex-direction: row;
  gap: 10px;
  padding-right: 18px;
`;

const Chip = styled.Pressable<{ active: boolean }>`
  padding: 10px 14px;
  border-radius: 999px;
  background: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.muted)};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const ChipText = styled.Text<{ active: boolean }>`
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ active, theme }) => (active ? theme.colors.primaryForeground : theme.colors.foreground)};
`;

const Grid = styled.View`
  padding: 0 18px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;