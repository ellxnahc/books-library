import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, defer, distinctUntilChanged, map, merge, Observable, of, startWith, Subscription } from 'rxjs';
import { BookCategory, Category } from '../model/category.model';
import { CategoryManagementService } from '../service/category-management.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{
  isLoading:boolean = false;
  public areMinimumCharactersTyped$: Observable<boolean>| undefined;
  public searchControl!: FormControl;
  categoryData: BookCategory[];
  alertMsg:string= '';
  cat:Category = {
    categoryName: '',
  };
  $catSubscriptionFetch : Subscription = Subscription.EMPTY;
  temp: any;
  categoryDataTemp: BookCategory[];

  constructor(
    private catManagementService:CategoryManagementService,
    private router:Router,
    private formBuilder: FormBuilder,
  ) {}

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

    

    this.$catSubscriptionFetch = this.catManagementService.fetchCategory().
      subscribe((data:any)=>{
        console.log(data)
        this.categoryData = data.category;
        this.categoryDataTemp = data.category;
        this.isLoading = false;
      });

    searchString$.subscribe(value => {
      this.categoryData = [];
      this.temp = this.categoryDataTemp.filter((data:any) => {
        if (data.categoryName.toLowerCase().includes(value.toLowerCase())) {
          this.categoryData.push(data);
        }
      })
    })
  }

  ngOnDestroy(){}

  addCategory(form:any){
    this.isLoading = true;
    this.cat = {
      categoryName: form.inputCategory,
    }
    this.catManagementService.addNewCategory(this.cat).subscribe(data=>{
      this.isLoading = false;
      this.alertMsg = 'Data has been added'
      setTimeout(()=>{window.location.reload()}, 4000);
      this.router.navigate(['./admin/category-management'])
      this.ngOnDestroy();
      const closeModal = document.getElementById('closeAddCatModal');
      closeModal?.click();
      // this.fetchData();
    });

  }

  redirectToDetailCat(id:string){
    this.router.navigate(['admin/category-management/category-detail', id])
  }



}
