import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, ScrollView, useWindowDimensions } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AppHeader } from "../../src/components/AppHeader";
import { BookCard, BookCardBook } from "../../src/components/BookCard";
import { SegmentedControl } from "../../src/components/SegmentedControl";
import { BookActionsSheet } from "../../src/components/BookActionsSheet";
import { BookListPickerModal } from "../../src/components/BookListPickerModal";
import { useLibrary } from "../../src/store/LibraryContext";
import { supabase } from "../../src/lib/supabase";

type Rank = {
  title: string;
  icon: string;
  minBooks: number;
};

const RANKS: Rank[] = [
  { title: "Novice: Which end of the wand glows again?", icon: "🌱", minBooks: 0 }, // Egg: Still figuring things out
  { title: "Sorcerer's apprentice: Needs a nap", icon: "🪄", minBooks: 10 }, // Scaly Hatchling: Danger noodle
  { title: "Mistress of the Citadel", icon: "🏰", minBooks: 25 }, // Teenage Dragon: 
  { title: "High Mage: Almost the big boss", icon: "🧙‍♂️", minBooks: 40 }, //Elder Dragon: Knows everything, complains about everything
  { title: "High Fae & Princess of Knowledge", icon: "👑", minBooks: 50 }, //
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  const { books, lists, updateBookStatus, loading } = useLibrary();

  const [displayName, setDisplayName] = useState("Reader");
  const [filter, setFilter] = useState<"all" | "toRead" | "done">("all");
  const [selectedBook, setSelectedBook] = useState<BookCardBook | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [listPickerOpen, setListPickerOpen] = useState(false);
  const [activeReadingIndex, setActiveReadingIndex] = useState(0);
  const [rankOpen, setRankOpen] = useState(false);

  const { width } = useWindowDimensions();

  useEffect(() => {
    const loadUserName = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const nameFromMetadata =
        user?.user_metadata?.name ||
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0];

      setDisplayName(nameFromMetadata || "Reader");
    };

    loadUserName();
  }, []);

  const contentMaxWidth = 1000;
  const contentWidth = Math.min(width, contentMaxWidth);
  const horizontalPadding = 18 * 2;
  const libraryGap = 12;

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

  const rankInfo = useMemo(() => {
    const done = doneBooks.length;
    const current =
      [...RANKS].reverse().find((rank) => done >= rank.minBooks) ?? RANKS[0];

    const currentIndex = RANKS.findIndex((rank) => rank.title === current.title);
    const next = RANKS[currentIndex + 1];
    const booksUntilNext = next ? Math.max(next.minBooks - done, 0) : 0;

    return { current, next, booksUntilNext };
  }, [doneBooks.length]);

  const enrichedLists = useMemo(() => {
    return lists.slice(0, 2).map((list) => {
      const listBooks = list.bookIds
        .map((bookId) => books.find((book) => book.id === bookId))
        .filter(Boolean);

      return {
        ...list,
        subtitle: `${list.bookIds.length} book${list.bookIds.length === 1 ? "" : "s"}`,
        covers: listBooks.slice(0, 4).map((book) => book!.coverUrl),
      };
    });
  }, [lists, books]);

  const libraryColumns = isDesktop ? 4 : isTablet ? 3 : 2;
  const libraryCardWidth =
    (contentWidth - horizontalPadding - libraryGap * (libraryColumns - 1)) /
    libraryColumns;

  const carouselCardWidth = contentWidth - horizontalPadding;

  const mapBook = (book: (typeof books)[number]): BookCardBook => ({
    id: book.id,
    title: book.title,
    author: book.author,
    rating: book.rating ?? "0.0",
    coverUrl: book.coverUrl,
    status: book.status,
  });

  const openBookActions = (book: BookCardBook) => {
    setSelectedBook(book);
    setActionsOpen(true);
  };

  const closeBookActions = () => setActionsOpen(false);

  const closeAllBookMenus = () => {
    setActionsOpen(false);
    setListPickerOpen(false);
    setSelectedBook(null);
  };

  if (loading) {
    return (
      <Screen>
        <AppHeader />
        <LoadingWrap>
          <ActivityIndicator />
          <LoadingText>Loading your library...</LoadingText>
        </LoadingWrap>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Content>
          <HeroBlock>
            <WelcomeWrap>
              <WelcomeKicker>Welcome back,</WelcomeKicker>
              <WelcomeText>Hi {displayName} ✨</WelcomeText>
            </WelcomeWrap>

            <RankCardButton onPress={() => setRankOpen(true)}>
              <RankIconBubble>
                <RankIcon>{rankInfo.current.icon}</RankIcon>
              </RankIconBubble>

              <RankCopy>
                <RankTitle numberOfLines={1}>{rankInfo.current.title}</RankTitle>
                <RankSub numberOfLines={1}>
                  {rankInfo.next
                    ? `${rankInfo.booksUntilNext} books to ${rankInfo.next.title}`
                    : "Highest rank reached"}
                </RankSub>
              </RankCopy>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.mutedForeground}
              />
            </RankCardButton>
          </HeroBlock>

          <StatsPanel>
            <StatBox>
              <StatIconBubble>
                <Ionicons
                  name="book-outline"
                  size={18}
                  color={theme.colors.mutedForeground}
                />
              </StatIconBubble>
              <StatNumber>{doneBooks.length}</StatNumber>
              <StatLabel>Books Read</StatLabel>
            </StatBox>

            <StatDivider />

            <StatBox>
              <StatIconBubble>
                <Ionicons
                  name="bookmark-outline"
                  size={18}
                  color={theme.colors.mutedForeground}
                />
              </StatIconBubble>
              <StatNumber>{toReadBooks.length}</StatNumber>
              <StatLabel>To Read</StatLabel>
            </StatBox>

            <StatDivider />

            <StatBox>
              <StatIconBubble>
                <Ionicons
                  name="reader-outline"
                  size={18}
                  color={theme.colors.mutedForeground}
                />
              </StatIconBubble>
              <StatNumber>{currentlyReading.length}</StatNumber>
              <StatLabel>Reading</StatLabel>
            </StatBox>
          </StatsPanel>

          <SectionHeader>
            <SectionTitle>Currently Reading</SectionTitle>
          </SectionHeader>

          {currentlyReading.length > 0 ? (
            <>
              <Carousel
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={carouselCardWidth + 12}
                contentContainerStyle={{ paddingHorizontal: 18, gap: 12 }}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / (carouselCardWidth + 12)
                  );
                  setActiveReadingIndex(index);
                }}
              >
                {currentlyReading.map((book) => {
                  const total = book.totalPages ?? 0;
                  const current = Math.min(book.currentPage ?? 0, total);
                  const percent =
                    total > 0 ? Math.round((current / total) * 100) : 0;
                  const mappedBook = mapBook(book);

                  return (
                    <ReadingCard
                      key={book.id}
                      style={{ width: carouselCardWidth }}
                      onPress={() => router.push(`/book/${book.id}`)}
                      onLongPress={() => openBookActions(mappedBook)}
                    >
                      <ReadingMainRow>
                        <ReadingCover source={{ uri: book.coverUrl }} />

                        <ReadingInfo>
                          <ReadingTextGroup>
                            <ReadingTitle numberOfLines={2}>{book.title}</ReadingTitle>
                            <ReadingAuthor numberOfLines={1}>
                              {book.author}
                            </ReadingAuthor>
                          </ReadingTextGroup>

                          <ReadingMeta>
                            Page {current || 0} of {total || "—"}
                          </ReadingMeta>
                        </ReadingInfo>

                        <BookDonutWrap>
                          <DonutBase>
                            <DonutArc
                              style={{
                                transform: [{ rotate: `${percent * 3.6}deg` }],
                              }}
                            />
                            <DonutInner>
                              <DonutText>{percent}%</DonutText>
                            </DonutInner>
                          </DonutBase>
                        </BookDonutWrap>
                      </ReadingMainRow>

                      <ProgressTrack>
                        <ProgressFill style={{ width: `${percent}%` }} />
                      </ProgressTrack>
                    </ReadingCard>
                  );
                })}
              </Carousel>

              {currentlyReading.length > 1 ? (
                <DotsRow>
                  {currentlyReading.map((book, index) => (
                    <Dot key={book.id} active={index === activeReadingIndex} />
                  ))}
                </DotsRow>
              ) : null}
            </>
          ) : (
            <EmptyCard>
              <EmptyTitle>No books in progress</EmptyTitle>
              <EmptyText>Start reading a book to see it here.</EmptyText>
            </EmptyCard>
          )}

          <SectionHeaderWithAction>
            <SectionTitle>My Reading Lists</SectionTitle>
            <ViewAllButton onPress={() => router.push("/lists")}>
              <ViewAllText>View all</ViewAllText>
            </ViewAllButton>
          </SectionHeaderWithAction>

          {enrichedLists.length > 0 ? (
            <ListPreviewWrap>
              {enrichedLists.map((list) => (
                <ListPreviewCard
                  key={list.id}
                  onPress={() => router.push(`/list/${list.id}`)}
                >
                  <ListPreviewText>
                    <ListPreviewTitle numberOfLines={1}>
                      {list.title}
                    </ListPreviewTitle>
                    <ListPreviewMeta>{list.subtitle}</ListPreviewMeta>
                  </ListPreviewText>

                  <ListPreviewCovers>
                    {list.covers.length > 0 ? (
                      list.covers.map((cover, index) => (
                        <TinyCover
                          key={`${list.id}-${index}`}
                          source={{ uri: cover }}
                        />
                      ))
                    ) : (
                      <TinyEmpty>
                        <Ionicons
                          name="book-outline"
                          size={18}
                          color={theme.colors.mutedForeground}
                        />
                      </TinyEmpty>
                    )}
                  </ListPreviewCovers>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.colors.mutedForeground}
                  />
                </ListPreviewCard>
              ))}
            </ListPreviewWrap>
          ) : (
            <EmptyCard>
              <EmptyTitle>No lists yet</EmptyTitle>
              <EmptyText>Create your first reading list to see it here.</EmptyText>
            </EmptyCard>
          )}

          <SectionHeader>
            <SectionTitle>Your Library</SectionTitle>
          </SectionHeader>

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
            {libraryBooks.map((book) => {
              const mappedBook = mapBook(book);

              return (
                <BookCard
                  key={book.id}
                  style={{ width: libraryCardWidth }}
                  onPress={() => router.push(`/book/${book.id}`)}
                  onLongPress={() => openBookActions(mappedBook)}
                  book={mappedBook}
                />
              );
            })}
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
              setTimeout(() => setListPickerOpen(true), 180);
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

      <Modal visible={rankOpen} transparent animationType="fade">
        <ModalOverlay>
          <RankModalCard>
            <ModalHeader>
              <ModalTitle>Reading Ranks</ModalTitle>
              <CloseButton onPress={() => setRankOpen(false)}>
                <Ionicons
                  name="close"
                  size={18}
                  color={theme.colors.mutedForeground}
                />
              </CloseButton>
            </ModalHeader>

            <ModalSub>Finish books to unlock new reader ranks.</ModalSub>

            <RankTimeline>
              {RANKS.map((rank, index) => {
                const unlocked = doneBooks.length >= rank.minBooks;
                const isLast = index === RANKS.length - 1;
                const nextUnlocked = !isLast
                  ? doneBooks.length >= RANKS[index + 1].minBooks
                  : false;

                return (
                  <TimelineItem key={rank.title} unlocked={unlocked}>
                    <TimelineTrack>
                      <TimelineDot unlocked={unlocked}>
                        <TimelineIcon>{rank.icon}</TimelineIcon>
                      </TimelineDot>

                      {!isLast ? <TimelineLine unlocked={nextUnlocked} /> : null}
                    </TimelineTrack>

                    <TimelineContent>
                      <TimelineTitle>{rank.title}</TimelineTitle>
                      <TimelineMeta>{rank.minBooks}+ books read</TimelineMeta>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </RankTimeline>
          </RankModalCard>
        </ModalOverlay>
      </Modal>
    </Screen>
  );
}

/* styles */

const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
`;

const LoadingWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const LoadingText = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const Content = styled.View`
  width: 100%;
  max-width: 1000px;
  align-self: center;
`;

const HeroBlock = styled.View`
  padding: 14px 18px 10px 18px;
  gap: 12px;
`;

const WelcomeWrap = styled.View`
  gap: 2px;
`;

const WelcomeKicker = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const WelcomeText = styled.Text`
  font-size: 34px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
  letter-spacing: -0.7px;
`;

const RankCardButton = styled.Pressable`
  min-height: 58px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.xl}px;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const RankIconBubble = styled.View`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.muted};
`;

const RankIcon = styled.Text`
  font-size: 24px;
`;

const RankCopy = styled.View`
  flex: 1;
`;

const RankTitle = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const RankSub = styled.Text`
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const StatsPanel = styled.View`
  margin: 4px 18px 10px 18px;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.xl}px;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  flex-direction: row;
  align-items: center;
