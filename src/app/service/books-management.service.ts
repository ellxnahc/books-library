import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookDisplayDetail, BookPostData, BooksData, BorrowingBookData } from '../model/book.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class BooksManagementService {

  endPointURL: string = 'https://library-management-9c253-default-rtdb.asia-southeast1.firebasedatabase.app/';
  bookUrl: string = this.endPointURL + 'book.json';
  bookDetailUrl: string = this.endPointURL + 'book/';
  bookDetailBorrowUrl : string = this.endPointURL+'bookBorrowDetail.json';
  userDetail:any;

  constructor(private httpClient: HttpClient) { }

  addNewBook(book: BookPostData) {
    return this.httpClient.post(this.bookUrl, book);
  }
  editBook(book: BookDisplayDetail, id:string) {
    const data = {
      [id] : {
        title: book.title,
        category: book.category,
        writer: book.writer,
        picture: book.picture,
        description: book.description,
        borowedStatus : book.borowedStatus
      }
    }
    return this.httpClient.patch(this.bookUrl, data);
  }

  deleteBook(id:string){
    const data = {
      [id] : {
        title: null,
        category: null,
        writer: null,
        picture: null,
        description: null,
        borowedStatus : null
      }
    }
    return this.httpClient.patch(this.bookUrl, data);
  }
  
  borrowBook(book: BookDisplayDetail, id:string) {
    const data = {
      [id] : {
        title: book.title,
        category: book.category,
        writer: book.writer,
        picture: book.picture,
        description: book.description,
        borowedStatus : book.borowedStatus
      }
    }
    return this.httpClient.patch(this.bookUrl, data);
  }

  returnBook(book:BorrowingBookData){
    const data = {
      [book.booksId] : {
        title: book.title,
        category: book.category,
        writer: book.writer,
        picture: book.picture,
        description: book.description,
        borowedStatus : false
      }
    }
    return this.httpClient.patch(this.bookUrl, data);
  }

  addBorrowDetailBook(book: BookDisplayDetail,id:string){
    this.userDetail = localStorage.getItem('userData');
    const email = JSON.parse(this.userDetail).email;
    const dataBorrowDetail = {
      booksId:id,
      title: book.title,
      category: book.category,
      writer: book.writer,
      picture: book.picture,
      description: book.description,
      borowedStatus : book.borowedStatus,
      email:email
    }
    return this.httpClient.post(this.bookDetailBorrowUrl,dataBorrowDetail);
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
