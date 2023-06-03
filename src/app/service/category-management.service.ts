import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BookCategory, Category, CategoryData } from '../model/category.model';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoryManagementService {
    endPointURL: string = 'https://library-management-9c253-default-rtdb.asia-southeast1.firebasedatabase.app/';
    categoryUrl: string = this.endPointURL + 'category.json';
    categoryDetailUrl: string = this.endPointURL + 'category/';

    constructor(private httpClient: HttpClient){}

    addNewCategory(data: Category){
        return this.httpClient.post(this.categoryUrl, data)
    }

    editCategory(data: BookCategory) {
      const obj = {
        [data.id]:{
          categoryName: data.categoryName
        }
      }
        return this.httpClient.patch(this.categoryUrl, obj);
    }

    deleteCategory(id:string){
      const data = {
        [id] : {
          categoryName: null
        }
      }
      return this.httpClient.patch(this.categoryUrl, data);
    }

    fetchCategory(){
        return this.httpClient.get<{ [key: string] : BookCategory}>(this.categoryUrl).pipe
        (map(responseData => {
          let postArray: CategoryData = { category: [] };
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.category.push({ ...responseData[key], id: key })
            }
          }
          return postArray;
        }))
    }

    fetchDetailCategory(id:string){
      console.log(id);
      return this.httpClient.get<{categoryName: string}>(this.categoryDetailUrl + id + '.json');
    }
}
