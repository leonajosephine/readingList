import React, { useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { AppHeader } from "../../src/components/AppHeader";
import { StatCard } from "../../src/components/StatCard";
import { BookCard } from "../../src/components/BookCard";
import { SegmentedControl } from "../../src/components/SegmentedControl";

export default function HomeScreen() {
  const [filter, setFilter] = useState<"all" | "toRead" | "done">("all");

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
            title="The Midnight Library"
            author="Matt Haig"
            rating="4.5"
            coverUrl="https://picsum.photos/400/600"
          />
          <BookCard
            title="The Name of the Wind"
            author="Patrick Rothfuss"
            rating="4.6"
            coverUrl="https://picsum.photos/401/600"
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
  font-size: 42px;
  font-weight: ${({ theme }) => theme.font.weight.black};
  color: ${({ theme }) => theme.colors.foreground};
  padding: 0 18px;
  margin-top: 10px;
`;

const Sub = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  padding: 6px 18px 0 18px;
  line-height: 24px;
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const StatsRow = styled.View`
  flex-direction: row;
  gap: 14px;
  padding: 18px;
`;

const SectionTitle = styled.Text`
  font-size: 28px;
  font-weight: ${({ theme }) => theme.font.weight.black};
  color: ${({ theme }) => theme.colors.foreground};
  padding: 10px 18px 14px 18px;
`;

const CardsRow = styled.View`
  flex-direction: row;
  gap: 14px;
  padding: 0 18px 18px 18px;
  align-items: stretch;
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