export interface User {
  uid?: string;
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  photo?: any;
  bio?: string;
  readingGoals?: number;
  favoriteGenres?: any;
  theme?: string;
  bookList?: Book[] | [];
  notifications?: string[];
  notificationEnabled?: boolean;
  notificationCount?: number;
}

export interface Book {
  id: string;
  name: string;
  desc: string;
  totalPage: number;
  rating: number;
  image: string;
  author: string;
  currentPage: number;
  status?: number;
  finishedDate?: number;
  timeSpent?: string;
  progress?: number;
  addDate?: number;
  genreId?: string;
  pagesReadHistory?: any;
  totalPagesRead?: number;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Status {
  id: number;
  value: string;
}

export interface DropZoneType {
  status: number;
  statusName: string;
  books: Book[];
  moveBook: (id: string, status: number) => void;
  removeBook: (id: string) => void;
}

export interface BookListType {
  data: Book[];
  isAuth: boolean;
  onAddBook: ((book: Book) => void) | null;
  isBookAdded?: (isAdded: boolean, message: string) => void;
}

export interface Note {
  book: Book;
  note: string[];
}
