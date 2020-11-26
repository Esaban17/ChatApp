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

  async getUserByUsername(username: string){
    return await this.http.get<User>(this.url + '/user/username/' + username, { headers: this.setHeaders() }).toPromise();
  }

  async getUserById(id: string){
    return await this.http.get<User>(this.url + '/user/' + id, { headers: this.setHeaders() }).toPromise();
  }

  async getUsers(){
    return await this.http.get<User[]>(this.url + '/user', { headers: this.setHeaders() }).toPromise();
  }

  async register(data:any) {
    return await this.http.post(this.url + '/user', data, { headers: this.setHeaders() }).toPromise();
  }

  async uploadImage(id:string, file:any){
    let formData = new FormData();
    formData.append('file', file);
    return await this.http.post(this.url + '/user/upload/' + id, formData).toPromise();
  }

  setHeaders() {
    this.headers.append('Content-Type', 'application/json');
    return this.headers;
  }

}

