export class AuthRequestData{
    email: string;
    password: string;
    secureToken: boolean; 
  
  
    constructor(object?: any) {
      if (object) {
        if(object.email) this.email = object.email;
        if(object.password) this.password = object.password;
        if(object.secureToken) this.secureToken = object.secureToken;
        for (var prop in object) {
          prop = object[prop];
        }
      }
  
    }
}

export class AuthResponseData{
  idToken: string;
  email: string; 
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;

  constructor(object?: any){
    if (object) {
      if(object.idToken) this.idToken = object.idToken;
      if(object.email) this.email = object.email;
      if(object.refreshToken) this.refreshToken = object.refreshToken;
      if(object.expiresIn) this.expiresIn = object.expiresIn;
      if(object.localId) this.localId = object.localId;
      if(object.registered) this.registered = object.registered;
      for (var prop in object) {
        prop = object[prop];
      }
    }

  }
}

export class UserData{
  id: string;
  email: string;
  password: string;
  role: number

  constructor(object?: any){
    if (object) {
      if(object.id) this.id = object.id;
      if(object.email) this.email = object.email;
      if(object.password) this.password = object.password;
      if(object.role) this.role = object.role;
      for (var prop in object) {
        prop = object[prop];
      }
    }
  }
}

export interface UserDataArray {
  user: UserData[]
}