import React from "react";
import styled from "styled-components/native";

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Box>
  );
}

const Box = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 10px;
  shadow-offset: 0px 6px;
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  font-weight: 700;
`;

const Value = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 34px;
  font-weight: 900;
  margin-top: 6px;
`;