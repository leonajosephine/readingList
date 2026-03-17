import React, { useMemo } from "react";
import { Modal } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useLibrary } from "../store/LibraryContext";

type Props = {
  visible: boolean;
  bookId?: string | null;
  title?: string;
  onClose: () => void;
};

export function BookListPickerModal({
  visible,
  bookId,
  title = "Add to Lists",
  onClose,
}: Props) {
  const theme = useTheme();
  const { books, lists, addBookToList, removeBookFromList } = useLibrary();

  const book = useMemo(
    () => books.find((item) => item.id === bookId),
    [books, bookId]
  );

  const listsWithSelection = useMemo(() => {
    if (!book) return [];

    return lists.map((list) => ({
      ...list,
      selected: list.bookIds.includes(book.id),
    }));
  }, [lists, book]);

  const onToggleBookInList = (listId: string, selected: boolean) => {
    if (!book) return;

    if (selected) {
      removeBookFromList(book.id, listId);
    } else {
      addBookToList(book.id, listId);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <ListModalCard>
          <ModalHeaderRow>
            <ModalTitle>{title}</ModalTitle>

            <CloseButton onPress={onClose}>
              <Ionicons name="close" size={18} color={theme.colors.foreground} />
            </CloseButton>
          </ModalHeaderRow>

          <ModalSubtitle>
            {book
              ? `Choose one or more lists for "${book.title}"`
              : "Choose one or more lists for this book"}
          </ModalSubtitle>

          <ListOptions>
            {listsWithSelection.map((list) => (
              <ListOptionButton
                key={list.id}
                onPress={() => onToggleBookInList(list.id, list.selected)}
              >
                <ListOptionTextWrap>
                  <ListOptionTitle numberOfLines={1}>
                    {list.title}
                  </ListOptionTitle>
                  <ListOptionMeta>
                    {list.bookIds.length} book{list.bookIds.length === 1 ? "" : "s"}
                  </ListOptionMeta>
                </ListOptionTextWrap>

                <Checkbox active={list.selected}>
                  {list.selected ? (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={theme.colors.primaryForeground}
                    />
                  ) : null}
                </Checkbox>
              </ListOptionButton>
            ))}
          </ListOptions>

          <DoneButton onPress={onClose}>
            <DoneButtonText>Done</DoneButtonText>
          </DoneButton>
        </ListModalCard>
      </ModalOverlay>
    </Modal>
  );
}

const ModalOverlay = styled.View`
  flex: 1;
  background: rgba(0, 0, 0, 0.35);
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ListModalCard = styled.View`
  width: 100%;
  max-width: 460px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 20px;
`;

const ModalHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.bold};
`;

const ModalSubtitle = styled.Text`
  margin-top: 6px;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const CloseButton = styled.Pressable`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.muted};
`;

const ListOptions = styled.View`
  margin-top: 18px;
  gap: 10px;
`;

const ListOptionButton = styled.Pressable`
  min-height: 58px;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  padding: 12px 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ListOptionTextWrap = styled.View`
  flex: 1;
`;

const ListOptionTitle = styled.Text`
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const ListOptionMeta = styled.Text`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const Checkbox = styled.View<{ active: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  border-width: 1.5px;
  border-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.border};
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : "transparent"};
`;

const DoneButton = styled.Pressable`
  margin-top: 18px;
  height: 46px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
`;

const DoneButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;