`;

const StatBox = styled.View`
  flex: 1;
  align-items: center;
  gap: 4px;
`;

const StatIconBubble = styled.View`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.muted};
  margin-bottom: 2px;
`;

const StatNumber = styled.Text`
  font-size: 24px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
  text-align: center;
`;

const StatDivider = styled.View`
  width: 1px;
  height: 50px;
  background: ${({ theme }) => theme.colors.border};
`;

const SectionHeader = styled.View`
  padding: 18px 18px 12px 18px;
`;

const SectionHeaderWithAction = styled.View`
  padding: 22px 18px 12px 18px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.Text`
  font-size: 24px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
  letter-spacing: -0.3px;
`;

const ViewAllButton = styled.Pressable`
  padding: 8px 0 8px 12px;
`;

const ViewAllText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const Carousel = styled.ScrollView``;

const ReadingCard = styled.Pressable`
  min-height: 220px;
  border-radius: ${({ theme }) => theme.radius.xl}px;
  overflow: hidden;
  padding: 18px 18px 28px 18px;
  background: ${({ theme }) => theme.colors.readingCard};
  justify-content: center;
`;

const ReadingMainRow = styled.View`
  flex-direction: row;
  align-items: stretch;
  gap: 16px;
`;

const ReadingCover = styled.Image`
  width: 108px;
  height: 168px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.readingCardMutedForeground};
`;

