import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { AuthRequestData } from '../interface/auth';
import { NgForm } from '@angular/forms';
import { AlertComponent } from 'ngx-bootstrap/alert';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  isLogin: boolean = false;
  isLoading:boolean =false;
  obj: any;
  constructor(private authService: AuthService, private router: Router){}

  registered:boolean = true;
  errorMsg:string = '';
  alerts: any[] = [{
    type: 'danger',
    msg: '',
    timeout: 2000
  }];

  isUser: boolean=false;
  isAdmin:boolean=false;
  isGuess:boolean=false;
  ngOnInit(){
    document.body.classList.toggle("light-theme");
  }

  ngDoCheck(){

    this.isUser=false;
    this.isAdmin=false;
    this.isGuess=false;
    // this.obj = JSON.parse(localStorage.getItem('isLogin')||'')
    // console.log(this.obj)
    this.obj = localStorage.getItem('userData');
    // console.log(JSON.parse(this.obj).email);
    if(this.obj===null){
      this.isGuess=true;
      this.isLogin= false;
    }else if(JSON.parse(this.obj).email==="knowryadmin@gmail.com" || JSON.parse(this.obj).email==="aewinj@gmail.com"){
      this.isAdmin=true;
      this.isLogin= true
    }else{
      this.isUser=true;
      this.isLogin= true
    }
  }

  logOut(){
    this.authService.logout();
    this.isLogin= false;
  }
}
