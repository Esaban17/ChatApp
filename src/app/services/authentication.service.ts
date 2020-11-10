import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http:HttpClient,private router: Router,) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  async login(data:any){

    const user:any = await this.http.post(`${environment.apiUrl}/user/login`, data).toPromise(); 
    
    if(user.username && user.password){
      localStorage.setItem('admin', JSON.stringify(user.result));
      this.userSubject.next(user.result);
    }
    return user;
    
    // return this.http.post(`${environment.apiUrl}/administrator/authenticate`, data).pipe(map(admin => {
    //   // login successful if there's a jwt token in the response
    //   if(admin && admin.token) {
    //     // store admin details and jwt token in local storage to keep user logged in between page refreshes
    //     localStorage.setItem('currentAdmin', JSON.stringify(admin));
    //     this.currentAdminSubject.next(admin);
    //   }
    //   return admin;
    // }));
  }

  logout(){
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    console.log("Cerrar Sesion");
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
  
}
