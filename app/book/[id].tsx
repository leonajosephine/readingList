import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Share,
  useWindowDimensions,
} from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { BookListPickerModal } from "../../src/components/BookListPickerModal";
import {
  BookNote,
  BookRatingCategory,
  BookRatings,
  useLibrary,
} from "../../src/store/LibraryContext";

const RATING_CONFIG: {
  key: BookRatingCategory;
  label: string;
  activeIcon: string;
  inactiveIcon: string;
}[] = [
  { key: "overall", label: "Overall", activeIcon: "⭐️", inactiveIcon: "☆" },
  { key: "spice", label: "Spice", activeIcon: "🔥", inactiveIcon: "○" },
  { key: "tension", label: "Tension", activeIcon: "⚡", inactiveIcon: "○" },
  { key: "humor", label: "Humor", activeIcon: "😊", inactiveIcon: "○" },
  { key: "romance", label: "Romance", activeIcon: "❤️", inactiveIcon: "○" },
  { key: "tears", label: "Tears", activeIcon: "💧", inactiveIcon: "○" },
];

export default function BookDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    books,
    updateBookRatings,
    updateBookNote,
    deleteBookNote,
    addBookNote,
    updateBookProgress,
  } = useLibrary();

  const theme = useTheme();
  const { width } = useWindowDimensions();

  const book = books.find((item) => item.id === id);

  const [listModalOpen, setListModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [draftRatings, setDraftRatings] = useState<BookRatings>({});

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteType, setNoteType] = useState<"note" | "quote">("note");
  const [noteContent, setNoteContent] = useState("");
  const [quotePage, setQuotePage] = useState("");
  const [quoteChapter, setQuoteChapter] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [draftCurrentPage, setDraftCurrentPage] = useState("");
  const [draftTotalPages, setDraftTotalPages] = useState("");

  const isTablet = width >= 768;
  const coverWidth = isTablet ? 280 : Math.min(width * 0.52, 220);

  useEffect(() => {
    if (!book) return;
    setDraftRatings(book.userRatings ?? {});
  }, [book, ratingModalOpen]);

  useEffect(() => {
    if (!book) return;
    setDraftCurrentPage(
      book.currentPage !== undefined ? String(book.currentPage) : ""
    );
    setDraftTotalPages(
      book.totalPages !== undefined ? String(book.totalPages) : ""
    );
  }, [book, progressModalOpen]);

  const activeRatings = useMemo(() => {
    if (!book?.userRatings) return [];

    return RATING_CONFIG.filter((item) => {
      const value = book.userRatings?.[item.key] ?? 0;
      return value > 0;
    });
  }, [book?.userRatings]);

  if (!book) {
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
          <EmptyTitle>Book not found</EmptyTitle>
          <EmptyText>This book could not be loaded.</EmptyText>
        </Centered>
      </Screen>
    );
  }

  const notesCount = book.notes?.length ?? 0;

  const statusLabel =
    book.status === "reading"
      ? "Currently Reading"
      : book.status === "done"
        ? "Completed"
        : "To Read";

  const totalPages = book.totalPages ?? 384;
  const currentPage =
    book.status === "done"
      ? totalPages
      : Math.min(book.currentPage ?? 0, totalPages);

  const progressPercentage =
    totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  const openRatingModal = () => {
    setDraftRatings(book.userRatings ?? {});
    setRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
  };

  const openProgressModal = () => {
    setDraftCurrentPage(
      book.currentPage !== undefined ? String(book.currentPage) : ""
    );
    setDraftTotalPages(
      book.totalPages !== undefined ? String(book.totalPages) : ""
    );
    setProgressModalOpen(true);
  };

  const closeProgressModal = () => {
    setProgressModalOpen(false);
    setDraftCurrentPage("");
    setDraftTotalPages("");
  };

  const onSaveProgress = () => {
    const parsedTotal = Number(draftTotalPages);
    const parsedCurrent = Number(draftCurrentPage);

    if (!draftTotalPages.trim() || Number.isNaN(parsedTotal) || parsedTotal <= 0) {
      Alert.alert(
        "Invalid total pages",
        "Please enter a valid total page count greater than 0."
      );
      return;
    }

    if (Number.isNaN(parsedCurrent) || parsedCurrent < 0) {
      Alert.alert(
        "Invalid current page",
        "Please enter a valid current page number."
      );
      return;
    }

    const safeCurrent = Math.min(parsedCurrent, parsedTotal);

    updateBookProgress(book.id, {
      currentPage: safeCurrent,
      totalPages: parsedTotal,
    });

    closeProgressModal();
  };

  const openNoteModal = (type: "note" | "quote") => {
    setEditingNoteId(null);
    setNoteType(type);
    setNoteContent("");
    setQuotePage("");
    setQuoteChapter("");
    setNoteModalOpen(true);
  };

  const openEditNoteModal = (note: BookNote) => {
    setEditingNoteId(note.id);
    setNoteType(note.type);
    setNoteContent(note.content);

    if (note.type === "quote") {
      setQuotePage(note.page ?? "");
      setQuoteChapter(note.chapter ?? "");
    } else {
      setQuotePage("");
      setQuoteChapter("");
    }

    setNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setNoteModalOpen(false);
    setEditingNoteId(null);
    setNoteContent("");
    setQuotePage("");
    setQuoteChapter("");
  };

  const onSaveNote = () => {
    const trimmedContent = noteContent.trim();

    if (!trimmedContent) {
      Alert.alert("Missing content", "Please enter some text first.");
      return;
    }

    if (editingNoteId) {
      if (noteType === "quote") {
        updateBookNote(book.id, editingNoteId, {
          content: trimmedContent,
          page: quotePage.trim() || undefined,
          chapter: quoteChapter.trim() || undefined,
        });
      } else {
        updateBookNote(book.id, editingNoteId, {
          content: trimmedContent,
        });
      }
    } else {
      if (noteType === "note") {
        addBookNote(book.id, {
          type: "note",
          content: trimmedContent,
        });
      } else {
        addBookNote(book.id, {
          type: "quote",
          content: trimmedContent,
          page: quotePage.trim() || undefined,
          chapter: quoteChapter.trim() || undefined,
        });
      }
    }

    closeNoteModal();
  };

  const onDeleteNote = (note: BookNote) => {
    Alert.alert(
      note.type === "quote" ? "Delete quote?" : "Delete note?",
      "This entry will be removed from the book.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteBookNote(book.id, note.id),
        },
      ]
    );
  };

  const setCategoryValue = (category: BookRatingCategory, value: number) => {
    setDraftRatings((prev) => ({
      ...prev,
      [category]: value === 0 ? undefined : value,
    }));
  };

  const onSaveRatings = () => {
    updateBookRatings(book.id, draftRatings);
    closeRatingModal();
  };

  const onShareBook = async () => {
    const ratingLines = activeRatings.map((item) => {
      const value = book.userRatings?.[item.key] ?? 0;
      const icons = Array.from({ length: value })
        .map(() => item.activeIcon)
        .join("");
      return `${item.label}: ${icons || "—"}`;
    });

    const favoriteQuote = book.notes?.find((note) => note.type === "quote");
    const favoriteNote = book.notes?.find((note) => note.type === "note");

    const shareLines = [
      "📖 Book Recommendation",
      "",
      `${book.title} — ${book.author}`,
      "",
      `Genre: ${book.genre ?? "—"}`,
      `Community Rating: ${book.rating ?? "—"}`,
      `Progress: ${currentPage}/${totalPages}`,
      "",
      "My Rating:",
      ...(ratingLines.length > 0 ? ratingLines : ["No personal ratings yet"]),
      "",
      favoriteQuote
        ? `Favorite Quote:\n“${favoriteQuote.content}”`
        : favoriteNote
          ? `My Note:\n${favoriteNote.content}`
          : "No notes yet",
      "",
      "Shared from my Reading App ✨",
    ];

    try {
      await Share.share({
        title: book.title,
        message: shareLines.join("\n"),
      });
    } catch (error) {
      Alert.alert(
        "Share failed",
        "Something went wrong while trying to share this book."
      );
    }
  };

  const renderStaticRatingIcons = (
    activeIcon: string,
    inactiveIcon: string,
    value: number
  ) => {
    return Array.from({ length: 5 }).map((_, index) => {
      const filled = index < value;

      return (
        <RatingEmoji key={`${activeIcon}-${index}`} inactive={!filled}>
          {filled ? activeIcon : inactiveIcon}
        </RatingEmoji>
      );
    });
  };

  const renderEditableRatingIcons = (
    category: BookRatingCategory,
    activeIcon: string,
    inactiveIcon: string,
    value: number
  ) => {
    return (
      <EditableIconsRow>
        <ClearRatingButton onPress={() => setCategoryValue(category, 0)}>
          <ClearRatingText>Clear</ClearRatingText>
        </ClearRatingButton>

        {Array.from({ length: 5 }).map((_, index) => {
          const nextValue = index + 1;
          const filled = index < value;

          return (
            <EditableEmojiButton
              key={`${category}-${nextValue}`}
              onPress={() => setCategoryValue(category, nextValue)}
            >
              <EditableEmoji inactive={!filled}>
                {filled ? activeIcon : inactiveIcon}
              </EditableEmoji>
            </EditableEmojiButton>
          );
        })}
      </EditableIconsRow>
    );
  };

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

      <ScrollView contentContainerStyle={{ paddingTop: 82, paddingBottom: 118 }}>
        <Content>
          <Hero>
            <Cover
              source={{ uri: book.coverUrl }}
              resizeMode="cover"
              style={{ width: coverWidth }}
            />

            <Info>
              <Title>{book.title}</Title>
              <Author>{book.author}</Author>

              <MetaRow>
                <MetaBadge>
                  <MetaBadgeText>{statusLabel}</MetaBadgeText>
                </MetaBadge>

                {!!book.genre && (
                  <MetaBadge secondary>
                    <MetaBadgeText secondary>{book.genre}</MetaBadgeText>
                  </MetaBadge>
                )}
              </MetaRow>

              <RatingRow>
                <Star>★</Star>
                <Rating>{book.rating ?? "0.0"}</Rating>
              </RatingRow>

              <HeroActionsRow>
                <HeroGhostButton onPress={onShareBook}>
                  <Ionicons
                    name="share-outline"
                    size={16}
                    color={theme.colors.foreground}
                  />
                  <HeroGhostButtonText>Share</HeroGhostButtonText>
                </HeroGhostButton>
              </HeroActionsRow>
            </Info>
          </Hero>

          <Section>
            <SectionTitle>About this book</SectionTitle>
            <BodyText>
              A full description will be added later. For now, this is the
              perfect place for a short summary, themes, mood, and why the book
              is worth reading.
            </BodyText>
          </Section>

          <StatsCard>
            <MiniStatButton onPress={openProgressModal}>
              <MiniStatLabel>Your Progress</MiniStatLabel>
              <MiniStatValue>
                {currentPage}/{totalPages}
              </MiniStatValue>
              <MiniStatHelper>{progressPercentage}%</MiniStatHelper>
            </MiniStatButton>

            <MiniDivider />

            <MiniStat>
              <MiniStatLabel>Your Rating</MiniStatLabel>
              <MiniStatValue>
                {book.userRatings?.overall ? `${book.userRatings.overall}/5` : "—"}
              </MiniStatValue>
            </MiniStat>

            <MiniDivider />

            <MiniStat>
              <MiniStatLabel>Notes</MiniStatLabel>
              <MiniStatValue>{notesCount}</MiniStatValue>
            </MiniStat>
          </StatsCard>

          <ProgressCard>
            <ProgressHeaderRow>
              <ProgressTitle>Reading Progress</ProgressTitle>
              <ProgressEditButton onPress={openProgressModal}>
                <ProgressEditButtonText>Edit</ProgressEditButtonText>
              </ProgressEditButton>
            </ProgressHeaderRow>

            <ProgressBarTrack>
              <ProgressBarFill style={{ width: `${progressPercentage}%` }} />
            </ProgressBarTrack>

            <ProgressMeta>
              {currentPage} of {totalPages} pages
            </ProgressMeta>
          </ProgressCard>

          <Section>
            <SectionHeaderRow>
              <SectionTitle>My Rating</SectionTitle>

              <SectionActionButton onPress={openRatingModal}>
                <SectionActionButtonText>
                  {activeRatings.length > 0 ? "Edit Rating" : "Add Rating"}
                </SectionActionButtonText>
              </SectionActionButton>
            </SectionHeaderRow>

            <RatingCard>
              {activeRatings.length > 0 ? (
                activeRatings.map((item) => {
                  const value = book.userRatings?.[item.key] ?? 0;

                  return (
                    <RatingItem key={item.key}>
                      <RatingItemLabel>{item.label}</RatingItemLabel>

                      <RatingIconsRow>
                        {renderStaticRatingIcons(
                          item.activeIcon,
                          item.inactiveIcon,
                          value
                        )}
                      </RatingIconsRow>
                    </RatingItem>
                  );
                })
              ) : (
                <EmptyRatingWrap>
                  <EmptyRatingTitle>No personal ratings yet</EmptyRatingTitle>
                  <EmptyRatingText>
                    Add your own rating categories like spice, tension, humor,
                    romance, or tears.
                  </EmptyRatingText>
                </EmptyRatingWrap>
              )}
            </RatingCard>
          </Section>

          <Section>
            <SectionHeaderRow>
              <SectionTitle>Notes</SectionTitle>

              <HeaderActionsRow>
                <SmallGhostButton onPress={() => openNoteModal("note")}>
                  <SmallGhostButtonText>Add Note</SmallGhostButtonText>
                </SmallGhostButton>

                <SmallGhostButton onPress={() => openNoteModal("quote")}>
                  <SmallGhostButtonText>Add Quote</SmallGhostButtonText>
                </SmallGhostButton>
              </HeaderActionsRow>
            </SectionHeaderRow>

            <NotesWrap>
              {book.notes && book.notes.length > 0 ? (
                book.notes.map((note) =>
                  note.type === "quote" ? (
                    <QuoteCard key={note.id}>
                      <QuoteTopRow>
                        <QuoteBadge>
                          <QuoteBadgeText>Quote</QuoteBadgeText>
                        </QuoteBadge>

                        <InlineActionsRow>
                          <InlineIconButton onPress={() => openEditNoteModal(note)}>
                            <Ionicons
                              name="pencil-outline"
                              size={16}
                              color={theme.colors.mutedForeground}
                            />
                          </InlineIconButton>

                          <InlineIconButton onPress={() => onDeleteNote(note)}>
                            <Ionicons
                              name="trash-outline"
                              size={16}
                              color={theme.colors.mutedForeground}
                            />
                          </InlineIconButton>
                        </InlineActionsRow>
                      </QuoteTopRow>

                      <QuoteText>“{note.content}”</QuoteText>

                      {(note.page || note.chapter) && (
                        <QuoteMetaRow>
                          {note.page ? (
                            <QuoteMetaText>Page {note.page}</QuoteMetaText>
                          ) : null}
                          {note.page && note.chapter ? (
                            <QuoteMetaDot>·</QuoteMetaDot>
                          ) : null}
                          {note.chapter ? (
                            <QuoteMetaText>Chapter {note.chapter}</QuoteMetaText>
                          ) : null}
                        </QuoteMetaRow>
                      )}
                    </QuoteCard>
                  ) : (
                    <NoteCard key={note.id}>
                      <NoteTopRow>
                        <NoteBadge>
                          <NoteBadgeText>Note</NoteBadgeText>
                        </NoteBadge>

                        <InlineActionsRow>
                          <InlineIconButton onPress={() => openEditNoteModal(note)}>
                            <Ionicons
                              name="pencil-outline"
                              size={16}
                              color={theme.colors.mutedForeground}
                            />
                          </InlineIconButton>

                          <InlineIconButton onPress={() => onDeleteNote(note)}>
                            <Ionicons
                              name="trash-outline"
                              size={16}
                              color={theme.colors.mutedForeground}
                            />
                          </InlineIconButton>
                        </InlineActionsRow>
                      </NoteTopRow>

                      <NoteText>{note.content}</NoteText>
                    </NoteCard>
                  )
                )
              ) : (
                <EmptyRatingWrap>
                  <EmptyRatingTitle>No notes yet</EmptyRatingTitle>
                  <EmptyRatingText>
                    Save your thoughts, favorite quotes, pages, and chapter
                    moments here.
                  </EmptyRatingText>
                </EmptyRatingWrap>
              )}
            </NotesWrap>
          </Section>
        </Content>
      </ScrollView>

      <StickyBottomBar>
        <BottomActions>
          <PrimaryButton onPress={() => setListModalOpen(true)}>
            <PrimaryButtonText>Add to List</PrimaryButtonText>
          </PrimaryButton>

          <SecondaryButton onPress={() => openNoteModal("note")}>
            <SecondaryButtonText>Add Note</SecondaryButtonText>
          </SecondaryButton>
        </BottomActions>
      </StickyBottomBar>

      <BookListPickerModal
        visible={listModalOpen}
        bookId={book.id}
        onClose={() => setListModalOpen(false)}
      />

      <Modal
        visible={progressModalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeProgressModal}
      >
        <ModalOverlay>
          <ProgressModalCard>
            <ModalHeaderRow>
              <ModalTitle>Update Progress</ModalTitle>

              <CloseButton onPress={closeProgressModal}>
                <Ionicons name="close" size={18} color={theme.colors.foreground} />
              </CloseButton>
            </ModalHeaderRow>

            <ModalSubtitle>
              Set how far you are in this book.
            </ModalSubtitle>

            <ProgressFieldsRow>
              <SmallInputWrap>
                <SmallInputLabel>Current Page</SmallInputLabel>
                <SmallInput
                  value={draftCurrentPage}
                  onChangeText={setDraftCurrentPage}
                  placeholder="e.g. 120"
                  placeholderTextColor="rgba(113, 113, 130, 0.9)"
                  keyboardType="number-pad"
                />
              </SmallInputWrap>

              <SmallInputWrap>
                <SmallInputLabel>Total Pages</SmallInputLabel>
                <SmallInput
                  value={draftTotalPages}
                  onChangeText={setDraftTotalPages}
                  placeholder="e.g. 384"
                  placeholderTextColor="rgba(113, 113, 130, 0.9)"
                  keyboardType="number-pad"
                />
              </SmallInputWrap>
            </ProgressFieldsRow>

            <ModalFooterRow>
              <SecondaryModalButton onPress={closeProgressModal}>
                <SecondaryModalButtonText>Cancel</SecondaryModalButtonText>
              </SecondaryModalButton>

              <PrimaryModalButton onPress={onSaveProgress}>
                <PrimaryModalButtonText>Save</PrimaryModalButtonText>
              </PrimaryModalButton>
            </ModalFooterRow>
          </ProgressModalCard>
        </ModalOverlay>
      </Modal>

      <Modal
        visible={ratingModalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeRatingModal}
      >
        <ModalOverlay>
          <RatingModalCard>
            <ModalHeaderRow>
              <ModalTitle>Edit Rating</ModalTitle>

              <CloseButton onPress={closeRatingModal}>
                <Ionicons name="close" size={18} color={theme.colors.foreground} />
              </CloseButton>
            </ModalHeaderRow>

            <ModalSubtitle>
              Rate only the categories you want to use for this book.
            </ModalSubtitle>

            <RatingEditorScroll
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 6 }}
            >
              {RATING_CONFIG.map((item) => {
                const value = draftRatings[item.key] ?? 0;

                return (
                  <RatingEditorRow key={item.key}>
                    <RatingEditorTop>
                      <RatingEditorLabel>{item.label}</RatingEditorLabel>
                      <RatingEditorValue>
                        {value > 0 ? `${value}/5` : "—"}
                      </RatingEditorValue>
                    </RatingEditorTop>

                    {renderEditableRatingIcons(
                      item.key,
                      item.activeIcon,
                      item.inactiveIcon,
                      value
                    )}
                  </RatingEditorRow>
                );
              })}
            </RatingEditorScroll>

            <ModalFooterRow>
              <SecondaryModalButton onPress={closeRatingModal}>
                <SecondaryModalButtonText>Cancel</SecondaryModalButtonText>
              </SecondaryModalButton>

              <PrimaryModalButton onPress={onSaveRatings}>
                <PrimaryModalButtonText>Save</PrimaryModalButtonText>
              </PrimaryModalButton>
            </ModalFooterRow>
          </RatingModalCard>
        </ModalOverlay>
      </Modal>

      <Modal
        visible={noteModalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeNoteModal}
      >
        <ModalOverlay>
          <NoteModalCard>
            <ModalHeaderRow>
              <ModalTitle>
                {editingNoteId
                  ? noteType === "quote"
                    ? "Edit Quote"
                    : "Edit Note"
                  : noteType === "quote"
                    ? "Add Quote"
                    : "Add Note"}
              </ModalTitle>

              <CloseButton onPress={closeNoteModal}>
                <Ionicons name="close" size={18} color={theme.colors.foreground} />
              </CloseButton>
            </ModalHeaderRow>

            <ModalSubtitle>
              {noteType === "quote"
                ? "Save a favorite quote and optionally add page or chapter details."
                : "Write down your thoughts, reactions, or reminders for this book."}
            </ModalSubtitle>

            <NoteTextArea
              value={noteContent}
              onChangeText={setNoteContent}
              placeholder={
                noteType === "quote"
                  ? "Enter your quote..."
                  : "Write your note here..."
              }
              placeholderTextColor="rgba(113, 113, 130, 0.9)"
              multiline
              textAlignVertical="top"
            />

            {noteType === "quote" ? (
              <QuoteFieldsRow>
                <SmallInputWrap>
                  <SmallInputLabel>Page</SmallInputLabel>
                  <SmallInput
                    value={quotePage}
                    onChangeText={setQuotePage}
                    placeholder="e.g. 184"
                    placeholderTextColor="rgba(113, 113, 130, 0.9)"
                  />
                </SmallInputWrap>

                <SmallInputWrap>
                  <SmallInputLabel>Chapter</SmallInputLabel>
                  <SmallInput
                    value={quoteChapter}
                    onChangeText={setQuoteChapter}
                    placeholder="e.g. 12"
                    placeholderTextColor="rgba(113, 113, 130, 0.9)"
                  />
                </SmallInputWrap>
              </QuoteFieldsRow>
            ) : null}

            <ModalFooterRow>
              <SecondaryModalButton onPress={closeNoteModal}>
                <SecondaryModalButtonText>Cancel</SecondaryModalButtonText>
              </SecondaryModalButton>

              <PrimaryModalButton onPress={onSaveNote}>
                <PrimaryModalButtonText>
                  {editingNoteId ? "Update" : "Save"}
                </PrimaryModalButtonText>
              </PrimaryModalButton>
            </ModalFooterRow>
          </NoteModalCard>
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
  max-width: 920px;
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
  max-width: 920px;
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

