import React from "react";
import { ScrollView, View } from "react-native";
import styled from "styled-components/native";
import { AppHeader } from "../../src/components/AppHeader";

export default function HomeScreen() {
  return (
    <Screen>
      <AppHeader />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <H1>Hi Leona</H1>
        <Sub>Track, organize, and discover your next favorite book</Sub>

        <Row>
          <StatBox>
            <StatLabel>Reading</StatLabel>
            <StatValue>2</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>To Read</StatLabel>
            <StatValue>3</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Done</StatLabel>
            <StatValue>3</StatValue>
          </StatBox>
        </Row>

        <SectionTitle>Currently Reading</SectionTitle>

        <CardsRow>
          <BookCard>
            <Cover source={{ uri: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900" }} />
            <CardBody>
              <CardTitle>The Midnight Library</CardTitle>
              <CardAuthor>Matt Haig</CardAuthor>
              <RatingRow>
                <Star>★</Star>
                <RatingText>4.5</RatingText>
              </RatingRow>
            </CardBody>
          </BookCard>

          <BookCard>
            <Cover source={{ uri: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900" }} />
            <CardBody>
              <CardTitle>The Name of the Wind</CardTitle>
              <CardAuthor>Patrick Rothfuss</CardAuthor>
              <RatingRow>
                <Star>★</Star>
                <RatingText>4.6</RatingText>
              </RatingRow>
            </CardBody>
          </BookCard>
        </CardsRow>

        <SectionTitle>Your Library</SectionTitle>

        <Pill>
          <PillItem active><PillText active>All</PillText></PillItem>
          <PillItem><PillText>To Read</PillText></PillItem>
          <PillItem><PillText>Done</PillText></PillItem>
        </Pill>

        {/* hier später Grid der Library */}
        <Spacer />
      </ScrollView>
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.bg};
`;

const H1 = styled.Text`
  font-size: 42px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  padding: 0 18px;
  margin-top: 8px;
`;

const Sub = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.muted};
  padding: 6px 18px 0 18px;
  line-height: 24px;
`;

const Row = styled.View`
  flex-direction: row;
  gap: 14px;
  padding: 18px;
`;

const StatBox = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 10px;
  shadow-offset: 0px 6px;
`;

const StatLabel = styled.Text`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  font-weight: 600;
`;

const StatValue = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 34px;
  font-weight: 800;
  margin-top: 6px;
`;

const SectionTitle = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 18px 12px 18px;
`;

const CardsRow = styled.View`
  flex-direction: row;
  gap: 14px;
  padding: 0 18px 18px 18px;
`;

const BookCard = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 12px;
  shadow-offset: 0px 8px;
`;

const Cover = styled.Image`
  width: 100%;
  height: 200px;
`;

const CardBody = styled.View`
  padding: 14px;
`;

const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const CardAuthor = styled.Text`
  font-size: 14px;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.muted};
`;

const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
`;

const Star = styled.Text`
  color: #f4b400;
  font-size: 16px;
`;

const RatingText = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
`;

const Pill = styled.View`
  margin: 0 18px;
  background: ${({ theme }) => theme.colors.chipBg};
  border-radius: 999px;
  padding: 6px;
  flex-direction: row;
  gap: 6px;
`;

const PillItem = styled.Pressable<{ active?: boolean }>`
  flex: 1;
  padding: 10px 12px;
  border-radius: 999px;
  background: ${({ active, theme }) => (active ? theme.colors.chipActiveBg : "transparent")};
`;

const PillText = styled.Text<{ active?: boolean }>`
  text-align: center;
  font-weight: 700;
  color: ${({ active, theme }) => (active ? theme.colors.text : theme.colors.muted)};
`;

const Spacer = styled.View`
  height: 24px;
`;