import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, subscribeOn } from 'rxjs';
import { AlertComponent } from 'ngx-bootstrap/alert';

import { AuthRequestData, AuthResponseData, UserData } from '../model/auth';
import { AuthService } from '../service/auth.service';

enum UserRole{
  Admin = 1,
NormalUser = 2,
  Guess = 3,
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent {

    isLoading:boolean =false;

    registered:boolean = true;
    errorMsg:string = '';
    alerts: any[] = [{
      type: 'danger',
      msg: '',
      timeout: 2000
    }];
    user:any;
    postUserData: UserData;

    constructor(private authService: AuthService, private router: Router){}

    onSwitchMode(){
      this.registered = !this.registered;
    }

    onSubmit(authForm: NgForm){
      this.isLoading=true;
      if(!authForm.valid) return;

      const email = authForm.value.email;
      const password = authForm.value.password;
      const authReqData : AuthRequestData = {
        email : email,
        password : password,
        secureToken : true,
      }

      if(this.registered){
        this.authService.login(authReqData).subscribe(
        {
          next : (data:any)=>{
            this.isLoading=false;
            console.log(data);
            this.errorMsg='';
            const closeModal = document.getElementById('closeSignInModal');
            closeModal?.click();
            this.user=localStorage.getItem('userData');
            if(JSON.parse(this.user).email=="knowryadmin@gmail.com" || JSON.parse(this.user).email=="aewinj@gmail.com"){
              this.authService.userRole=UserRole.Admin;
            }else{
              this.authService.userRole=UserRole.NormalUser;
            }
            console.log(this.authService.userRole);
            this.router.navigate(['/admin/books-management'])
          },
          error: error =>{
            this.isLoading=false;
            console.log(error);
            this.errorMsg = error;
            this.alerts = [{
              type: 'danger',
              msg: this.errorMsg,
              timeout: 2000
            }];

          }
        })
      }else{
        this.authService.signup(authReqData).subscribe(
        {
          next : (data:any)=>{
            this.isLoading=false;
            console.log(data);
            let obj = {
              id : data.localId,
              email: data.email,
              password: password,
              role: 2
            }
            this.postUserData = obj;
            this.authService.addToDB(this.postUserData).subscribe((dt:any)=>{this.errorMsg=''})
            this.errorMsg='';
            this.onSwitchMode();
          },
          error: error =>{
            this.isLoading=false;
            console.log(error);
            this.errorMsg = error;
            this.alerts = [{
              type: 'danger',
              msg: this.errorMsg,
              timeout: 2000
            }];
          }
        })
      }

      authForm.reset();
    }

    onClosed(dismissedAlert: AlertComponent): void {
      this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
    }
}
