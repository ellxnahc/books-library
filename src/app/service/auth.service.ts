import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap, map } from "rxjs/operators";
import { AuthRequestData, AuthResponseData, UserData, UserDataArray } from "../model/auth";
import { User } from '../model/user.model';

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
  endPointURL: string = 'https://library-management-9c253-default-rtdb.asia-southeast1.firebasedatabase.app/';
  userUrl: string = this.endPointURL + 'user.json';
  postUserData: UserData;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

    signup(authRequestData: AuthRequestData){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDGkxMOJ19OJ25UeDxAFHn0kU-c3LTk8a4',
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
                    , resData.idToken, +resData.expiresIn, 'signup')
            })
            );
    }

    addToDB(data: UserData){
        return this.http.post(this.userUrl, data);
    }

    login(authRequestData: AuthRequestData){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDGkxMOJ19OJ25UeDxAFHn0kU-c3LTk8a4',
            {
                email:authRequestData.email,
                password: authRequestData.password,
                returnSecureToken: authRequestData.secureToken
            }
        ).pipe(
            catchError(this.handleError),
            tap( resData => {
                this.handleAuthentication(resData.email, resData.localId
                    , resData.idToken, +resData.expiresIn, 'signin')
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

  private handleAuthentication(email: string, localId: string, token: string, expiresIn: number, action:string){
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      const user:any = new User(email, localId, token, expirationDate);
      this.userData = user;
      this.autoLogout(expiresIn * 1000);
      if(action==='signin') localStorage.setItem('userData', JSON.stringify(user));
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

  fetchUser() {
    return this.http.get<{ [key: string]: UserData }>(this.userUrl).pipe
      (map(responseData => {
        let postArray: UserDataArray = { user: [] };
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.user.push({ ...responseData[key], id: key })
          }
        }
        return postArray;
      }))
  }
}
