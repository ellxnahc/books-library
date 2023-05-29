import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookPostData, BooksData } from '../model/book.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class BooksManagementService {

  endPointURL: string = 'https://library-management-9c253-default-rtdb.asia-southeast1.firebasedatabase.app/';
  bookUrl: string = this.endPointURL + 'book.json';
  bookDetailUrl: string = this.endPointURL + 'book/'

  constructor(private httpClient: HttpClient) { }

  addNewBook(book: BookPostData) {
    return this.httpClient.post(this.bookUrl, book);
  }

  fetchBook() {
    return this.httpClient.get<{ [key: string]: BookPostData }>(this.bookUrl).pipe
      (map(responseData => {
        let postArray: BooksData = { books: [] };
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.books.push({ ...responseData[key], id: key })
          }
        }
        return postArray;
      }))
  }

  fetchDetailBook(id: string) {
    return this.httpClient.get<{
      borowedStatus: boolean, description: string, title: string, writer: string, picture: string, category:string
    }>(this.bookDetailUrl + id + '.json');
  }
}
