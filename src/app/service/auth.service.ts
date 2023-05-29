import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AuthRequestData, AuthResponseData } from "../interface/auth";
import { User } from '../interface/user.model';

enum UserRole{
        Admin = 1,
   NormalUser = 2,
        Guess = 3,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData:any;
  userRole:UserRole;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

    signup(authRequestData: AuthRequestData){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAXvJ2n9WpHRiUGoHV9mR-XndXnv3EgMxU',
        {
            email:authRequestData.email,
            password: authRequestData.password,
            returnSecureToken: authRequestData.secureToken
        }
        )
        .pipe(
            catchError(this.handleError),
            tap( resData => {
                this.handleAuthentication(resData.email, resData.localId
                    , resData.idToken, +resData.expiresIn)
            })
        );
    }

    login(authRequestData: AuthRequestData){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAXvJ2n9WpHRiUGoHV9mR-XndXnv3EgMxU',
            {
                email:authRequestData.email,
                password: authRequestData.password,
                returnSecureToken: authRequestData.secureToken
            }
        ).pipe(
            catchError(this.handleError),
            tap( resData => {
                this.handleAuthentication(resData.email, resData.localId
                    , resData.idToken, +resData.expiresIn)
            })
        );
    }

  private handleError(errorRes: HttpErrorResponse){
      let errorMsg = "An unknow error occured!"
      if(!errorRes.error || !errorRes.error.error){
          return throwError(errorMsg);
      }
      switch (errorRes.error.error.message){
          case 'EMAIL_EXISTS':
              errorMsg = 'This email exists already';
              break;
          case 'OPERATION_NOT_ALLOWED':
              errorMsg = 'Password sign-in is disabled for this project';
              break;
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
              errorMsg = 'We have blocked all requests from this device due to unusual activity. Try again later';
              break;
          case 'EMAIL_NOT_FOUND':
              errorMsg = 'There is no user record corresponding to this identifier. The user may have been deleted';
              break;
          case 'INVALID_PASSWORD':
              errorMsg = 'The password is invalid or the user does not have a password';
              break;
          case 'USER_DISABLED':
              errorMsg = 'The user account has been disabled by an administrator';
              break;
          default:
              break;
      }
      return throwError(errorMsg);
  }

  private handleAuthentication(email: string, localId: string, token: string, expiresIn: number){
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      const user:any = new User(email, localId, token, expirationDate);
      this.userData = user;
      this.autoLogout(expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('isLogin', '1');
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer =
    setTimeout(() => {
        this.logout();
    }, expirationDuration);
  }

  logout(){
    this.userData='';
    this.router.navigate(['/']);
    localStorage.removeItem('userData')
    if(this.tokenExpirationTimer){
        clearTimeout(this.tokenExpirationTimer)
    }
    this.userRole=UserRole.Guess;
    this.tokenExpirationTimer = null;
  }
}
