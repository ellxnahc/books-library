import { Component } from '@angular/core';
import { BookDisplayDetail } from '../model/book.model';
import { Subscription } from 'rxjs';
import { BooksManagementService } from '../service/books-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent {
  bookDisplayDetail:BookDisplayDetail;
  $paramSubs:Subscription = Subscription.EMPTY;
  $bookDetailSubscriptionFetch : Subscription = Subscription.EMPTY
  booksId:string;
  isLoading:boolean = false;
  isAdmin:boolean=true;
  isGuess:boolean=false;

  role:number=3;

  category:string[]=['Economy','Marketing','Novel','Computer'];

  constructor(
    private router:Router,
    private booksManagementService:BooksManagementService , 
    private route:ActivatedRoute, 
    private authService:AuthService){}

  ngOnInit(){
    this.role = this.authService.userRole;
    this.isLoading = true;
    this.$paramSubs = this.route.params.subscribe((data)=>{
      this.booksId = data['id'];
      this.fetchDetailData();
    });
    this.role=this.authService.userRole;
  }

  fetchDetailData(){
    this.$bookDetailSubscriptionFetch = this.booksManagementService.fetchDetailBook(this.booksId).subscribe(data=>{
      this.isLoading = false;
      this.bookDisplayDetail = {
        category: data.category,
        writer: data.writer,
        title:data.title,
        picture:data.picture,
        description:data.description,
        borowedStatus:data.borowedStatus
      };
      console.log(this.bookDisplayDetail.borowedStatus);
    })

  }

  editBook(form:any){
    this.isLoading = true;
    this.bookDisplayDetail = {
      title: form.inputTitle,
      category: form.inputCategory,
      writer: form.inputWriter,
      picture: form.inputPicture,
      description: form.inputDescription,
      borowedStatus: false
    }
    this.booksManagementService.editBook(this.bookDisplayDetail, this.booksId).subscribe(data=>{
      this.isLoading = false;
      this.ngOnDestroy();
      const closeModal = document.getElementById('closeEditBookModal');
      closeModal?.click();
    });

  }


  borrowBook(){
    this.isLoading = true;
    this.bookDisplayDetail.borowedStatus=true;
    this.booksManagementService.borrowBook(this.bookDisplayDetail, this.booksId).subscribe(data=>{
      this.booksManagementService.addBorrowDetailBook(this.bookDisplayDetail,this.booksId).subscribe(data=>{

        this.isLoading = false;
        this.ngOnDestroy();
        const closeModal = document.getElementById('closeBorrowBookModal');
        closeModal?.click();
      })
    });
  }

  deleteBook(){
    this.isLoading = true;
    this.booksManagementService.deleteBook(this.booksId).subscribe(data=>{
      this.isLoading = false;
      const closeModal = document.getElementById('closeDeleteBookModal');
      closeModal?.click();
      this.router.navigate(['/admin/books-management']);
    })

  }

  ngOnDestroy(){
    this.$paramSubs.unsubscribe();
  }

}