const ReadingInfo = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: 16px 0 10px 0;
`;

const ReadingTextGroup = styled.View`
  gap: 2px;
`;

const ReadingTitle = styled.Text`
  color: ${({ theme }) => theme.colors.readingCardForeground};
  font-size: 18px;
  line-height: 23px;
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const ReadingAuthor = styled.Text`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.readingCardMutedForeground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const ReadingMeta = styled.Text`
  color: ${({ theme }) => theme.colors.readingCardMutedForeground};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const BookDonutWrap = styled.View`
  width: 64px;
  height: 64px;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  margin-bottom: 18px;
`;

const DonutBase = styled.View`
  width: 58px;
  height: 58px;
  border-radius: 29px;
  border-width: 5px;
  border-color: ${({ theme }) => theme.colors.readingCardMutedForeground};
  align-items: center;
  justify-content: center;
  position: relative;
`;

const DonutArc = styled.View`
  position: absolute;
  width: 58px;
  height: 58px;
  border-radius: 29px;
  border-width: 5px;
  border-left-color: transparent;
  border-bottom-color: transparent;
  border-top-color: ${({ theme }) => theme.colors.readingCardForeground};
  border-right-color: ${({ theme }) => theme.colors.readingCardForeground};
`;

const DonutInner = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.readingCard};
  align-items: center;
  justify-content: center;
