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
  margin: 0 18px;
  background: ${({ theme }) => theme.colors.chipBg};
  border-radius: 999px;
  padding: 6px;
  flex-direction: row;
  gap: 6px;
`;

const Item = styled.Pressable<{ active: boolean }>`
  flex: 1;
  padding: 10px 12px;
  border-radius: 999px;
  background: ${({ active, theme }) => (active ? theme.colors.chipActiveBg : "transparent")};
`;

const Text = styled.Text<{ active: boolean }>`
  text-align: center;
  font-weight: 900;
  color: ${({ active, theme }) => (active ? theme.colors.text : theme.colors.muted)};
`;