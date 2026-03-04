import styled from "styled-components/native";

export const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
`;

export const Page = styled.View`
  width: 100%;
  max-width: 1100px;
  align-self: center;
  padding: ${({ theme }) => theme.space.md}px;
`;