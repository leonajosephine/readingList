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

type GoogleIdentifier = {
  type?: string;
  identifier?: string;
};

type GoogleImageLinks = {
  smallThumbnail?: string;
  thumbnail?: string;
};

type GoogleVolumeInfo = {
  title?: string;
  subtitle?: string;
  authors?: string[];
  description?: string;
  categories?: string[];
  pageCount?: number;
  publishedDate?: string;
  industryIdentifiers?: GoogleIdentifier[];
  imageLinks?: GoogleImageLinks;
};

type GoogleBookItem = {
  id?: string;
  volumeInfo?: GoogleVolumeInfo;
};

type GoogleBooksResponse = {
  items?: GoogleBookItem[];
};

const API_BASE = "https://www.googleapis.com/books/v1/volumes";
const GOOGLE_BOOKS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY;

const FALLBACK_COVER =
  "https://dummyimage.com/400x600/e9ebef/717182.png&text=No+Cover";

const searchCache = new Map<string, ExternalBook[]>();
const detailsCache = new Map<string, ExternalBook>();

const normalizeText = (value?: string) => value?.trim() || undefined;

const toHttps = (url?: string) => {
  if (!url) return undefined;
  return url.replace(/^http:\/\//, "https://");
};

const getCoverUrl = (links?: GoogleImageLinks) => {
  return toHttps(links?.thumbnail ?? links?.smallThumbnail) ?? FALLBACK_COVER;
};

const getPublishedYear = (publishedDate?: string) => {
  if (!publishedDate) return undefined;

  const year = Number(publishedDate.slice(0, 4));
  return Number.isNaN(year) ? undefined : year;
};

const getIsbn = (identifiers?: GoogleIdentifier[]) => {
  return (
    identifiers?.find((item) => item.type === "ISBN_13")?.identifier ??
    identifiers?.find((item) => item.type === "ISBN_10")?.identifier
  );
};

const cleanDescription = (description?: string) => {
  if (!description) return undefined;

  return description
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const mapGoogleBook = (item: GoogleBookItem): ExternalBook | null => {
  const info = item.volumeInfo;
  const title = normalizeText(info?.title);

  if (!item.id || !title) return null;

  return {
    externalId: item.id,
    title,
    author: info?.authors?.[0] ?? "Unknown Author",
    coverUrl: getCoverUrl(info?.imageLinks),
    description: cleanDescription(info?.description),
    genre: info?.categories?.[0],
    totalPages: info?.pageCount,
    publishedYear: getPublishedYear(info?.publishedDate),
    isbn: getIsbn(info?.industryIdentifiers),
  };
};

const dedupeBooks = (books: ExternalBook[]) => {
  const seen = new Set<string>();

  return books.filter((book) => {
    const key = book.isbn
      ? `isbn:${book.isbn}`
      : `${book.title.toLowerCase()}-${book.author.toLowerCase()}`;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

const buildParams = (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params);

  if (GOOGLE_BOOKS_API_KEY) {
    searchParams.append("key", GOOGLE_BOOKS_API_KEY);
  }

  return searchParams.toString();
};

export async function searchBooks(query: string): Promise<ExternalBook[]> {
  const trimmed = query.trim();

  if (!trimmed) return [];

  const cacheKey = trimmed.toLowerCase();

  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  const url = `${API_BASE}?${buildParams({
    q: trimmed,
    maxResults: "20",
    printType: "books",
    orderBy: "relevance",
  })}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.log("Google Books search failed:", response.status);
      return [];
    }

    const data = (await response.json()) as GoogleBooksResponse;

    const results = dedupeBooks(
      (data.items ?? [])
        .map(mapGoogleBook)
        .filter((book): book is ExternalBook => book !== null)
    );

    searchCache.set(cacheKey, results);

    return results;
  } catch (error) {
    console.log("Google Books search error:", error);
    return [];
  }
}

export async function getBookDetails(book: ExternalBook): Promise<ExternalBook> {
  if (!book.externalId) return book;

  if (detailsCache.has(book.externalId)) {
    return {
      ...book,
      ...detailsCache.get(book.externalId)!,
    };
  }

  const url = `${API_BASE}/${book.externalId}?${buildParams({})}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.log("Google Books details failed:", response.status);
      return book;
    }

    const data = (await response.json()) as GoogleBookItem;
    const detailedBook = mapGoogleBook(data);

    if (!detailedBook) return book;

    const mergedBook: ExternalBook = {
      ...book,
      ...detailedBook,
      description: detailedBook.description ?? book.description,
      coverUrl:
        detailedBook.coverUrl !== FALLBACK_COVER
          ? detailedBook.coverUrl
          : book.coverUrl,
    };

    detailsCache.set(book.externalId, mergedBook);

    return mergedBook;
  } catch (error) {
    console.log("Google Books details error:", error);
    return book;
  }
}