import React, { useMemo, useState, useEffect } from "react";
import { Alert, ScrollView, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { useRouter } from "expo-router";

import { AppHeader } from "../../src/components/AppHeader";
import { StatCard } from "../../src/components/StatCard";
import { BookCard, BookCardBook } from "../../src/components/BookCard";
import { SegmentedControl } from "../../src/components/SegmentedControl";
import { BookActionsSheet } from "../../src/components/BookActionsSheet";
import { BookListPickerModal } from "../../src/components/BookListPickerModal";
import { useLibrary } from "../../src/store/LibraryContext";
import { supabase } from "../../src/lib/supabase";


const testConnection = async () => {
  const { data, error } = await supabase.from("books").select("*").limit(1);
  console.log("books:", data);
  console.log("error:", error);
};


export default function HomeScreen() {
  const router = useRouter();
  const { books, updateBookStatus } = useLibrary();

  const [filter, setFilter] = useState<"all" | "toRead" | "done">("all");
  const [selectedBook, setSelectedBook] = useState<BookCardBook | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [listPickerOpen, setListPickerOpen] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      Alert.alert("Logout failed", error.message);
    } else {
      router.replace("/auth");
    }
  };

  const { width } = useWindowDimensions();

  const contentMaxWidth = 1000;
  const contentWidth = Math.min(width, contentMaxWidth);

  const horizontalPadding = 18 * 2;
  const cardsGap = 14;

  const isTablet = width >= 768;
  const isDesktop = width >= 1100;

  const currentlyReading = useMemo(
    () => books.filter((book) => book.status === "reading"),
    [books]
  );

  const toReadBooks = useMemo(
    () => books.filter((book) => book.status === "to-read"),
    [books]
  );

  const doneBooks = useMemo(
    () => books.filter((book) => book.status === "done"),
    [books]
  );

  const libraryBooks = useMemo(() => {
    if (filter === "toRead") return toReadBooks;
    if (filter === "done") return doneBooks;
    return books;
  }, [books, doneBooks, filter, toReadBooks]);

  const readingColumns = isDesktop ? 4 : isTablet ? 3 : 2;
  const readingCardWidth =
    (contentWidth - horizontalPadding - cardsGap * (readingColumns - 1)) /
    readingColumns;

  const libraryColumns = isDesktop ? 4 : isTablet ? 3 : 2;
  const libraryGap = 12;
  const libraryCardWidth =
    (contentWidth - horizontalPadding - libraryGap * (libraryColumns - 1)) /
    libraryColumns;

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

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <Content>
          <H1>Hi Leona</H1>
          <Sub>Track, organize, and discover your next favorite book</Sub>

          <LogoutButton onPress={onLogout}>
            <LogoutButtonText>Log out</LogoutButtonText>
          </LogoutButton>

          <StatsRow>
            <StatCard label="Reading" value={String(currentlyReading.length)} />
            <StatCard label="To Read" value={String(toReadBooks.length)} />
            <StatCard label="Done" value={String(doneBooks.length)} />
          </StatsRow>

          <SectionTitle>Currently Reading</SectionTitle>
          <CardsRow>
            {currentlyReading.map((book) => (
              <BookCard
                key={book.id}
                style={{ width: readingCardWidth }}
                onPress={() => router.push(`/book/${book.id}`)}
                onLongPress={() =>
                  openBookActions({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    rating: book.rating ?? "0.0",
                    coverUrl: book.coverUrl,
                    status: book.status,
                  })
                }
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
          </CardsRow>

          <SectionTitle>Your Library</SectionTitle>

          <SegmentWrap>
            <SegmentedControl
              value={filter}
              onChange={(k) => setFilter(k as "all" | "toRead" | "done")}
              options={[
                { key: "all", label: "All" },
                { key: "toRead", label: "To Read" },
                { key: "done", label: "Done" },
              ]}
            />
          </SegmentWrap>

          <LibraryGrid>
            {libraryBooks.map((book) => (
              <BookCard
                key={book.id}
                style={{ width: libraryCardWidth }}
                onPress={() => router.push(`/book/${book.id}`)}
                onLongPress={() =>
                  openBookActions({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    rating: book.rating ?? "0.0",
                    coverUrl: book.coverUrl,
                    status: book.status,
                  })
                }
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
          </LibraryGrid>

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

const H1 = styled.Text`
  font-size: 32px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
  padding: 0 18px;
  margin-top: 10px;
  letter-spacing: -0.5px;
`;

const Sub = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  padding: 8px 18px 0 18px;
  line-height: 24px;
  font-weight: ${({ theme }) => theme.font.family.medium};
  max-width: 340px;
`;

const StatsRow = styled.View`
  flex-direction: row;
  gap: 11px;
  padding: 18px;
`;

const SectionTitle = styled.Text`
  font-size: 24px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
  padding: 14px 18px 14px 18px;
  letter-spacing: -0.3px;
`;

const CardsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 14px;
  padding: 0 18px 18px 18px;
`;

const SegmentWrap = styled.View`
  padding: 0 18px;
  width: 100%;
  max-width: 420px;
`;

const LibraryGrid = styled.View`
  padding: 16px 18px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const LogoutButton = styled.Pressable`
  align-self: flex-start;
  margin: 14px 18px 0 18px;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const LogoutButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;