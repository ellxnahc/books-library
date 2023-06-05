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
import { UserManagementComponent } from './user-management/user-management.component';
import { AuthGuessGuard } from './auth-guess.guard';
import { AuthAdminGuard } from './auth-admin.guard';
import { AuthUserGuard } from './auth-user.guard';


const routes: Routes = [
  {
    path: '', component: DashboardComponent,canActivate:[AuthGuessGuard]
  },{
    path: 'book-details/:id', component: BookDetailComponent,canActivate:[AuthGuessGuard]
  },
  {
    path: 'admin/books-management', component: BooksManagementComponent,canActivate:[AuthAdminGuard]
  }, {
    path: 'admin/books-management/book-details/:id', component: BookDetailComponent,canActivate:[AuthAdminGuard]
  }, {
    path: 'admin/category-management', component: CategoryComponent,canActivate:[AuthAdminGuard]
  },
   {
    path: 'admin/category-management/category-detail/:id', component: CategoryDetailComponent,canActivate:[AuthAdminGuard]
  },
  {
    path: 'admin/borrowed-management', component: BookBorrowedListComponent,canActivate:[AuthAdminGuard]
  },
  {
    path: 'admin/user-management', component: UserManagementComponent,canActivate:[AuthAdminGuard]
  },
  {
    path: 'user/books', component: BooksManagementComponent,canActivate:[AuthUserGuard]
  },
  {
    path: 'user/books/book-details/:id', component: BookDetailComponent,canActivate:[AuthUserGuard]
  },
  {
    path: 'user/borrowed-list', component: BookBorrowedListComponent,canActivate:[AuthUserGuard]
  },
  {
    path:'**',pathMatch: 'full', 
    component: DashboardComponent
  }
  // {
  //   path: 'register', component: RegisterComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
