import React from "react";
import { Pressable, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";



export function AppHeader() {
  const router = useRouter();

  return (
    <Wrap>
      <Left>
        <Ionicons name="book-outline" size={22} color="#1D1B16" />
        <Brand>ReadList</Brand>
      </Left>

      <Right>
        <Pressable onPress={() => router.push("/settings")}>
          <AvatarRing>
            <Avatar
              source={{
                uri: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200",
              }}
            />
          </AvatarRing>
          <Gear>
            <Ionicons name="settings-outline" size={14} color="white" />
          </Gear>
        </Pressable>
      </Right>
    </Wrap>
  );
}

const Wrap = styled.View`
  padding: 18px 18px 10px 18px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Brand = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Right = styled.View`
  position: relative;
`;

const AvatarRing = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  overflow: hidden;
  border-width: 2px;
  border-color: rgba(29, 27, 22, 0.12);
`;

const Avatar = styled.Image`
  width: 44px;
  height: 44px;
`;

const Gear = styled.View`
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;