import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BorrowingBook, BorrowingBookData, BorrowingBooksData } from '../model/book.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksBorrowingManagementService {

  endPointURL: string = 'https://library-management-9c253-default-rtdb.asia-southeast1.firebasedatabase.app/';
  bookUrl: string = this.endPointURL + 'book.json';
  bookDetailUrl: string = this.endPointURL + 'book/';
  bookDetailBorrowUrl: string = this.endPointURL + 'bookBorrowDetail.json';
  userDetail: any;

  constructor(private httpClient: HttpClient) { }

  borrowingList(userRole: number) {
    return this.httpClient.get<{ [key: string]: BorrowingBook }>(this.bookDetailBorrowUrl).pipe
      (map(responseData => {
        let postArray: BorrowingBooksData = { borrowedBook: [] };
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            let email;
            const userData = localStorage.getItem('userData');
            if (userData === null) {
              email = '';
            } else {
              email = JSON.parse(userData).email;
            }
            if (userRole === 2) {
              if (responseData[key].email === email) {
                postArray.borrowedBook.push({ ...responseData[key], id: key });
              }
            } else {
              postArray.borrowedBook.push({ ...responseData[key], id: key });
            }

          }
        }
        return postArray;
      }))
  }

  returnBookBorrowing(book: BorrowingBookData) {
    const data = {
      [book.id]: {
        booksId: null,
        title: null,
        category: null,
        writer: null,
        picture: null,
        description: null,
        borowedStatus: null
      }
    }
    return this.httpClient.patch(this.bookDetailBorrowUrl, data);

  }
}
