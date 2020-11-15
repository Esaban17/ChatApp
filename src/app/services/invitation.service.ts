import { Invitation } from './../models/invitation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  url = environment.apiUrl;

  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  async getInvitation(idInvitation: string){
    return await this.http.get<Invitation>(this.url + '/invitation/' + idInvitation, { headers: this.setHeaders() }).toPromise();
  }

  async getInvitations(userLogged: string){
    return await this.http.get<Invitation[]>(this.url + '/invitation/' + userLogged, { headers: this.setHeaders() }).toPromise();
  }

  async sendInvitation(data:any) {
    return await this.http.post(this.url + '/invitation', data, { headers: this.setHeaders() }).toPromise();
  }

  async acceptOrDecline(data:any) {
    return await this.http.post(this.url + '/invitation/action', data, { headers: this.setHeaders() }).toPromise();
  }

  setHeaders() {
    this.headers.append('Content-Type', 'application/json');
    return this.headers;
  }
  
}
