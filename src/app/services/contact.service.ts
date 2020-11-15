import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  url = environment.apiUrl;
  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  async getContact(idContact: string){
    return await this.http.get<Contact>(this.url + '/contact/' + idContact, { headers: this.setHeaders() }).toPromise();
  }

  async getContacts(userLogged: string){
    return await this.http.get<Contact[]>(this.url + '/contact/' + userLogged, { headers: this.setHeaders() }).toPromise();
  }

  async createContact(newContact:any) {
    return await this.http.post(this.url + '/contact', newContact, { headers: this.setHeaders() }).toPromise();
  }

  setHeaders() {
    this.headers.append('Content-Type', 'application/json');
    return this.headers;
  }
  
}
