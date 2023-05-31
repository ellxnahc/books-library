import { Component, OnInit } from '@angular/core';
import { BookData, BookPostData } from '../model/book.model';
import { BooksManagementService } from '../service/books-management.service';
import { Observable, Subscription, debounceTime, defer, distinctUntilChanged, filter, map, merge, of, share, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { CategoryManagementService } from '../service/category-management.service';
import { BookCategory, CategoryData } from '../model/category.model';

@Component({
  selector: 'app-books-management',
  templateUrl: './books-management.component.html',
  styleUrls: ['./books-management.component.css']
})
export class BooksManagementComponent implements OnInit{

  isLoading:boolean = false;
  public areMinimumCharactersTyped$: Observable<boolean>| undefined;

  public searchControl!: FormControl;
  book:BookPostData = {
    title: '',
    category: '',
    writer: '',
    picture: '',
    description: '',
    borowedStatus: false
  };

  addData:string = "Choose Category"
  temp:any;
  categoryData:CategoryData;
  showCat: any;
  // category:string[]=['Economy','Marketing','Novel','Computer'];

  $bookSubscriptionFetch : Subscription = Subscription.EMPTY;

  getBookData:BookData[]=[];

  displayBook:BookData[] = [];

  $addNewSubscribe : Subscription = Subscription.EMPTY;
  constructor(
    private booksManagementService:BooksManagementService,
    private categoryService: CategoryManagementService,
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

      this.$bookSubscriptionFetch = this.booksManagementService.fetchBook().
      subscribe(data=>{
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

      this.categoryService.fetchCategory().
      subscribe((data:CategoryData)=>{
        this.categoryData = data;
        this.showCat = this.categoryData.category;
        console.log(this.showCat)
      });

    }


  openDetail(id:string){
    this.router.navigate(['/admin/books-management/book-details',id]);
  }

  ngOnDestroy(){}

  addBook(form:any){
    this.isLoading = true;
    this.book = {
      title: form.inputTitle,
      category: form.inputCategory,
      writer: form.inputWriter,
      picture: form.inputPicture,
      description: form.inputDescription,
      borowedStatus: false
    }
    this.booksManagementService.addNewBook(this.book).subscribe(data=>{
      this.isLoading = false;
      this.ngOnDestroy();
      const closeModal = document.getElementById('closeAddBookModal');
      closeModal?.click();
      this.fetchData();
    });

  }

  fetchData(){


  }
}
