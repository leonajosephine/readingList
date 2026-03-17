import React from "react";
import { Modal, Pressable } from "react-native";
import styled from "styled-components/native";
import { BookStatus } from "../store/LibraryContext";

type Props = {
  visible: boolean;
  title?: string;
  author?: string;
  coverUrl?: string;
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
  author,
  coverUrl,
  currentStatus,
  onClose,
  onAddToList,
  onMarkReading,
  onMarkCompleted,
  onMarkToRead,
}: Props) {
  const statusLabel =
    currentStatus === "reading"
      ? "Currently Reading"
      : currentStatus === "done"
        ? "Completed"
        : "To Read";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Overlay onPress={onClose}>
        <BottomArea>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Sheet>
              {(coverUrl || title || author) && (
                <BookPreviewCard>
                  {coverUrl ? (
                    <MiniBookCover source={{ uri: coverUrl }} resizeMode="cover" />
                  ) : (
                    <MiniBookCoverPlaceholder />
                  )}

                  <BookPreviewContent>
                    {title ? (
                      <SheetTitle numberOfLines={2}>{title}</SheetTitle>
                    ) : null}

                    {author ? (
                      <SheetAuthor numberOfLines={1}>{author}</SheetAuthor>
                    ) : null}

                    {currentStatus ? (
                      <StatusBadge>
                        <StatusBadgeText>{statusLabel}</StatusBadgeText>
                      </StatusBadge>
                    ) : null}
                  </BookPreviewContent>
                </BookPreviewCard>
              )}

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
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const BookPreviewCard = styled.View`
  flex-direction: row;
  gap: 14px;
  align-items: center;
  padding: 6px 4px 16px 4px;
`;

const MiniBookCover = styled.Image`
  width: 62px;
  height: 92px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.muted};
`;

const MiniBookCoverPlaceholder = styled.View`
  width: 62px;
  height: 92px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.muted};
`;

const BookPreviewContent = styled.View`
  flex: 1;
  gap: 6px;
`;

const SheetTitle = styled.Text`
  color: ${({ theme }) => theme.colors.cardForeground};
  font-size: 17px;
  line-height: 22px;
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const SheetAuthor = styled.Text`
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const StatusBadge = styled.View`
  align-self: flex-start;
  margin-top: 4px;
  padding: 7px 11px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.secondary};
`;

const StatusBadgeText = styled.Text`
  color: ${({ theme }) => theme.colors.secondaryForeground};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
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