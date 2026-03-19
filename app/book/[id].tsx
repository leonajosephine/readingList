import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, ScrollView, useWindowDimensions } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { BookListPickerModal } from "../../src/components/BookListPickerModal";
import {
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
  { key: "overall", label: "Overall", activeIcon: "⭐️", inactiveIcon: "☆" }, //★
  { key: "spice", label: "Spice", activeIcon: "🔥", inactiveIcon: "○" },
  { key: "tension", label: "Tension", activeIcon: "⚡", inactiveIcon: "○" }, //⚡
  { key: "humor", label: "Humor", activeIcon: "😊", inactiveIcon: "○" },
  { key: "romance", label: "Romance", activeIcon: "❤️", inactiveIcon: "○" },
  { key: "tears", label: "Tears", activeIcon: "💧", inactiveIcon: "○" },
];

export default function BookDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { books, updateBookRatings } = useLibrary();

  const theme = useTheme();
  const { width } = useWindowDimensions();

  const book = books.find((item) => item.id === id);

  const [listModalOpen, setListModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [draftRatings, setDraftRatings] = useState<BookRatings>({});

  const isTablet = width >= 768;
  const coverWidth = isTablet ? 280 : Math.min(width * 0.52, 220);

  useEffect(() => {
    if (!book) return;
    setDraftRatings(book.userRatings ?? {});
  }, [book, ratingModalOpen]);

  const activeRatings = useMemo(() => {
    if (!book?.userRatings) return [];

    return RATING_CONFIG.filter((item) => {
      const value = book.userRatings?.[item.key] ?? 0;
      return value > 0;
    });
  }, [book?.userRatings]);

  const notesCount = book?.notes?.length ?? 0;
  const activeRatingCount = activeRatings.length;

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

  const statusLabel =
    book.status === "reading"
      ? "Currently Reading"
      : book.status === "done"
        ? "Completed"
        : "To Read";

  const openRatingModal = () => {
    setDraftRatings(book.userRatings ?? {});
    setRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
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
            <MiniStat>
              <MiniStatLabel>Pages</MiniStatLabel>
              <MiniStatValue>384</MiniStatValue>
            </MiniStat>

            <MiniDivider />

            <MiniStat>
              <MiniStatLabel>Your Rating</MiniStatLabel>
              <MiniStatValue>{activeRatingCount}</MiniStatValue>
            </MiniStat>

            <MiniDivider />

            <MiniStat>
              <MiniStatLabel>Notes</MiniStatLabel>
              <MiniStatValue>{notesCount}</MiniStatValue>
            </MiniStat>
          </StatsCard>

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
        </Content>
      </ScrollView>

      <StickyBottomBar>
        <BottomActions>
          <PrimaryButton onPress={() => setListModalOpen(true)}>
            <PrimaryButtonText>Add to List</PrimaryButtonText>
          </PrimaryButton>

          <SecondaryButton onPress={() => Alert.alert("Notes", "Coming soon")}>
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
                      <RatingEditorValue>{value > 0 ? `${value}/5` : "—"}</RatingEditorValue>
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
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const MiniStat = styled.View`
  flex: 1;
  align-items: center;
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

const MiniDivider = styled.View`
  width: 1px;
  height: 40px;
  background: ${({ theme }) => theme.colors.border};
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