const Hero = styled.View`
  gap: 20px;
  margin-top: 12px;
`;

const Cover = styled.Image`
  aspect-ratio: 2 / 3;
  border-radius: ${({ theme }) => theme.radius.xl}px;
  background: ${({ theme }) => theme.colors.muted};
  align-self: center;
`;

const Info = styled.View`
  gap: 10px;
`;

const Title = styled.Text`
  font-size: 30px;
  line-height: 36px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.bold};
  letter-spacing: -0.4px;
`;

const Author = styled.Text`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const MetaRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
`;

const MetaBadge = styled.View<{ secondary?: boolean }>`
  padding: 8px 12px;
  border-radius: 999px;
  background: ${({ theme, secondary }) =>
    secondary ? theme.colors.muted : theme.colors.secondary};
`;

const MetaBadgeText = styled.Text<{ secondary?: boolean }>`
  color: ${({ theme, secondary }) =>
    secondary ? theme.colors.foreground : theme.colors.secondaryForeground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
`;

const Star = styled.Text`
  color: #f4b400;
  font-size: 20px;
`;

const Rating = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const HeroActionsRow = styled.View`
  margin-top: 8px;
  flex-direction: row;
  gap: 10px;
`;

const HeroGhostButton = styled.Pressable`
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const HeroGhostButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const Section = styled.View`
  margin-top: 28px;
  gap: 10px;
