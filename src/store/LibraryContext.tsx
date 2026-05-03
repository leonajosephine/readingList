import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from "react";
  import { supabase } from "../lib/supabase";
  import { ExternalBook } from "../services/bookApi";
  
  export type BookStatus = "reading" | "to-read" | "done";
  
  export type BookRatingCategory =
    | "overall"
    | "spice"
    | "tension"
    | "humor"
    | "romance"
    | "tears";
  
  export type BookRatings = {
    overall?: number;
    spice?: number;
    tension?: number;
    humor?: number;
    romance?: number;
    tears?: number;
  };
  
  export type BookNote =
    | {
        id: string;
        type: "note";
        content: string;
      }
    | {
        id: string;
        type: "quote";
        content: string;
        page?: string;
        chapter?: string;
      };
  
  export type NewBookNote =
    | {
        type: "note";
        content: string;
      }
    | {
        type: "quote";
        content: string;
        page?: string;
        chapter?: string;
      };
  
  export type BookNotePatch = {
    content?: string;
    page?: string;
    chapter?: string;
  };
  
  export type Book = {
    id: string;
    title: string;
    author: string;
    rating?: string;
    coverUrl: string;
    genre?: string;
    status?: BookStatus;
    userRatings?: BookRatings;
    notes?: BookNote[];
    currentPage?: number;
    totalPages?: number;
  };
  
  export type ReadingList = {
    id: string;
    title: string;
    bookIds: string[];
  };
  
  type LibraryContextValue = {
    books: Book[];
    lists: ReadingList[];
    loading: boolean;
    refreshLibrary: () => Promise<void>;
  
    addExternalBookToLibrary: (book: ExternalBook) => Promise<string | null>;
  
    updateBookStatus: (bookId: string, status: BookStatus) => Promise<void>;
    updateBookRatings: (bookId: string, ratings: BookRatings) => Promise<void>;
    updateBookProgress: (
      bookId: string,
      progress: { currentPage: number; totalPages: number }
    ) => Promise<void>;
  
    addBookNote: (bookId: string, note: NewBookNote) => Promise<void>;
    updateBookNote: (
      bookId: string,
      noteId: string,
      patch: BookNotePatch
    ) => Promise<void>;
    deleteBookNote: (bookId: string, noteId: string) => Promise<void>;
  
    createList: (title: string) => Promise<void>;
    renameList: (listId: string, title: string) => Promise<void>;
    deleteList: (listId: string) => Promise<void>;
    addBookToList: (bookId: string, listId: string) => Promise<void>;
    removeBookFromList: (bookId: string, listId: string) => Promise<void>;
  };
  
  const LibraryContext = createContext<LibraryContextValue | undefined>(
    undefined
  );
  
  type DbBook = {
    id: string;
    title: string;
    author: string;
    cover_url: string | null;
    description: string | null;
    genre: string | null;
    total_pages: number | null;
  };
  
  type DbUserBook = {
    book_id: string;
    status: BookStatus;
    current_page: number;
    total_pages_override: number | null;
  };
  
  type DbRating = {
    book_id: string;
    overall: number | null;
    spice: number | null;
    tension: number | null;
    humor: number | null;
    romance: number | null;
    tears: number | null;
  };
  
  type DbNote = {
    id: string;
    book_id: string;
    type: "note" | "quote";
    content: string;
    page: string | null;
    chapter: string | null;
  };
  
  type DbList = {
    id: string;
    title: string;
  };
  
  type DbListItem = {
    list_id: string;
    book_id: string;
    position: number | null;
  };
  
  export function LibraryProvider({ children }: { children: React.ReactNode }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [lists, setLists] = useState<ReadingList[]>([]);
    const [loading, setLoading] = useState(true);
  
    const requireUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      return user;
    };
  
    const refreshLibrary = async () => {
      setLoading(true);
  
      const user = await requireUser();
  
      if (!user) {
        setBooks([]);
        setLists([]);
        setLoading(false);
        return;
      }
  
      const [
        booksRes,
        userBooksRes,
        ratingsRes,
        notesRes,
        listsRes,
        listItemsRes,
      ] = await Promise.all([
        supabase
          .from("books")
          .select("*")
          .order("created_at", { ascending: true }),
  
        supabase
          .from("user_books")
          .select("book_id, status, current_page, total_pages_override")
          .eq("user_id", user.id),
  
        supabase
          .from("book_ratings")
          .select("book_id, overall, spice, tension, humor, romance, tears")
          .eq("user_id", user.id),
  
        supabase
          .from("book_notes")
          .select("id, book_id, type, content, page, chapter, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
  
        supabase
          .from("reading_lists")
          .select("id, title")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true }),
  
        supabase
          .from("reading_list_items")
          .select("list_id, book_id, position")
          .order("position", { ascending: true }),
      ]);
  
      if (booksRes.error) console.log("books error:", booksRes.error);
      if (userBooksRes.error) console.log("user_books error:", userBooksRes.error);
      if (ratingsRes.error) console.log("ratings error:", ratingsRes.error);
      if (notesRes.error) console.log("notes error:", notesRes.error);
      if (listsRes.error) console.log("lists error:", listsRes.error);
      if (listItemsRes.error) console.log("list_items error:", listItemsRes.error);
  
      const dbBooks = (booksRes.data ?? []) as DbBook[];
      const dbUserBooks = (userBooksRes.data ?? []) as DbUserBook[];
      const dbRatings = (ratingsRes.data ?? []) as DbRating[];
      const dbNotes = (notesRes.data ?? []) as DbNote[];
      const dbLists = (listsRes.data ?? []) as DbList[];
      const dbListItems = (listItemsRes.data ?? []) as DbListItem[];
  
      const userBookMap = new Map(
        dbUserBooks.map((item) => [item.book_id, item])
      );
  
      const ratingMap = new Map(dbRatings.map((item) => [item.book_id, item]));
  
      const notesMap = new Map<string, BookNote[]>();
  
      dbNotes.forEach((note) => {
        const existing = notesMap.get(note.book_id) ?? [];
  
        const mappedNote: BookNote =
          note.type === "quote"
            ? {
                id: note.id,
                type: "quote",
                content: note.content,
                page: note.page ?? undefined,
                chapter: note.chapter ?? undefined,
              }
            : {
                id: note.id,
                type: "note",
                content: note.content,
              };
  
        notesMap.set(note.book_id, [...existing, mappedNote]);
      });
  
      const mappedBooks: Book[] = dbBooks.map((book) => {
        const userBook = userBookMap.get(book.id);
        const rating = ratingMap.get(book.id);
  
        const userRatings: BookRatings | undefined = rating
          ? {
              overall: rating.overall ?? undefined,
              spice: rating.spice ?? undefined,
              tension: rating.tension ?? undefined,
              humor: rating.humor ?? undefined,
              romance: rating.romance ?? undefined,
              tears: rating.tears ?? undefined,
            }
          : undefined;
  
        return {
          id: book.id,
          title: book.title,
          author: book.author,
          rating: undefined,
          coverUrl: book.cover_url ?? "",
          genre: book.genre ?? undefined,
          status: userBook?.status,
          currentPage: userBook?.current_page ?? 0,
          totalPages:
            userBook?.total_pages_override ?? book.total_pages ?? undefined,
          userRatings,
          notes: notesMap.get(book.id) ?? [],
        };
      });
  
      const mappedLists: ReadingList[] = dbLists.map((list) => {
        const itemBookIds = dbListItems
          .filter((item) => item.list_id === list.id)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map((item) => item.book_id);
  
        return {
          id: list.id,
          title: list.title,
          bookIds: itemBookIds,
        };
      });
  
      setBooks(mappedBooks);
      setLists(mappedLists);
      setLoading(false);
    };
  
    useEffect(() => {
      refreshLibrary();
    }, []);
  
    const addExternalBookToLibrary = async (
      externalBook: ExternalBook
    ): Promise<string | null> => {
      const user = await requireUser();
      if (!user) return null;
  
      const { data: existingBooks, error: existingError } = await supabase
        .from("books")
        .select("id")
        .eq("title", externalBook.title)
        .eq("author", externalBook.author)
        .limit(1);
  
      if (existingError) {
        console.log("Find existing book error:", existingError);
        return null;
      }
  
      let bookId = existingBooks?.[0]?.id;
  
      if (!bookId) {
        const { data, error } = await supabase
          .from("books")
          .insert({
            title: externalBook.title,
            author: externalBook.author,
            cover_url: externalBook.coverUrl,
            description: externalBook.description ?? null,
            genre: externalBook.genre ?? null,
            total_pages: externalBook.totalPages ?? null,
            published_year: externalBook.publishedYear ?? null,
            isbn: externalBook.isbn ?? null,
          })
          .select("id")
          .single();
  
        if (error || !data) {
          console.log("Add external book error:", error);
          return null;
        }
  
        bookId = data.id;
      }
  
      const { error: userBookError } = await supabase.from("user_books").upsert(
        {
          user_id: user.id,
          book_id: bookId,
          status: "to-read",
          current_page: 0,
          total_pages_override: externalBook.totalPages ?? null,
        },
        { onConflict: "user_id,book_id" }
      );
  
      if (userBookError) {
        console.log("Add user book error:", userBookError);
        return null;
      }
  
      await refreshLibrary();
      return bookId;
    };
  
    const updateBookStatus = async (bookId: string, status: BookStatus) => {
      const user = await requireUser();
      if (!user) return;
  
      const existing = books.find((book) => book.id === bookId);
  
      const { error } = await supabase.from("user_books").upsert(
        {
          user_id: user.id,
          book_id: bookId,
          status,
          current_page: existing?.currentPage ?? 0,
          total_pages_override: existing?.totalPages ?? null,
        },
        { onConflict: "user_id,book_id" }
      );
  
      if (error) {
        console.log("updateBookStatus error:", error);
        return;
      }
  
      await refreshLibrary();
    };
  
    const updateBookRatings = async (bookId: string, ratings: BookRatings) => {
      const user = await requireUser();
      if (!user) return;
  
      const { error } = await supabase.from("book_ratings").upsert(
        {
          user_id: user.id,
          book_id: bookId,
          overall: ratings.overall ?? null,
          spice: ratings.spice ?? null,
          tension: ratings.tension ?? null,
          humor: ratings.humor ?? null,
          romance: ratings.romance ?? null,
          tears: ratings.tears ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,book_id" }
      );
  
      if (error) {
        console.log("updateBookRatings error:", error);
        return;
      }
  
      await refreshLibrary();
    };
  
    const updateBookProgress = async (
      bookId: string,
      progress: { currentPage: number; totalPages: number }
    ) => {
      const user = await requireUser();
      if (!user) return;
  
      const existing = books.find((book) => book.id === bookId);
  
      const { error } = await supabase.from("user_books").upsert(
        {
          user_id: user.id,
          book_id: bookId,
          status: existing?.status ?? "reading",
          current_page: progress.currentPage,
          total_pages_override: progress.totalPages,
        },
        { onConflict: "user_id,book_id" }
      );
  
      if (error) {
        console.log("updateBookProgress error:", error);
        return;
      }
  
      await refreshLibrary();
    };
  
    const addBookNote = async (bookId: string, note: NewBookNote) => {
      const user = await requireUser();
      if (!user) return;
  
      const payload =
        note.type === "quote"
          ? {
              user_id: user.id,
              book_id: bookId,
              type: "quote",
              content: note.content,
              page: note.page ?? null,
              chapter: note.chapter ?? null,
            }
          : {
              user_id: user.id,
              book_id: bookId,
              type: "note",
              content: note.content,
            };
  
      const { error } = await supabase.from("book_notes").insert(payload);
  
      if (error) {
        console.log("addBookNote error:", error);
        return;
      }
  
      await refreshLibrary();
    };
  
    const updateBookNote = async (
      bookId: string,
      noteId: string,
      patch: BookNotePatch
    ) => {
      const updates = {
        content: patch.content,
        page: patch.page ?? null,
        chapter: patch.chapter ?? null,
        updated_at: new Date().toISOString(),
      };
  
      const { error } = await supabase
        .from("book_notes")
        .update(updates)
        .eq("id", noteId)
        .eq("book_id", bookId);
  
      if (error) {
        console.log("updateBookNote error:", error);
        return;
      }
  
      await refreshLibrary();
    };
  
    const deleteBookNote = async (bookId: string, noteId: string) => {
      const { error } = await supabase
        .from("book_notes")
        .delete()
        .eq("id", noteId)
        .eq("book_id", bookId);
  
      if (error) {
        console.log("deleteBookNote error:", error);
        return;
      }
  
      await refreshLibrary();
    };
  
    const createList = async (title: string) => {
      const user = await requireUser();
      if (!user) return;
  
      const trimmed = title.trim();
      if (!trimmed) return;
  
      const { error } = await supabase.from("reading_lists").insert({
        user_id: user.id,
        title: trimmed,
      });
  
      if (error) {
        console.log("createList error:", error);
        return;
      }
  
      await refreshLibrary();
    };
  
    const renameList = async (listId: string, title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
  
      const { error } = await supabase
        .from("reading_lists")
        .update({
          title: trimmed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", listId);
  
      if (error) {
        console.log("renameList error:", error);
        return;
      }
  
      await refreshLibrary();
    };
  
    const deleteList = async (listId: string) => {
      const { error } = await supabase
        .from("reading_lists")
        .delete()
        .eq("id", listId);
  
      if (error) {
        console.log("deleteList error:", error);
        return;
      }
  
      await refreshLibrary();
    };
  
    const addBookToList = async (bookId: string, listId: string) => {
      const list = lists.find((item) => item.id === listId);
      const nextPosition = list?.bookIds.length ?? 0;
  
      const { error } = await supabase.from("reading_list_items").upsert(
        {
          list_id: listId,
          book_id: bookId,
          position: nextPosition,
        },
        { onConflict: "list_id,book_id" }
      );
  
      if (error) {
        console.log("addBookToList error:", error);
        return;
      }
  
      await refreshLibrary();
    };
  
    const removeBookFromList = async (bookId: string, listId: string) => {
      const { error } = await supabase
        .from("reading_list_items")
        .delete()
        .eq("list_id", listId)
        .eq("book_id", bookId);
  
      if (error) {
        console.log("removeBookFromList error:", error);
        return;
      }
  
      await refreshLibrary();
    };
  
    const value = useMemo(
      () => ({
        books,
        lists,
        loading,
        refreshLibrary,
        addExternalBookToLibrary,
        updateBookStatus,
        updateBookRatings,
        updateBookProgress,
        addBookNote,
        updateBookNote,
        deleteBookNote,
        createList,
        renameList,
        deleteList,
        addBookToList,
        removeBookFromList,
      }),
      [books, lists, loading]
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