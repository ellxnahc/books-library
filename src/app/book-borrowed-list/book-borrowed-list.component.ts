import { Component } from '@angular/core';
import { BooksBorrowingManagementService } from '../service/books-borrowing-management.service';
import { BorrowingBookData } from '../model/book.model';
import { BooksManagementService } from '../service/books-management.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-book-borrowed-list',
  templateUrl: './book-borrowed-list.component.html',
  styleUrls: ['./book-borrowed-list.component.css']
})
export class BookBorrowedListComponent {

  isLoading: boolean = false;
  isBorrowing: boolean = false;
  isAdmin: boolean = false;
  constructor(
    private authService: AuthService,
    private booksBorrowingManagement: BooksBorrowingManagementService,
    private bookManagementService: BooksManagementService
  ) { }

  borrowedBook: BorrowingBookData[] = [];
  bookReturnData: BorrowingBookData = {
    booksId: '',
    id: '',
    writer: '',
    category: '',
    title: '',
    picture: '',
    description: '',
    borowedStatus: false,
    email: ''
  };
  ngOnInit() {
    this.bookReturnData = {
      email: '',
      booksId: '',
      id: '',
      writer: '',
      category: '',
      title: '',
      picture: '',
      description: '',
      borowedStatus: false
    };
    if (this.authService.userRole === 1) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.booksBorrowingManagement.borrowingList(this.authService.userRole).subscribe(data => {
      console.log(data.borrowedBook);
      this.borrowedBook = data.borrowedBook;
      if (this.borrowedBook.length != 0) {
        this.isBorrowing = true;
      } else {
        this.isBorrowing = false;
      }
    })
  }


  returnData(index: number) {
    this.bookReturnData = {

      email: '',
      booksId: '',
      id: '',
      writer: '',
      category: '',
      title: '',
      picture: '',
      description: '',
      borowedStatus: false
    };
    this.bookReturnData = this.borrowedBook[index];
    console.log(this.bookReturnData);
  }

  returnBorrowed(bookBorrowedData: BorrowingBookData) {
    this.isLoading = true;
    this.bookManagementService.returnBook(bookBorrowedData).subscribe(data => {
      this.booksBorrowingManagement.returnBookBorrowing(bookBorrowedData).subscribe(data => {
        this.booksBorrowingManagement.borrowingList(this.authService.userRole).subscribe(data => {
          console.log(data.borrowedBook);
          this.borrowedBook = data.borrowedBook;
          this.isLoading = false;
          if (this.borrowedBook.length != 0) {
            this.isBorrowing = true;
          } else {
            this.isBorrowing = false;
          }
          const closeModal = document.getElementById('closeReturnBookModal');
          closeModal?.click();
        })
      })
    })
  }
}
