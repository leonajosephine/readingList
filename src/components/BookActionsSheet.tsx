import React from "react";
import { Modal, Pressable } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
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
              <HandleWrap>
                <Handle />
              </HandleWrap>

              {(coverUrl || title || author) && (
                <>
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

                  <Divider />
                </>
              )}

              <ActionsGroup>
                {onAddToList ? (
                  <ActionButton onPress={onAddToList}>
                    <ActionLeft>
                      <ActionIconWrap>
                        <Ionicons name="bookmark-outline" size={18} color="currentColor" />
                      </ActionIconWrap>
                      <ActionText>Add to List</ActionText>
                    </ActionLeft>
                    <Chevron name="chevron-forward" size={18} />
                  </ActionButton>
                ) : null}

                {currentStatus !== "reading" && onMarkReading ? (
                  <ActionButton onPress={onMarkReading}>
                    <ActionLeft>
                      <ActionIconWrap>
                        <Ionicons name="book-outline" size={18} color="currentColor" />
                      </ActionIconWrap>
                      <ActionText>Mark as Reading</ActionText>
                    </ActionLeft>
                    <Chevron name="chevron-forward" size={18} />
                  </ActionButton>
                ) : null}

                {currentStatus !== "done" && onMarkCompleted ? (
                  <ActionButton onPress={onMarkCompleted}>
                    <ActionLeft>
                      <ActionIconWrap>
                        <Ionicons name="checkmark-circle-outline" size={18} color="currentColor" />
                      </ActionIconWrap>
                      <ActionText>Mark as Completed</ActionText>
                    </ActionLeft>
                    <Chevron name="chevron-forward" size={18} />
                  </ActionButton>
                ) : null}

                {currentStatus !== "to-read" && onMarkToRead ? (
                  <ActionButton onPress={onMarkToRead}>
                    <ActionLeft>
                      <ActionIconWrap>
                        <Ionicons name="time-outline" size={18} color="currentColor" />
                      </ActionIconWrap>
                      <ActionText>Mark as To Read</ActionText>
                    </ActionLeft>
                    <Chevron name="chevron-forward" size={18} />
                  </ActionButton>
                ) : null}
              </ActionsGroup>

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
  padding: 12px 14px 14px 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};

  shadow-color: #000;
  shadow-opacity: 0.12;
  shadow-radius: 16px;
  shadow-offset: 0px -4px;
  elevation: 8;
`;

const HandleWrap = styled.View`
  align-items: center;
  padding-top: 2px;
  padding-bottom: 10px;
`;

const Handle = styled.View`
  width: 42px;
  height: 5px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
`;

const BookPreviewCard = styled.View`
  flex-direction: row;
  gap: 14px;
  align-items: center;
  padding: 4px 4px 14px 4px;
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

const Divider = styled.View`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin-bottom: 12px;
`;

const ActionsGroup = styled.View`
  gap: 8px;
`;

const ActionButton = styled.Pressable`
  min-height: 54px;
  padding: 14px 12px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.secondary};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ActionLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const ActionIconWrap = styled.View`
  width: 22px;
  align-items: center;
  justify-content: center;
`;

const ActionText = styled.Text`
  color: ${({ theme }) => theme.colors.secondaryForeground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const Chevron = styled(Ionicons).attrs(({ theme }) => ({
  color: theme.colors.mutedForeground,
}))``;

const CancelButton = styled.Pressable`
  padding: 15px 12px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.muted};
  margin-top: 10px;
`;

const CancelText = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  text-align: center;
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;