import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
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

  constructor(
    private catManagementService:CategoryManagementService,
    private router:Router,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(){
    this.$catSubscriptionFetch = this.catManagementService.fetchCategory().
      subscribe((data:any)=>{
        console.log(data)
        this.categoryData = data.category;
        this.isLoading = false;
      });
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
