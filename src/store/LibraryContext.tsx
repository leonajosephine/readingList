import React, { createContext, useContext, useMemo, useState } from "react";

export type BookStatus = "reading" | "to-read" | "done";

export type Book = {
  id: string;
  title: string;
  author: string;
  rating?: string;
  coverUrl: string;
  genre?: string;
  status?: BookStatus; // can be empty - still has to be implemented in the UI
};

export type ReadingList = {
  id: string;
  title: string;
  bookIds: string[];
};

type LibraryContextValue = {
  books: Book[];
  lists: ReadingList[];

  updateBookStatus: (bookId: string, status: BookStatus) => void;
  createList: (title: string) => void;
  deleteList: (listId: string) => void;
  addBookToList: (bookId: string, listId: string) => void;
  removeBookFromList: (bookId: string, listId: string) => void;
};

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "The Midnight Library",
      author: "Matt Haig",
      rating: "4.5",
      coverUrl: "https://picsum.photos/400/600?random=101",
      genre: "Fantasy",
      status: "reading",
    },
    {
      id: "2",
      title: "Dune",
      author: "Frank Herbert",
      rating: "4.3",
      coverUrl: "https://picsum.photos/400/600?random=102",
      genre: "Sci-Fi",
      status: "reading",
    },
    {
      id: "3",
      title: "Gone Girl",
      author: "Gillian Flynn",
      rating: "4.1",
      coverUrl: "https://picsum.photos/400/600?random=103",
      genre: "Mystery",
      status: "to-read",
    },
    {
      id: "4",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      rating: "4.4",
      coverUrl: "https://picsum.photos/400/600?random=104",
      genre: "Classics",
      status: "done",
    },
    {
      id: "5",
      title: "It Ends With Us",
      author: "Colleen Hoover",
      rating: "4.2",
      coverUrl: "https://picsum.photos/400/600?random=105",
      genre: "Romance",
      status: "done",
    },
    {
      id: "6",
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      rating: "4.6",
      coverUrl: "https://picsum.photos/400/600?random=106",
      genre: "Fantasy",
      status: "to-read",
    },
    {
      id: "7",
      title: "Project Hail Mary",
      author: "Andy Weir",
      rating: "4.7",
      coverUrl: "https://picsum.photos/400/600?random=107",
      genre: "Sci-Fi",
      status: "to-read",
    },
    {
      id: "8",
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      rating: "4.5",
      coverUrl: "https://picsum.photos/400/600?random=108",
      genre: "Romance",
      status: "done",
    },
  ]);

  const [lists, setLists] = useState<ReadingList[]>([
    {
      id: "1",
      title: "Summer Reads 2026",
      bookIds: ["1", "3"],
    },
    {
      id: "2",
      title: "Book Club Picks",
      bookIds: ["2", "4", "8"],
    },
    {
      id: "3",
      title: "Fantasy Favorites",
      bookIds: ["1", "6", "7"],
    },
  ]);

  const updateBookStatus = (bookId: string, status: BookStatus) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId ? { ...book, status } : book
      )
    );
  };

  const createList = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    setLists((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: trimmed,
        bookIds: [],
      },
    ]);
  };

  const deleteList = (listId: string) => {
    setLists((prev) => prev.filter((list) => list.id !== listId));
  };

  const addBookToList = (bookId: string, listId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        if (list.bookIds.includes(bookId)) return list;

        return {
          ...list,
          bookIds: [...list.bookIds, bookId],
        };
      })
    );
  };

  const removeBookFromList = (bookId: string, listId: string) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              bookIds: list.bookIds.filter((id) => id !== bookId),
            }
          : list
      )
    );
  };

  const value = useMemo(
    () => ({
      books,
      lists,
      updateBookStatus,
      createList,
      deleteList,
      addBookToList,
      removeBookFromList,
    }),
    [books, lists]
  );

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error("useLibrary must be used inside a LibraryProvider");
  }

  return context;
}