`;

const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const SectionActionButton = styled.Pressable`
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const SectionActionButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const BodyText = styled.Text`
  font-size: 15px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const StatsCard = styled.View`
  margin-top: 24px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 18px;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  gap: 12px;
`;

const MiniStat = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const MiniStatButton = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const MiniStatLabel = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const MiniStatValue = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const MiniStatHelper = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const MiniDivider = styled.View`
  width: 1px;
  height: 40px;
  background: ${({ theme }) => theme.colors.border};
  align-self: center;
`;

const ProgressCard = styled.View`
  margin-top: 16px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 18px;
  gap: 12px;
`;

const ProgressHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ProgressTitle = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const ProgressEditButton = styled.Pressable`
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.muted};
`;

const ProgressEditButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const ProgressBarTrack = styled.View`
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.muted};
  overflow: hidden;
`;

const ProgressBarFill = styled.View`
  height: 100%;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
`;

const ProgressMeta = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const RatingCard = styled.View`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 18px;
  gap: 14px;
`;

const RatingItem = styled.View`
  gap: 8px;
`;

const RatingItemLabel = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const RatingIconsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const RatingEmoji = styled.Text<{ inactive?: boolean }>`
  font-size: 22px;
  opacity: ${({ inactive }) => (inactive ? 0.35 : 1)};
