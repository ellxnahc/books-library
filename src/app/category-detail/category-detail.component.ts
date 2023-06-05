import { Component , OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryManagementService } from '../service/category-management.service';
import { CategoryData } from '../model/category.model';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit{

  isLoading:boolean = false;
  $paramSubs:Subscription = Subscription.EMPTY;
  categoryId:string;
  alertMsg:string = '';
  alertMsgDel:string = '';
  // categoryData: any={
  //   id: '',
  //   categoryName:''
  // };
  categoryData: any;
  constructor(
    private authService: AuthService,
    private route : ActivatedRoute,
    private categoryService: CategoryManagementService,
    private router: Router

  ){}

  ngOnInit(): void {
    this.alertMsg='';
    this.alertMsgDel = '';
    this.isLoading = true;
    this.categoryData =
      {id: '', categoryName: ''}
    this.$paramSubs = this.route.params.subscribe((data)=>{
      this.categoryId = data['id'];
      this.fetchDetailData();
    });
  }

  fetchDetailData(){
    this.categoryService.fetchDetailCategory(this.categoryId).
      subscribe((data: any) => {
        this.isLoading = false;
        this.categoryData.id = this.categoryId;
        this.categoryData.categoryName = data.categoryName;
        console.log(this.categoryData)
    });
  }

  editCategory(form:any){
    this.alertMsgDel = '';
    this.isLoading= true;
    this.categoryData ={
      id: this.categoryId,
      categoryName: form.inputCategory
    }

    this.categoryService.editCategory(this.categoryData).subscribe(data=>{
      this.alertMsg = 'Data has been saved';
      setTimeout(()=>{this.router.navigate(['/admin/category-management']);}, 3000)
      this.isLoading = false;
      this.ngOnDestroy();
    })


  }

  ngOnDestroy(){
    this.$paramSubs.unsubscribe();

  }

  deleteBuffer(){
    this.alertMsg = '';
    console.log(this.alertMsg)
  }

  deleteCategory(){
    this.isLoading = true;
    this.categoryService.deleteCategory(this.categoryId).subscribe(data=>{
      this.alertMsgDel = 'Data has been deleted'
      setTimeout(()=>{this.router.navigate(['/admin/category-management']);}, 2000)
      this.isLoading = false;
      const closeModal = document.getElementById('closeDeleteCatModal');
      closeModal?.click();

    })

  }
}
