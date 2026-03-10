import styled from "styled-components/native";

export const H1 = styled.Text`
  font-size: 34px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
`;

export const H2 = styled.Text`
  font-size: 22px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ theme }) => theme.colors.foreground};
`;

export const P = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  line-height: 22px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

export const Small = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;