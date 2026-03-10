import React, { useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { AppHeader } from "../../src/components/AppHeader";
import { StatCard } from "../../src/components/StatCard";
import { BookCard } from "../../src/components/BookCard";
import { SegmentedControl } from "../../src/components/SegmentedControl";

export default function HomeScreen() {
  const [filter, setFilter] = useState<"all" | "toRead" | "done">("all");

  const { width } = useWindowDimensions();

    const horizontalPadding = 18 * 2;
    const gap = 14;
    const availableWidth = width - horizontalPadding - gap;
    const cardWidth = Math.min(availableWidth / 2, 256);

  return (
    <Screen>
      <AppHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <H1>Hi Leona</H1>
        <Sub>Track, organize, and discover your next favorite book</Sub>

        <StatsRow>
          <StatCard label="Reading" value="2" />
          <StatCard label="To Read" value="3" />
          <StatCard label="Done" value="3" />
        </StatsRow>

        <SectionTitle>Currently Reading</SectionTitle>
        <CardsRow>
          <BookCard
            style={{ width: cardWidth }}
            book={{
                id: "1",
                title: "The Midnight Library",
                author: "Matt Haig",
                rating: "4.5",
                coverUrl: "https://picsum.photos/400/600",
                status: "reading",
            }}
            />
          <BookCard 
            style={{ width: cardWidth }}
            book={{
                id: "2",
                title: "Dune",
                author: "Frank Herbert",
                rating: "4.3",
                coverUrl: "https://picsum.photos/402/600",
                status: "reading",
             }}
            />
        </CardsRow>

        <SectionTitle>Your Library</SectionTitle>
        <SegmentWrap>
          <SegmentedControl
            value={filter}
            onChange={(k) => setFilter(k as any)}
            options={[
              { key: "all", label: "All" },
              { key: "toRead", label: "To Read" },
              { key: "done", label: "Done" },
            ]}
          />
        </SegmentWrap>

        <LibraryGrid>
          <Tile />
          <Tile />
          <Tile />
          <Tile />
        </LibraryGrid>
      </ScrollView>
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
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
  gap: 14px;
  padding: 0 18px 18px 18px;
  justify-content: flex-start;
`;

const SegmentWrap = styled.View`
  padding: 0 18px;
`;

const LibraryGrid = styled.View`
  padding: 16px 18px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const Tile = styled.View`
  width: 48%;
  height: 180px;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;