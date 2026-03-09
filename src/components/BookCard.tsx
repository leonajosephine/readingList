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

  const statusVariant = useMemo(() => {
    // Angelehnt an deine Tailwind Farben (blue/green/gray) – aber passend zu unseren Tokens.
    // Wir mappen es auf "secondary" look + leichte Abwandlung.
    const map: Record<BookStatus, "info" | "success" | "neutral"> = {
      "to-read": "info",
      reading: "success",
      completed: "neutral",
    };
    return map[status];
  }, [status]);

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 1.03,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={{ flex: 1 }}>
      <Card style={style}>
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
              <StatusBadge variant={statusVariant}>
                <StatusText>{statusLabel}</StatusText>
              </StatusBadge>
            ) : null}
          </MetaRow>
        </Body>
      </Card>
    </Pressable>
  );
}

/** Card container like: rounded-lg bg-card border border-border */
const Card = styled.View`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

/** aspect-[2/3] */
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

/** Badge: variant="secondary" + status tint */
const StatusBadge = styled.View<{ variant: "info" | "success" | "neutral" }>`
  padding: 6px 10px;
  border-radius: 999px;
  border-width: 1px;

  background: ${({ theme, variant }) => {
    if (variant === "info") return theme.colors.secondary;
    if (variant === "success") return theme.colors.secondary;
    return theme.colors.muted;
  }};

  border-color: ${({ theme }) => theme.colors.border};
`;

const StatusText = styled.Text`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.secondaryForeground};
`;