`;

const EmptyRatingWrap = styled.View`
  gap: 8px;
`;

const EmptyRatingTitle = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const EmptyRatingText = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 14px;
  line-height: 22px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const StickyBottomBar = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  background: ${({ theme }) => theme.colors.background};
  padding: 12px 18px 20px 18px;
`;

const BottomActions = styled.View`
  width: 100%;
  max-width: 920px;
  align-self: center;
  flex-direction: row;
  gap: 12px;
`;

const PrimaryButton = styled.Pressable`
  flex: 1;
  height: 48px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
`;

const PrimaryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const SecondaryButton = styled.Pressable`
  flex: 1;
  height: 48px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const SecondaryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
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

const ProgressModalCard = styled.View`
  width: 100%;
  max-width: 520px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 20px;
`;

const RatingModalCard = styled.View`
  width: 100%;
  max-width: 520px;
  max-height: 84%;
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

const CloseButton = styled.Pressable`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.muted};
`;

const RatingEditorScroll = styled.ScrollView`
  margin-top: 18px;
`;

const RatingEditorRow = styled.View`
  padding: 14px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  gap: 12px;
`;

const RatingEditorTop = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const RatingEditorLabel = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const RatingEditorValue = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const EditableIconsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const EditableEmojiButton = styled.Pressable`
  min-width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
`;

