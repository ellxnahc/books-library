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

    constructor(private httpClient: HttpClient){}

    addNewCategory(data: Category){
        return this.httpClient.post(this.categoryUrl, data)
    }

    editBook(data: BookCategory) {
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
}