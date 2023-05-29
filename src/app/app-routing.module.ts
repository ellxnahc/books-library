import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BooksManagementComponent } from './books-management/books-management.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '', component: DashboardComponent,
  },
  {
    path: 'admin/books-management', component: BooksManagementComponent, children: []
  }, {
    path: 'admin/books-management/book-details/:id', component: BookDetailComponent
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
