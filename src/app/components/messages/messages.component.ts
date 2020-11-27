import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';
import { ChatModel } from '../../models/message';
import { ChatService } from '../../services/chat.service';
import { Contact } from '../../models/contact';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MessagesComponent implements OnInit {

  urlApi = environment.apiUrl;
  userLogged:User;

  contacts: Contact[] = [];
  messages: ChatModel[] = [];
  filterMessages: ChatModel[] = [];
  filterContacts: Contact[] = [];
  searched:string;

  constructor(
    private chatService: ChatService,
    private authenticationService:AuthenticationService,
    private contactService: ContactService
    ) { 
    this.authenticationService.user.subscribe(x => this.userLogged = x);
  }

  ngOnInit(): void {
    this.getContacts();
  }

  async getMessages(){
    this.messages = [];

    for (const item of this.contacts) {
      this.chatService.getCurrentMessages(this.userLogged.username,item.friend.username,this.userLogged.code).then((res: ChatModel[]) =>{
        if(res != null){
          this.messages = this.messages.concat(res);
        }
      });
    }
  }

  async getContacts(){
    this.contacts = [];
    
    let res: Contact[] = await this.contactService.getContacts(this.userLogged.username);
    if(res != null){
      this.contacts = res;
      await this.getMessages();
    }
  }

  searchMessage() {
    this.filterMessages = this.messages;
    const list: ChatModel[] = [];
    if (this.searched !== '' && this.searched !== undefined) {
      for (const element of this.filterMessages) {
        if (element.message.toLowerCase().indexOf(this.searched.toLowerCase()) > -1) {
          list.push(element);
          this.filterMessages = list;
        }else {
          if (list.length == 0) {
            this.filterMessages = [];
          }
        }
      }
    }else{
      this.filterMessages = [];
    }
  }

  public GetImage(photo:string){
    return `${this.urlApi}/user/image/${photo}`;
  }
}
