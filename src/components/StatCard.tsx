import React from "react";
import styled from "styled-components/native";
import { softShadow } from "../ui/shadows"; 

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Box style={softShadow}>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Box>
  );
}

const Box = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: ${({ theme }) => theme.space.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const Label = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;

const Value = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 34px;
  font-weight: ${({ theme }) => theme.font.weight.black};
  margin-top: 6px;
`;