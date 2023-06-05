import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  isLogin: boolean = false;
  isLoading: boolean = false;
  obj: any;
  constructor(private authService: AuthService, private router: Router) { }


  isUser: boolean = false;
  isAdmin: boolean = false;
  isGuess: boolean = false;

  ngOnInit() {
    document.body.classList.toggle("light-theme");
  }

  ngDoCheck() {

    this.isUser = false;
    this.isAdmin = false;
    this.isGuess = false;
  
    this.obj = localStorage.getItem('userData');

    if (this.obj === null) {
      this.isGuess = true;
      this.isLogin = false;
    } else if (JSON.parse(this.obj).email === "knowryadmin@gmail.com" || JSON.parse(this.obj).email === "aewinj@gmail.com") {
      this.isAdmin = true;
      this.isLogin = true
      this.authService.userRole = 1;
    } else {
      this.isUser = true;
      this.isLogin = true
      this.authService.userRole = 2;
    }
  }

  logOut() {
    this.authService.logout();
    this.isLogin = false;
  }
}
