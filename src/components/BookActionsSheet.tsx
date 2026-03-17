import React from "react";
import { Modal, Pressable } from "react-native";
import styled from "styled-components/native";
import { BookStatus } from "../store/LibraryContext";

type Props = {
  visible: boolean;
  title?: string;
  currentStatus?: BookStatus;
  onClose: () => void;
  onAddToList?: () => void;
  onMarkReading?: () => void;
  onMarkCompleted?: () => void;
  onMarkToRead?: () => void;
};

export function BookActionsSheet({
  visible,
  title,
  currentStatus,
  onClose,
  onAddToList,
  onMarkReading,
  onMarkCompleted,
  onMarkToRead,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Overlay onPress={onClose}>
        <BottomArea>
          <Pressable>
            <Sheet>
              {title ? <SheetTitle numberOfLines={2}>{title}</SheetTitle> : null}

              {onAddToList ? (
                <ActionButton onPress={onAddToList}>
                  <ActionText>Add to List</ActionText>
                </ActionButton>
              ) : null}

              {currentStatus !== "reading" && onMarkReading ? (
                <ActionButton onPress={onMarkReading}>
                  <ActionText>Mark as Reading</ActionText>
                </ActionButton>
              ) : null}

              {currentStatus !== "done" && onMarkCompleted ? (
                <ActionButton onPress={onMarkCompleted}>
                  <ActionText>Mark as Completed</ActionText>
                </ActionButton>
              ) : null}

              {currentStatus !== "to-read" && onMarkToRead ? (
                <ActionButton onPress={onMarkToRead}>
                  <ActionText>Mark as To Read</ActionText>
                </ActionButton>
              ) : null}

              <CancelButton onPress={onClose}>
                <CancelText>Cancel</CancelText>
              </CancelButton>
            </Sheet>
          </Pressable>
        </BottomArea>
      </Overlay>
    </Modal>
  );
}

const Overlay = styled.Pressable`
  flex: 1;
  background: rgba(0, 0, 0, 0.35);
  justify-content: flex-end;
`;

const BottomArea = styled.View`
  padding: 16px;
`;

const Sheet = styled.View`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl ?? 24}px;
  padding: 14px;
`;

const SheetTitle = styled.Text`
  color: ${({ theme }) => theme.colors.cardForeground};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.font.family.bold};
  margin-bottom: 10px;
`;

const ActionButton = styled.Pressable`
  padding: 14px 12px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 8px;
`;

const ActionText = styled.Text`
  color: ${({ theme }) => theme.colors.secondaryForeground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const CancelButton = styled.Pressable`
  padding: 14px 12px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.muted};
  margin-top: 4px;
`;

const CancelText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  text-align: center;
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;