export type ExternalBook = {
    externalId: string;
    title: string;
    author: string;
    coverUrl: string;
    description?: string;
    genre?: string;
    totalPages?: number;
    publishedYear?: number;
    isbn?: string;
  };
  
  type OpenLibraryDoc = {
    key?: string;
    title?: string;
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    isbn?: string[];
    number_of_pages_median?: number;
    subject?: string[];
  };
  
  type OpenLibrarySearchResponse = {
    docs?: OpenLibraryDoc[];
  };
  
  export async function searchBooks(query: string): Promise<ExternalBook[]> {
    const trimmed = query.trim();
  
    if (!trimmed) return [];
  
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      trimmed
    )}&limit=20`;
  
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error("Could not fetch books.");
    }
  
    const data = (await response.json()) as OpenLibrarySearchResponse;
  
    return (data.docs ?? [])
      .filter((book) => !!book.title)
      .map((book) => {
        const coverUrl = book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : "https://picsum.photos/400/600?random=999";
  
        return {
          externalId: book.key ?? book.title ?? String(Date.now()),
          title: book.title ?? "Untitled",
          author: book.author_name?.[0] ?? "Unknown Author",
          coverUrl,
          publishedYear: book.first_publish_year,
          isbn: book.isbn?.[0],
          totalPages: book.number_of_pages_median,
          genre: book.subject?.[0],
        };
      });
  }