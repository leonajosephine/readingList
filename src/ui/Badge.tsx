import styled from "styled-components/native";

export const Badge = styled.Pressable<{ active?: boolean }>`
  padding: 8px 12px;
  border-radius: 999px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme, active }) => (active ? theme.colors.primary : "transparent")};
`;

export const BadgeText = styled.Text<{ active?: boolean }>`
  font-weight: ${({ theme }) => theme.font.weight.black};
  color: ${({ theme, active }) => (active ? theme.colors.primaryForeground : theme.colors.foreground)};
`;