`;

const DonutText = styled.Text`
  color: ${({ theme }) => theme.colors.readingCardForeground};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const ProgressTrack = styled.View`
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 14px;
  height: 7px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.readingCardMutedForeground};
  overflow: hidden;
  opacity: 0.5;
`;

const ProgressFill = styled.View`
  height: 100%;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.readingCardForeground};
`;

const DotsRow = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 6px;
  padding-top: 12px;
`;

const Dot = styled.View<{ active: boolean }>`
  width: ${({ active }) => (active ? 18 : 6)}px;
  height: 6px;
  border-radius: 999px;
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.border};
`;

const ListPreviewWrap = styled.View`
  padding: 0 18px;
  gap: 10px;
`;

const ListPreviewCard = styled.Pressable`
  min-height: 74px;
  border-radius: ${({ theme }) => theme.radius.xl}px;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 12px 14px;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const ListPreviewText = styled.View`
  flex: 1;
`;

const ListPreviewTitle = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const ListPreviewMeta = styled.Text`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const ListPreviewCovers = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TinyCover = styled.Image`
  width: 34px;
  height: 50px;
  border-radius: 6px;
  margin-left: -8px;
  background: ${({ theme }) => theme.colors.muted};
`;

const TinyEmpty = styled.View`
  width: 42px;
  height: 50px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.muted};
`;

const EmptyCard = styled.View`
  margin: 0 18px;
  padding: 18px;
  border-radius: ${({ theme }) => theme.radius.xl}px;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const EmptyTitle = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 17px;
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const EmptyText = styled.Text`
  margin-top: 5px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 14px;
  line-height: 20px;
  font-weight: ${({ theme }) => theme.font.family.medium};
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

const ModalOverlay = styled.View`
  flex: 1;
  background: rgba(0, 0, 0, 0.35);
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const RankModalCard = styled.View`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 20px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 22px;
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const CloseButton = styled.Pressable`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.muted};
`;

const ModalSub = styled.Text`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 14px;
  line-height: 20px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const RankTimeline = styled.View`
  margin-top: 18px;
`;

const TimelineItem = styled.View<{ unlocked: boolean }>`
  min-height: 72px;
  flex-direction: row;
  opacity: ${({ unlocked }) => (unlocked ? 1 : 0.45)};
`;

const TimelineTrack = styled.View`
  width: 42px;
  align-items: center;
`;

const TimelineDot = styled.View<{ unlocked: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  align-items: center;
  justify-content: center;
  background: ${({ theme, unlocked }) =>
    unlocked ? theme.colors.readingCard : theme.colors.muted};
`;

const TimelineIcon = styled.Text`
  font-size: 17px;
`;

const TimelineLine = styled.View<{ unlocked: boolean }>`
  flex: 1;
  width: 2px;
  margin-top: 6px;
  background: ${({ theme, unlocked }) =>
    unlocked ? theme.colors.readingCard : theme.colors.border};
`;

const TimelineContent = styled.View`
  flex: 1;
  padding-left: 10px;
  padding-bottom: 18px;
`;

const TimelineTitle = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const TimelineMeta = styled.Text`
  margin-top: 3px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;