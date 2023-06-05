import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, defer, distinctUntilChanged, map, merge, Observable, of, startWith } from 'rxjs';
import { UserData } from '../model/auth';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  isLoading:boolean = false;
  alertMsg:string = '';
  userData: any;
  public areMinimumCharactersTyped$: Observable<boolean>| undefined;
  public searchControl!: FormControl;
  temp: any;
  userDataTemp: any;
  alertMsgDel:any='';
  dataToBeDeleted:any=[];

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router){}

  ngOnInit(): void {
    this.searchControl = this.formBuilder.control("");
    this.areMinimumCharactersTyped$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((searchString) => searchString.length >= 0)
    );

    const searchString$ = merge(
      defer(() => of(this.searchControl.value)),
      this.searchControl.valueChanges
    ).pipe(debounceTime(300), distinctUntilChanged());
    this.isLoading = true;

    this.authService.fetchUser().subscribe((data:any)=>{
      this.userData= data.user;

      this.isLoading = false;
      for(let i =0;  i<this.userData.length; i++){
        if(this.userData[i].role == 1) this.userData[i].roleStatus = 'Admin';
        else if(this.userData[i].role == 2) this.userData[i].roleStatus = 'User';
      }
      this.userDataTemp = this.userData
      console.log(this.userData)
    })

    searchString$.subscribe(value => {
      this.userData = [];
      this.temp = this.userDataTemp.filter((data:any) => {
        if (data.email.toLowerCase().includes(value.toLowerCase())) {
          this.userData.push(data);
        }
      })
    })
  }

  delUser(data:any){
    this.dataToBeDeleted = data;
    console.log(data);
  }

  deleteUser(id:any){
    this.isLoading = true;
    this.authService.deleteUser(id).subscribe((data:any)=>{
      this.alertMsgDel = 'User has been deleted'
      setTimeout(()=>{window.location.reload}, 2000)
      this.isLoading = false;
      const closeModal = document.getElementById('closeDeleteUserModal');
      closeModal?.click();
    })
  }

}
