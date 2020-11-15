import { environment } from './../../environments/environment';
import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';          // import signalR
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ChatModel } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // mapping to the chathub as in startup.cs
  private  connection: signalR.HubConnection;

  private receivedMessageObject: ChatModel = new ChatModel();
  private sharedObj = new Subject<ChatModel>();
  private headers = new HttpHeaders();
  url = environment.apiUrl;

  constructor(private http: HttpClient) { 
    // this.connection.onclose(async () => {
    //   await this.start();
    // });
    // this.connection.on("sendToAll", (sender:string, receiver:string, message:string) => { this.getLastMessage(sender, receiver, message); });
    // this.connection.on("sendPrivate", (sender:string, receiver:string, message:string) => { this.getLastMessage(sender, receiver, message); });
    // this.start(); 
  }

  public createConnection(){
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:44363/socket")
    .configureLogging(signalR.LogLevel.Information)
    .build();
  }

  // Strart the connection
  public async start() {
    try {
      this.connection.on("sendToAll", (sender:string, receiver:string, message:string) => { this.getLastMessage(sender, receiver, message); });
      this.connection.on("sendPrivate", (sender:string, receiver:string, message:string) => { this.getLastMessage(sender, receiver, message); });

      await this.connection.start();
      console.log("connected");
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    } 
  }

  public singleConnect(username:string){
    this.connection.invoke("Connect", username).then((res:any) => {
      console.log("Connection ID: " + res);
    }).catch(err => {
      console.log(err);
    });
  }

  public getLastMessage(sender: string, receiver: string, message:string): void {
    this.receivedMessageObject.sender = sender;
    this.receivedMessageObject.receiver = receiver;
    this.receivedMessageObject.message = message;
    this.sharedObj.next(this.receivedMessageObject);
  }

  public sendToAll(data: any) {
    return this.http.post(this.url + "/chat/send/all", data, { headers: this.setHeaders() } ).toPromise();
  }

  public sendPrivate(data: any){
    return this.http.post(this.url + "/chat/send/private", data, { headers: this.setHeaders() } ).toPromise();
  }

  public getMessages(): Observable<ChatModel> {
    return this.sharedObj.asObservable();
  }

  async getCurrentMessages(sender:string,receiver:string){
    return await this.http.get<ChatModel[]>(`${this.url}/chat/${sender}/${receiver}` , { headers: this.setHeaders() }).toPromise();
  }
  
  setHeaders() {
    this.headers.append('Content-Type', 'application/json');
    return this.headers;
  }

}