const EditableEmoji = styled.Text<{ inactive?: boolean }>`
  font-size: 24px;
  opacity: ${({ inactive }) => (inactive ? 0.28 : 1)};
`;

const ClearRatingButton = styled.Pressable`
  height: 34px;
  padding: 0 10px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.muted};
  margin-right: 4px;
`;

const ClearRatingText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const HeaderActionsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
`;

const SmallGhostButton = styled.Pressable`
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const SmallGhostButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const NotesWrap = styled.View`
  gap: 12px;
`;

const NoteCard = styled.View`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 16px;
  gap: 12px;
`;

const QuoteCard = styled.View`
  background: ${({ theme }) => theme.colors.muted};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.primary};
  padding: 16px;
  gap: 12px;
`;

const NoteTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const QuoteTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const NoteBadge = styled.View`
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.secondary};
`;

const QuoteBadge = styled.View`
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.muted};
`;

const NoteBadgeText = styled.Text`
  color: ${({ theme }) => theme.colors.secondaryForeground};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const QuoteBadgeText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const InlineActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const InlineIconButton = styled.Pressable`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
`;

const NoteText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  line-height: 24px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const QuoteText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 16px;
  line-height: 26px;
  font-weight: ${({ theme }) => theme.font.family.medium};
  font-style: italic;
`;

const QuoteMetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;

const QuoteMetaText = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const QuoteMetaDot = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 13px;
`;

const NoteModalCard = styled.View`
  width: 100%;
  max-width: 520px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 20px;
`;

const NoteTextArea = styled.TextInput`
  margin-top: 18px;
  min-height: 140px;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  padding: 14px;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  line-height: 22px;
  font-family: ${({ theme }) => theme.font.family.medium};
`;

const ProgressFieldsRow = styled.View`
  margin-top: 18px;
  flex-direction: row;
  gap: 10px;
`;

const QuoteFieldsRow = styled.View`
  margin-top: 14px;
  flex-direction: row;
  gap: 10px;
`;

const SmallInputWrap = styled.View`
  flex: 1;
  gap: 6px;
`;

const SmallInputLabel = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const SmallInput = styled.TextInput`
  height: 46px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  padding: 0 12px;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 14px;
  font-family: ${({ theme }) => theme.font.family.medium};
`;

const ModalFooterRow = styled.View`
  margin-top: 18px;
  flex-direction: row;
  gap: 10px;
`;

const SecondaryModalButton = styled.Pressable`
  flex: 1;
  height: 46px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.muted};
`;

const SecondaryModalButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const PrimaryModalButton = styled.Pressable`
  flex: 1;
  height: 46px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
`;

const PrimaryModalButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;