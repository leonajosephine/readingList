import React from "react";
import styled from "styled-components/native";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export function AppHeader() {
  const router = useRouter();

  return (
    <Wrap>
      <Left>
        <Mark>
          <Ionicons name="book-outline" size={18} color="#1D1B16" />
        </Mark>
        <Brand>ReadList</Brand>
      </Left>

      <Pressable onPress={() => router.push("/settings")}>
        <AvatarWrap>
          <Avatar
            source={{
              uri: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200",
            }}
          />
          <Gear>
            <Ionicons name="settings-outline" size={14} color="#fff" />
          </Gear>
        </AvatarWrap>
      </Pressable>
    </Wrap>
  );
}

const Wrap = styled.View`
  padding: 18px 18px 8px 18px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Mark = styled.View`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background: ${({ theme }) => theme.colors.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  align-items: center;
  justify-content: center;
`;

const Brand = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const AvatarWrap = styled.View`
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
  right: -5px;
  bottom: -5px;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.bg};
`;