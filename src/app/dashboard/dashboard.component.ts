import { Component, OnInit } from '@angular/core';
import { BookData, BookPostData } from '../model/book.model';
import { BooksManagementService } from '../service/books-management.service';
import { Observable, Subscription, debounceTime, defer, distinctUntilChanged, filter, map, merge, of, share, startWith } from 'rxjs';

import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isLoading:boolean = false;

  book:BookPostData = {
    title: '',
    category: '',
    writer: '',
    picture: '',
    description: '',
    borowedStatus: false
  };

  public searchControl!: FormControl;
  public areMinimumCharactersTyped$: Observable<boolean>| undefined;
  $bookSubscriptionFetch : Subscription = Subscription.EMPTY;

  getBookData:BookData[]=[];

  displayBook:BookData[] = [];

  temp:any;

  constructor( 
    private booksManagementService:BooksManagementService,
    private router:Router,
    private formBuilder: FormBuilder,
  ) { 
  }
  ngOnInit(){
    this.searchControl = this.formBuilder.control("");

    this.areMinimumCharactersTyped$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((searchString) => searchString.length >= 0)
    );

    const searchString$ = merge(
      defer(() => of(this.searchControl.value)),
      this.searchControl.valueChanges
    ).pipe(debounceTime(300), distinctUntilChanged());
      this.isLoading = true;
      
    this.isLoading = true;
    this.$bookSubscriptionFetch = this.booksManagementService.fetchBook().subscribe(data=>{
      this.getBookData = data.books;
      this.isLoading = false;
      this.displayBook = data.books;
    });

    searchString$.subscribe(value=>{
      this.displayBook=[];
      this.temp = this.getBookData.filter(data=>{
        if(data.title.toLowerCase().includes(value.toLowerCase())){
          this.displayBook.push(data);
        }
      })
    })
  }

  
  openDetail(id:string){
    this.router.navigate(['/admin/books-management/book-details',id]);
  }ngOnDestroy(){}

  fetchData(){
    
    
  }


}
