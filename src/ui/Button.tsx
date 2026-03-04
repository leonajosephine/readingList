import styled from "styled-components/native";

export const Button = styled.Pressable<{ variant?: "primary" | "outline" | "secondary" | "destructive" }>`
  height: 44px;
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 8px;

  background: ${({ theme, variant }) => {
    if (variant === "secondary") return theme.colors.secondary;
    if (variant === "destructive") return theme.colors.destructive;
    if (variant === "outline") return "transparent";
    return theme.colors.primary;
  }};

  border-width: ${({ variant }) => (variant === "outline" ? 1 : 0)}px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const ButtonText = styled.Text<{ variant?: "primary" | "outline" | "secondary" | "destructive" }>`
  font-weight: ${({ theme }) => theme.font.weight.black};
  color: ${({ theme, variant }) => {
    if (variant === "secondary") return theme.colors.secondaryForeground;
    if (variant === "destructive") return theme.colors.destructiveForeground;
    if (variant === "outline") return theme.colors.foreground;
    return theme.colors.primaryForeground;
  }};
`;