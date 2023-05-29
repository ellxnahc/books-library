import { Component } from '@angular/core';
import { BookDisplayDetail } from '../model/book.model';
import { Subscription } from 'rxjs';
import { BooksManagementService } from '../service/books-management.service';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private booksManagementService:BooksManagementService , private route:ActivatedRoute, private authService:AuthService){}

  ngOnInit(){
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
    })
    
  }

  ngOnDestroy(){
    this.$paramSubs.unsubscribe();
  }

}
