import React, { useMemo } from "react";
import { Alert, ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

import { AppHeader } from "../../src/components/AppHeader";
import { softShadow } from "../../src/ui/shadows";

type Friend = {
  id: string;
  name: string;
  avatarUrl: string;
  booksRead: number;
  booksInCommon: number;
  status?: "pending_in" | "pending_out" | "friend";
};

export default function FriendsScreen() {
  const friends = useMemo<Friend[]>(
    () => [
      {
        id: "1",
        name: "Emma Chen",
        avatarUrl: "https://i.pravatar.cc/200?img=32",
        booksRead: 127,
        booksInCommon: 12,
        status: "friend",
      },
      {
        id: "2",
        name: "Marcus Johnson",
        avatarUrl: "https://i.pravatar.cc/200?img=12",
        booksRead: 89,
        booksInCommon: 8,
        status: "friend",
      },
      {
        id: "3",
        name: "Sofia Rodriguez",
        avatarUrl: "https://i.pravatar.cc/200?img=24",
        booksRead: 156,
        booksInCommon: 15,
        status: "friend",
      },
      {
        id: "4",
        name: "Alex Kim",
        avatarUrl: "https://i.pravatar.cc/200?img=8",
        booksRead: 74,
        booksInCommon: 6,
        status: "pending_in",
      },
    ],
    []
  );

  const pendingInCount = friends.filter((f) => f.status === "pending_in").length;

  const onAddFriend = () => {
    Alert.alert("Add Friend", "Coming soon");
  };

  const onFriendPress = (f: Friend) => {
    if (f.status === "pending_in") {
      Alert.alert(f.name, "Friend request", [
        { text: "Accept", onPress: () => Alert.alert("Accepted") },
        { text: "Decline", style: "destructive", onPress: () => Alert.alert("Declined") },
        { text: "Cancel", style: "cancel" },
      ]);
      return;
    }

    if (f.status === "pending_out") {
      Alert.alert(f.name, "Request pending", [
        { text: "Cancel request", style: "destructive", onPress: () => Alert.alert("Canceled") },
        { text: "OK", style: "cancel" },
      ]);
      return;
    }

    Alert.alert(f.name, "Friend profile coming soon");
  };

  return (
    <Screen>
      <AppHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 84 }}>
        <TopRow>
          <TitleBlock>
            <Title>Friends</Title>
            <Subtitle>Connect and share your reading journey</Subtitle>
          </TitleBlock>
        </TopRow>

        <HeaderActions>
          {pendingInCount > 0 && <Badge>{pendingInCount}</Badge>}
          <AddButton onPress={onAddFriend}>
            <Ionicons name="person-add-outline" size={18} color="#fff" />
            <AddText>Add Friend</AddText>
          </AddButton>
        </HeaderActions>

        <CardsWrap>
          {friends.map((f) => (
            <FriendCard key={f.id} style={softShadow} onPress={() => onFriendPress(f)}>
              <CardTop>
                <AvatarWrap>
                  <Avatar source={{ uri: f.avatarUrl }} />
                </AvatarWrap>

                <InfoWrap>
                  <FriendName numberOfLines={1}>{f.name}</FriendName>

                  <BooksRow>
                    <Ionicons
                      name="book-outline"
                      size={16}
                      color="#7A7A8C"
                    />
                    <BooksText>{f.booksRead} books read</BooksText>
                  </BooksRow>
                </InfoWrap>
              </CardTop>

              <CommonBadge>
                <CommonBadgeText>{f.booksInCommon} books in common</CommonBadgeText>
              </CommonBadge>

              <BottomRow>
                <ShareButton>
                  <Ionicons name="share-social-outline" size={16} color="#1A1A1A" />
                  <ShareButtonText>Share List</ShareButtonText>
                </ShareButton>

                <IconButton>
                  <Ionicons name="mail-outline" size={16} color="#1A1A1A" />
                </IconButton>
              </BottomRow>
            </FriendCard>
          ))}
        </CardsWrap>
      </ScrollView>
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
`;

const TopRow = styled.View`
  padding: 18px 18px 8px 18px;
`;

const TitleBlock = styled.View`
  gap: 8px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
  letter-spacing: -0.4px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
  line-height: 22px;
`;

const HeaderActions = styled.View`
  padding: 0 18px 16px 18px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Badge = styled.Text`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryForeground};
  padding: 8px 10px;
  border-radius: 999px;
  overflow: hidden;
  font-weight: ${({ theme }) => theme.font.family.semibold};
  font-size: 13px;
`;

const AddButton = styled.Pressable`
  flex: 1;
  height: 44px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const AddText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-weight: ${({ theme }) => theme.font.family.semibold};
  font-size: 16px;
`;

const CardsWrap = styled.View`
  padding: 0 18px;
  gap: 16px;
`;

const FriendCard = styled.Pressable`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 16px;
`;

const CardTop = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 14px;
`;

const AvatarWrap = styled.View`
  width: 58px;
  height: 58px;
  border-radius: 29px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.muted};
`;

const Avatar = styled.Image`
  width: 58px;
  height: 58px;
`;

const InfoWrap = styled.View`
  flex: 1;
  gap: 6px;
`;

const FriendName = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const BooksRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const BooksText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const CommonBadge = styled.View`
  align-self: flex-start;
  margin-top: 14px;
  padding: 8px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.muted};
`;

const CommonBadgeText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const BottomRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
`;

const ShareButton = styled.Pressable`
  flex: 1;
  height: 40px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.card};
`;

const ShareButtonText = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const IconButton = styled.Pressable`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.card};
`;