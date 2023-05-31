export interface BookPostData {
    title: string,
    category: string,
    writer: string,
    picture: string,
    description: string,
    borowedStatus: boolean
}

export interface BorrowingBook {
    booksId: string,
    title: string,
    category: string,
    writer: string,
    picture: string,
    description: string,
    borowedStatus: boolean,
    email: string
}

export interface BorrowingBooksData {
    borrowedBook: BorrowingBookData[]
}

export interface BorrowingBookData {
    email: string,
    booksId: string,
    id: string,
    writer: string,
    category: string,
    title: string,
    picture: string,
    description: string,
    borowedStatus: boolean
}

export interface BookData {
    id: string,
    writer: string,
    category: string,
    title: string,
    picture: string,
    description: string,
    borowedStatus: boolean
}

export interface BookDisplayDetail {
    writer: string,
    category: string,
    title: string,
    picture: string,
    description: string,
    borowedStatus: boolean
}

export interface BooksData {
    books: BookData[]
}