import React from "react";
import styled from "styled-components/native";

export function BookCard(props: {
  title: string;
  author: string;
  rating: string;
  coverUrl: string;
  onPress?: () => void;
}) {
  return (
    <Press onPress={props.onPress}>
      <Card>
        <Cover source={{ uri: props.coverUrl }} resizeMode="cover" />
        <Body>
          <Title numberOfLines={2}>{props.title}</Title>
          <Author numberOfLines={1}>{props.author}</Author>
          <RatingRow>
            <Star>★</Star>
            <Rating>{props.rating}</Rating>
          </RatingRow>
        </Body>
      </Card>
    </Press>
  );
}

const Press = styled.Pressable`
  flex: 1;
  min-width: 0px;
`;

const Card = styled.View`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const Cover = styled.Image`
  width: 100%;
  height: 200px;
`;

const Body = styled.View`
  padding: 14px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

const Author = styled.Text`
  font-size: 14px;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 700;
`;

const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
`;

const Star = styled.Text`
  font-size: 16px;
  color: #f4b400;
`;

const Rating = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
`;