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
        <Title>Hi Leona</Title>
        <Subtitle>
          Track, organize, and discover your next favorite book
        </Subtitle>

        {/* Stats */}
        <StatsRow>
          <StatCard label="Reading" value="2" />
          <StatCard label="To Read" value="3" />
          <StatCard label="Done" value="3" />
        </StatsRow>

        {/* Currently Reading */}
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

        {/* Library */}
        <SectionTitle>Your Library</SectionTitle>

        <SegmentedControl
          value={filter}
          onChange={(key) => setFilter(key as any)}
          options={[
            { key: "all", label: "All" },
            { key: "toRead", label: "To Read" },
            { key: "done", label: "Done" },
          ]}
        />

        {/* Placeholder Grid */}
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
  background: ${({ theme }) => theme.colors.bg};
`;

const Title = styled.Text`
  font-size: 42px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  padding: 0 18px;
  margin-top: 10px;
`;

const Subtitle = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.muted};
  padding: 6px 18px 0 18px;
  line-height: 24px;
`;

const StatsRow = styled.View`
  flex-direction: row;
  gap: 14px;
  padding: 18px;
`;

const SectionTitle = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  padding: 10px 18px 14px 18px;
`;

const CardsRow = styled.View`
  flex-direction: row;
  gap: 14px;
  padding: 0 18px 18px 18px;
  align-items: stretch;
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