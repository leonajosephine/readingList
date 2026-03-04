import styled from "styled-components/native";

export const Card = styled.View`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const CardBody = styled.View`
  padding: ${({ theme }) => theme.space.md}px;
`;