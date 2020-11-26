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

  public userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http:HttpClient,private router: Router,) {
    this.refreshSubject();
  }

  public refreshSubject(){
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();    
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  async login(data:any){

    const res:any = await this.http.post(`${environment.apiUrl}/user/login`, data).toPromise(); 

    if(res.user != null){
      if(res.user.username && res.user.password){
        localStorage.setItem('user', JSON.stringify(res.user));
        this.userSubject.next(res.user);
      }
    }
    return res.user;
  }

  logout(){
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    console.log("Cerrar Sesion");
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
  
}
