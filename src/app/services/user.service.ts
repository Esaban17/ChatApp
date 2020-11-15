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

  async getUser(idUser: string){
    return await this.http.get<User>(this.url + '/user/' + idUser, { headers: this.setHeaders() }).toPromise();
  }

  async getUsers(){
    return await this.http.get<User[]>(this.url + '/user', { headers: this.setHeaders() }).toPromise();
  }

  async register(data:any) {
    return await this.http.post(this.url + '/user', data, { headers: this.setHeaders() }).toPromise();
  }

  setHeaders() {
    this.headers.append('Content-Type', 'application/json');
    return this.headers;
  }

}

