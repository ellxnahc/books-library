import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BooksManagementComponent } from './books-management/books-management.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';
import { BookBorrowedListComponent } from './book-borrowed-list/book-borrowed-list.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';


const routes: Routes = [
  {
    path: '', component: DashboardComponent,
  },
  {
    path: 'admin/books-management', component: BooksManagementComponent, children: []
  }, {
    path: 'admin/books-management/book-details/:id', component: BookDetailComponent
  }, {
    path: 'admin/category-management', component: CategoryComponent
  },
   {
    path: 'admin/category-management/category-detail/:id', component: CategoryDetailComponent
  },
  {
    path: 'user/books', component: BooksManagementComponent,
  },
  {
    path: 'user/books/book-details/:id', component: BookDetailComponent
  },
  {
    path: 'user/borrowed-list', component: BookBorrowedListComponent
  },
  {
    path: 'admin/borrowed-management', component: BookBorrowedListComponent
  },
  // {
  //   path: 'register', component: RegisterComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
