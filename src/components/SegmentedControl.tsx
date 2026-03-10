import React from "react";
import styled from "styled-components/native";

export type SegmentOption = { key: string; label: string };

export function SegmentedControl(props: {
  value: string;
  options: SegmentOption[];
  onChange: (key: string) => void;
}) {
  return (
    <Wrap>
      {props.options.map((opt) => {
        const active = opt.key === props.value;
        return (
          <Item key={opt.key} active={active} onPress={() => props.onChange(opt.key)}>
            <Text active={active}>{opt.label}</Text>
          </Item>
        );
      })}
    </Wrap>
  );
}

const Wrap = styled.View`
  background: ${({ theme }) => theme.colors.muted};
  border-radius: 20px;
  padding: 2px 6px;
  flex-direction: row;
  gap: 6px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const Item = styled.Pressable<{ active: boolean }>`
  flex: 1;
  padding: 6px 12px;
  margin: 3px 0px;
  border-radius: 18px;
  background: ${({ active, theme }) => (active ? theme.colors.card : "transparent")};
`;

const Text = styled.Text<{ active: boolean }>`
  text-align: center;
  font-weight: ${({ theme }) => theme.font.family.bold};
  color: ${({ active, theme }) => (active ? theme.colors.foreground : theme.colors.mutedForeground)};
`;