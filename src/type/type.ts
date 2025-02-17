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
  notifications?: number;
  notificationEnabled?: boolean;
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
