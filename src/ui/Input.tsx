import styled from "styled-components/native";

export const Input = styled.TextInput`
  height: 48px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 16px;
`;