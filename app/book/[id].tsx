import React from "react";
import { Alert, ScrollView, useWindowDimensions } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useLibrary } from "../../src/store/LibraryContext";

export default function BookDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { books } = useLibrary();
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const book = books.find((item) => item.id === id);

  const isTablet = width >= 768;
  const coverWidth = isTablet ? 280 : Math.min(width * 0.52, 220);

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
              <MiniStatValue>—</MiniStatValue>
            </MiniStat>

            <MiniDivider />

            <MiniStat>
              <MiniStatLabel>Notes</MiniStatLabel>
              <MiniStatValue>0</MiniStatValue>
            </MiniStat>
          </StatsCard>
        </Content>
      </ScrollView>

      <StickyBottomBar>
        <BottomActions>
          <PrimaryButton onPress={() => Alert.alert("Add to List", "Coming soon")}>
            <PrimaryButtonText>Add to List</PrimaryButtonText>
          </PrimaryButton>

          <SecondaryButton onPress={() => Alert.alert("Notes", "Coming soon")}>
            <SecondaryButtonText>Add Note</SecondaryButtonText>
          </SecondaryButton>
        </BottomActions>
      </StickyBottomBar>
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
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
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

const SectionTitle = styled.Text`
  font-size: 22px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.bold};
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