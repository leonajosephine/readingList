import React, { useMemo } from "react";
import { Alert, ScrollView } from "react-native";
import styled from "styled-components/native";
import { AppHeader } from "../../src/components/AppHeader";

type Friend = { id: string; name: string; avatarUrl: string; status?: "pending_in" | "pending_out" | "friend" };

export default function FriendsScreen() {
  const friends = useMemo<Friend[]>(
    () => [
      { id: "1", name: "Anna", avatarUrl: "https://i.pravatar.cc/200?img=32", status: "friend" },
      { id: "2", name: "Mia", avatarUrl: "https://i.pravatar.cc/200?img=12", status: "friend" },
      { id: "3", name: "Noah", avatarUrl: "https://i.pravatar.cc/200?img=24", status: "pending_in" },
      { id: "4", name: "Luca", avatarUrl: "https://i.pravatar.cc/200?img=8", status: "friend" },
      { id: "5", name: "Sophie", avatarUrl: "https://i.pravatar.cc/200?img=47", status: "pending_out" },
      { id: "6", name: "Ben", avatarUrl: "https://i.pravatar.cc/200?img=60", status: "friend" },
    ],
    []
  );

  const pendingInCount = friends.filter((f) => f.status === "pending_in").length;

  const onAddFriend = () => Alert.alert("Add Friend", "Coming soon");

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
    Alert.alert(f.name, "Friend profile (coming soon)");
  };

  return (
    <Screen>
      <AppHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
        <TopRow>
          <Title>Friends</Title>
          <RightControls>
            {pendingInCount > 0 && <Badge>{pendingInCount}</Badge>}
            <AddButton onPress={onAddFriend}>
              <AddText>+ Add</AddText>
            </AddButton>
          </RightControls>
        </TopRow>

        <Hint>Add friends to share books and lists.</Hint>

        <Grid>
          {friends.map((f) => (
            <AvatarTile key={f.id} onPress={() => onFriendPress(f)}>
              <AvatarWrap>
                <Avatar source={{ uri: f.avatarUrl }} />
                {f.status === "pending_in" && <Dot color="#0B0B16" />}
                {f.status === "pending_out" && <Dot color="#7C756C" />}
              </AvatarWrap>
              <Name numberOfLines={1}>{f.name}</Name>
              <Meta>
                {f.status === "pending_in" ? "Requested you" : f.status === "pending_out" ? "Pending" : "Friend"}
              </Meta>
            </AvatarTile>
          ))}
        </Grid>
      </ScrollView>
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
`;

const TopRow = styled.View`
  padding: 18px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: ${({ theme }) => theme.font.weight.black};
  color: ${({ theme }) => theme.colors.foreground};
`;

const RightControls = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Badge = styled.Text`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-weight: ${({ theme }) => theme.font.weight.black};
  padding: 6px 10px;
  border-radius: 999px;
  overflow: hidden;
`;

const AddButton = styled.Pressable`
  background: ${({ theme }) => theme.colors.primary};
  padding: 10px 16px;
  border-radius: 999px;
`;

const AddText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-weight: ${({ theme }) => theme.font.weight.black};
`;

const Hint = styled.Text`
  padding: 0 18px 14px 18px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  line-height: 20px;
`;

const Grid = styled.View`
  padding: 0 18px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const AvatarTile = styled.Pressable`
  width: 31%;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 12px;
  align-items: center;
`;

const AvatarWrap = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  overflow: hidden;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.border};
  position: relative;
`;

const Avatar = styled.Image`
  width: 64px;
  height: 64px;
`;

const Dot = styled.View<{ color: string }>`
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background: ${({ color }) => color};
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.card};
`;

const Name = styled.Text`
  margin-top: 10px;
  font-weight: ${({ theme }) => theme.font.weight.black};
  color: ${({ theme }) => theme.colors.foreground};
`;

const Meta = styled.Text`
  margin-top: 2px;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 12px;
`;