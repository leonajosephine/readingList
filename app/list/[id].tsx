import React, { useMemo, useState } from "react";
import { Alert, Modal, ScrollView, Share, useWindowDimensions } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useLibrary } from "../../src/store/LibraryContext";
import { BookCard, BookCardBook } from "../../src/components/BookCard";
import { BookActionsSheet } from "../../src/components/BookActionsSheet";
import { BookListPickerModal } from "../../src/components/BookListPickerModal";

export default function ListDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    lists,
    books,
    addBookToList,
    removeBookFromList,
    updateBookStatus,
    renameList,
  } = useLibrary();

  const [addBooksOpen, setAddBooksOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookCardBook | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [listPickerOpen, setListPickerOpen] = useState(false);

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const list = lists.find((item) => item.id === id);

  const listBooks = useMemo(() => {
    if (!list) return [];

    return list.bookIds
      .map((bookId) => books.find((book) => book.id === bookId))
      .filter(Boolean);
  }, [list, books]);

  const selectableBooks = useMemo(() => {
    if (!list) return [];

    const q = searchQuery.trim().toLowerCase();

    return books
      .filter((book) => {
        if (!q) return true;

        return (
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q)
        );
      })
      .map((book) => ({
        ...book,
        selected: list.bookIds.includes(book.id),
      }));
  }, [books, list, searchQuery]);

  const contentMaxWidth = 1000;
  const contentWidth = Math.min(width, contentMaxWidth);

  const horizontalPadding = 18 * 2;
  const gap = 12;

  const isTablet = width >= 768;
  const isDesktop = width >= 1100;

  const columns = isDesktop ? 4 : isTablet ? 3 : 2;

  const cardWidth =
    (contentWidth - horizontalPadding - gap * (columns - 1)) / columns;

  const closeAddBooksModal = () => {
    setAddBooksOpen(false);
    setSearchQuery("");
  };

  const closeRenameModal = () => {
    setRenameOpen(false);
    setRenameValue("");
  };

  const onToggleBookInList = (bookId: string, selected: boolean) => {
    if (!list) return;

    if (selected) {
      removeBookFromList(bookId, list.id);
    } else {
      addBookToList(bookId, list.id);
    }
  };

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

  const openRenameModal = () => {
    if (!list) return;
    setRenameValue(list.title);
    setRenameOpen(true);
  };

  const onSaveRename = () => {
    if (!list) return;

    const trimmed = renameValue.trim();

    if (!trimmed) {
      Alert.alert("Missing title", "Please enter a name for your list.");
      return;
    }

    renameList(list.id, trimmed);
    closeRenameModal();
  };

  const onShareList = async () => {
    if (!list) return;

    const shareLines = [
      "My Reading List:",
      list.title,
      "",
      ...listBooks
        .map((book, index) => {
          if (!book) return null;
          return `${index + 1}. ${book.title} — ${book.author}`;
        })
        .filter(Boolean),
      "",
      "Shared from my ReadingApp ✨",
    ];

    try {
      await Share.share({
        message: shareLines.join("\n"),
        title: list.title,
      });
    } catch (error) {
      Alert.alert(
        "Share failed",
        "Something went wrong while trying to share this list."
      );
    }
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
            <TitleRow>
              <Title>{list.title}</Title>

              <EditTitleButton onPress={openRenameModal}>
                <Ionicons
                  name="pencil-outline"
                  size={18}
                  color={theme.colors.foreground}
                />
              </EditTitleButton>
            </TitleRow>

            <Subtitle>
              {list.bookIds.length} book{list.bookIds.length === 1 ? "" : "s"} in
              this list
            </Subtitle>
          </HeaderBlock>

          <TopActions>
            <PrimaryAction onPress={() => setAddBooksOpen(true)}>
              <PrimaryActionText>Add Books</PrimaryActionText>
            </PrimaryAction>

            <SecondaryAction onPress={onShareList}>
              <SecondaryActionText>Share</SecondaryActionText>
            </SecondaryAction>
          </TopActions>

          {listBooks.length > 0 ? (
            <Grid>
              {listBooks.map((book) => {
                if (!book) return null;

                const mappedBook: BookCardBook = {
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  rating: book.rating ?? "0.0",
                  coverUrl: book.coverUrl,
                  status: book.status,
                };

                return (
                  <BookCardWrap key={book.id}>
                    <BookCard
                      style={{ width: cardWidth }}
                      onPress={() => router.push(`/book/${book.id}`)}
                      onLongPress={() => openBookActions(mappedBook)}
                      book={mappedBook}
                    />
                  </BookCardWrap>
                );
              })}
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

      <Modal
        visible={addBooksOpen}
        transparent
        animationType="fade"
        onRequestClose={closeAddBooksModal}
      >
        <ModalOverlay>
          <SelectModalCard>
            <ModalHeaderRow>
              <ModalTitle>Add Books</ModalTitle>

              <CloseButton onPress={closeAddBooksModal}>
                <Ionicons name="close" size={18} color={theme.colors.foreground} />
              </CloseButton>
            </ModalHeaderRow>

            <ModalSubtitle>Add or remove books from this list</ModalSubtitle>

            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search books..."
              placeholderTextColor="rgba(113, 113, 130, 0.9)"
            />

            <SelectableList>
              {selectableBooks.map((book) => (
                <SelectableRow
                  key={book.id}
                  onPress={() => onToggleBookInList(book.id, book.selected)}
                >
                  <RowLeft>
                    <MiniCoverSmall source={{ uri: book.coverUrl }} />
                    <SelectableInfo>
                      <SelectableTitle numberOfLines={1}>
                        {book.title}
                      </SelectableTitle>
                      <SelectableMeta numberOfLines={1}>
                        {book.author}
                      </SelectableMeta>
                    </SelectableInfo>
                  </RowLeft>

                  <Checkbox active={book.selected}>
                    {book.selected ? (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={theme.colors.primaryForeground}
                      />
                    ) : null}
                  </Checkbox>
                </SelectableRow>
              ))}
            </SelectableList>

            <DoneButton onPress={closeAddBooksModal}>
              <DoneButtonText>Done</DoneButtonText>
            </DoneButton>
          </SelectModalCard>
        </ModalOverlay>
      </Modal>

      <Modal
        visible={renameOpen}
        transparent
        animationType="fade"
        onRequestClose={closeRenameModal}
      >
        <ModalOverlay>
          <RenameModalCard>
            <ModalHeaderRow>
              <ModalTitle>Rename List</ModalTitle>

              <CloseButton onPress={closeRenameModal}>
                <Ionicons name="close" size={18} color={theme.colors.foreground} />
              </CloseButton>
            </ModalHeaderRow>

            <ModalSubtitle>Choose a new name for this list</ModalSubtitle>

            <RenameInput
              value={renameValue}
              onChangeText={setRenameValue}
              placeholder="List name"
              placeholderTextColor="rgba(113, 113, 130, 0.9)"
              autoFocus
              maxLength={60}
            />

            <RenameActions>
              <RenameSecondaryButton onPress={closeRenameModal}>
                <RenameSecondaryButtonText>Cancel</RenameSecondaryButtonText>
              </RenameSecondaryButton>

              <RenamePrimaryButton onPress={onSaveRename}>
                <RenamePrimaryButtonText>Save</RenamePrimaryButtonText>
              </RenamePrimaryButton>
            </RenameActions>
          </RenameModalCard>
        </ModalOverlay>
      </Modal>

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
        onRemoveFromList={() => {
          if (!selectedBook || !list) return;

          Alert.alert(
            `Remove "${selectedBook.title}"?`,
            "This book will be removed from the list.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Remove",
                style: "destructive",
                onPress: () => {
                  removeBookFromList(selectedBook.id, list.id);
                  closeAllBookMenus();
                },
              },
            ]
          );
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

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const EditTitleButton = styled.Pressable`
  width: 38px;
  height: 38px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const RenameModalCard = styled.View`
  width: 100%;
  max-width: 460px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 20px;
`;

const RenameInput = styled.TextInput`
  margin-top: 18px;
  height: 50px;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  padding: 0 14px;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  font-family: ${({ theme }) => theme.font.family.medium};
`;

const RenameActions = styled.View`
  margin-top: 18px;
  flex-direction: row;
  gap: 10px;
`;

const RenameSecondaryButton = styled.Pressable`
  flex: 1;
  height: 46px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.muted};
`;

const RenameSecondaryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const RenamePrimaryButton = styled.Pressable`
  flex: 1;
  height: 46px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
`;

const RenamePrimaryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
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

const ModalOverlay = styled.View`
  flex: 1;
  background: rgba(0, 0, 0, 0.35);
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const SelectModalCard = styled.View`
  width: 100%;
  max-width: 460px;
  max-height: 80%;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 20px;
`;

const ModalHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const ModalSubtitle = styled.Text`
  margin-top: 6px;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const SearchInput = styled.TextInput`
  margin-top: 14px;
  height: 46px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  padding: 0 14px;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  font-family: ${({ theme }) => theme.font.family.medium};
`;

const CloseButton = styled.Pressable`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.muted};
`;

const SelectableList = styled.ScrollView`
  margin-top: 18px;
`;

const SelectableRow = styled.Pressable`
  min-height: 60px;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  padding: 12px 14px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const RowLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const MiniCoverSmall = styled.Image`
  width: 40px;
  height: 60px;
  border-radius: 6px;
`;

const SelectableInfo = styled.View`
  flex: 1;
`;

const SelectableTitle = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const SelectableMeta = styled.Text`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const Checkbox = styled.View<{ active: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  border-width: 1.5px;
  border-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.border};
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : "transparent"};
`;

const DoneButton = styled.Pressable`
  margin-top: 8px;
  height: 46px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
`;

const DoneButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;