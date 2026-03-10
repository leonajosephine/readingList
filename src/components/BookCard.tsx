import React, { useMemo, useRef } from "react";
import { Animated, Pressable, ViewStyle } from "react-native";
import styled from "styled-components/native";

export type BookStatus = "to-read" | "reading" | "completed";

export type BookCardBook = {
  id: string;
  title: string;
  author: string;
  rating: string;
  coverUrl: string;
  status?: BookStatus;
};

export function BookCard({
  book,
  onPress,
  style,
  showStatus = true,
}: {
  book: BookCardBook;
  onPress?: () => void;
  style?: ViewStyle;
  showStatus?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const status = book.status ?? "to-read";

  const statusLabel = useMemo(() => {
    const map: Record<BookStatus, string> = {
      "to-read": "To Read",
      reading: "Reading",
      completed: "Completed",
    };
    return map[status];
  }, [status]);

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 1.02,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  return (
    <CardWrap style={style}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        <Card>
          <CoverWrap>
            <AnimatedCover
              style={{ transform: [{ scale }] }}
              source={{ uri: book.coverUrl }}
              resizeMode="cover"
            />
          </CoverWrap>

          <Body>
            <Title numberOfLines={1}>{book.title}</Title>
            <Author numberOfLines={1}>{book.author}</Author>

            <MetaRow>
              <StarRow>
                <Star>★</Star>
                <RatingText>{book.rating}</RatingText>
              </StarRow>

              {showStatus ? (
                <StatusBadge>
                  <StatusText>{statusLabel}</StatusText>
                </StatusBadge>
              ) : null}
            </MetaRow>
          </Body>
        </Card>
      </Pressable>
    </CardWrap>
  );
}

const CardWrap = styled.View`
  width: 100%;
  max-width: 256px;
`;

const Card = styled.View`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  overflow: hidden;

  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 14px;
  shadow-offset: 0px 6px;
  elevation: 4;
`;

const CoverWrap = styled.View`
  width: 100%;
  aspect-ratio: 2 / 3;
  background: ${({ theme }) => theme.colors.muted};
  overflow: hidden;
`;

const AnimatedCover = Animated.createAnimatedComponent(styled.Image`
  width: 100%;
  height: 100%;
`);

const Body = styled.View`
  padding: 12px;
`;

const Title = styled.Text`
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.cardForeground};
  font-size: 15px;
`;

const Author = styled.Text`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  font-size: 13px;
`;

const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  gap: 10px;
`;

const StarRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const Star = styled.Text`
  color: #f4b400;
  font-size: 16px;
`;

const RatingText = styled.Text`
  color: ${({ theme }) => theme.colors.cardForeground};
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;

const StatusBadge = styled.View`
  padding: 6px 10px;
  border-radius: 999px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.secondary};
`;

const StatusText = styled.Text`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.secondaryForeground};
`;