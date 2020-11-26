import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';          // import signalR
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  }

  public createConnection(){
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl("http://c9ebd59064a9.ngrok.io/socket")
    .configureLogging(signalR.LogLevel.Information)
    .build();
  }

  // Strart the connection
  public async start() {
    try {
      this.connection.on("sendPrivate", (id:string,sender:string,receiver:string,message:string,date:string,isFile:boolean,fileName:string) => { 
        this.getLastMessage(id,sender, receiver, message,date,isFile,fileName); 
      });
      this.connection.on("sendFile", (id:string,sender:string, receiver:string, message:string,date:string,isFile:boolean,fileName:string) => { 
        this.getLastMessage(id,sender, receiver, message,date,isFile,fileName); 
      });

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

  public getLastMessage(id:string, sender: string, receiver: string, message:string,date:string,isFile:boolean, fileName:string): void {
    this.receivedMessageObject.id = id;
    this.receivedMessageObject.sender = sender;
    this.receivedMessageObject.receiver = receiver;
    this.receivedMessageObject.message = message;
    this.receivedMessageObject.date = date;
    this.receivedMessageObject.isFile = isFile;
    this.receivedMessageObject.fileName = fileName;
    this.sharedObj.next(this.receivedMessageObject);
  }

  public sendPrivate(data:any,senderCode:number){
    return this.http.post(`${this.url}/chat/send/private/${senderCode}`, data, { headers: this.setHeaders() } ).toPromise();
  }

  async sendFile(data:ChatModel,senderCode:number,file:any){
    let formData = new FormData();
    formData.append('chat', JSON.stringify(data));
    formData.append('file', file);
    formData.append('senderCode', senderCode.toString())
    return await this.http.post(`${this.url}/chat/send/private/file`, formData).toPromise();
  }

  public getMessages(): Observable<ChatModel> {
    return this.sharedObj.asObservable();
  }

  async getCurrentMessages(sender:string,receiver:string, senderCode:number){
    return await this.http.get<ChatModel[]>(`${this.url}/chat/${sender}/${receiver}/?senderCode=${senderCode}`, { headers: this.setHeaders() }).toPromise();
  }

  downloadFile(id:string, senderCode:number): Observable<Blob>{
    return this.http.get(`${this.url}/chat/${id}/download/?senderCode=${senderCode}`, {
      responseType: 'blob'
    });
  }
  
  setHeaders() {
    this.headers.append('Content-Type', 'application/json');
    return this.headers;
  }

}
