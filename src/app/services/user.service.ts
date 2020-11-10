import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl;

  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  getUser(idUser: string){
    return this.http.get<User>(this.url + '/user/' + idUser, { headers: this.setHeaders() }).toPromise();
  }

  getUsers(){
    return this.http.get<User[]>(this.url + '/user', { headers: this.setHeaders() }).toPromise();
  }

  register(data:any) {
    console.log(data);
    return this.http.post(this.url + '/user', data, { headers: this.setHeaders() }).toPromise();
  }

  setHeaders() {
    this.headers.append('Content-Type', 'application/json');
    return this.headers;
  }

}

