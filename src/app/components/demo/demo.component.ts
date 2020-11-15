import { Component, OnInit } from '@angular/core';
import { ChatModel } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  userLogged:User;
  chatModel: ChatModel = new ChatModel();
  currentChatMessages: ChatModel[] = [];

  constructor(
    private chatService: ChatService,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe(x => this.userLogged = x);
  }

  ngOnInit(): void {
    // calls the service method to get the new messages sent  
    this.chatService.start().then(() => {
      this.chatService.singleConnect(this.userLogged.username);
    });
    this.getMessages();      
  }

  getMessages(){
    this.currentChatMessages = [];
    
    this.chatService.getMessages().subscribe( (res: ChatModel) => {
      let newObj = new ChatModel();
      newObj.sender = res.sender;
      newObj.receiver = res.receiver;
      newObj.message = res.message;
      this.currentChatMessages.push(newObj);
    });  
  }

  sendToAll() {
    
    this.chatModel.receiver = "All";

    if(this.chatModel) {
      if(this.chatModel.sender.length == 0 || this.chatModel.sender.length == 0){
        window.alert("Los campos son requeridos");
        return;
      } else {
        this.chatService.sendToAll(this.chatModel).then((res:any) => {
          console.log("Mensaje General Enviado");
        });
      }
    }
  }

  sendPrivate(){

    this.chatModel.receiver = "Veinti-1";

    if(this.chatModel) {
      if(this.chatModel.sender.length == 0 || this.chatModel.sender.length == 0){
        window.alert("Los campos son requeridos");
        return;
      } else {
        this.chatService.sendPrivate(this.chatModel).then((res:any) => {
          console.log("Mensaje Privado Enviado");
        });
      }
    }
  }

}
