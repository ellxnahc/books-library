import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'books-library';
  constructor(private authService: AuthService){

  }
  ngOnInit(){
    this.authService.userRole=3;
  }
}
