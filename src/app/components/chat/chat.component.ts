import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from '../../models/user';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact';
import { Invitation } from 'src/app/models/invitation';
import { InvitationService } from 'src/app/services/invitation.service';
import { ChatModel } from '../../models/message';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  friend:string;
  message:string;
  userLogged:User;
  contacts: Contact[] = [];
  invitations: Invitation[] = [];
  chatModel: ChatModel = new ChatModel();
  currentChatMessages: ChatModel[] = [];
  chatSelected:boolean = false;
  empty: boolean = false;

  constructor(
    private contactService: ContactService,
    private chatService: ChatService,
    private authenticationService: AuthenticationService,
    private invitationService: InvitationService
  ) { 
    this.loadScript('assets/vendors/jquery/jquery-3.5.0.min.js');
    this.loadScript('assets/vendors/bootstrap/bootstrap.bundle.min.js');
    this.loadScript('assets/vendors/magnific-popup/jquery.magnific-popup.min.js');
    this.loadScript('assets/vendors/svg-inject/svg-inject.min.js');
    this.loadScript('assets/vendors/modal-stepes/modal-steps.min.js');
    this.loadScript('assets/vendors/emojione/emojionearea.min.js');
    this.loadScript('assets/js/app.js');

    this.chatService.createConnection();
    this.authenticationService.user.subscribe(x => this.userLogged = x);
  }

  ngOnInit(): void {
    this.chatService.start().then(() => {
      this.chatService.singleConnect(this.userLogged.username);
    });
    // document.querySelector('.chat-finished').scrollIntoView({
    //   block: 'end',               // "start" | "center" | "end" | "nearest",
    //   behavior: 'auto'          //"auto"  | "instant" | "smooth",
    // });
    this.chatSelected = false;
    this.getMessages();   
    this.getContacts();
    this.getInvitations();
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

  getChatMessages(){
    this.currentChatMessages = [];

    if(this.friend != null){
      this.chatService.getCurrentMessages(this.userLogged.username, this.friend).then((res: ChatModel[]) =>{
        this.currentChatMessages = res;
        this.chatSelected = true;
      });
    }
  }

  async getContacts(){
    this.contacts = [];
    
    let res: Contact[] = await this.contactService.getContacts(this.userLogged.username);
    if(res != null){
      this.contacts = res;
    }
  }

  async getInvitations(){
    this.invitations = [];

    let res: Invitation[] = await this.invitationService.getInvitations(this.userLogged.username);
    if(res != null){
      this.invitations = res;
    }
  }

  async acceptOrDecline(action: boolean, invitation: Invitation){

    if (action) {
      invitation.status = "accepted";
    }else{
      invitation.status = "declined"
    }

    this.invitationService.acceptOrDecline(invitation).then((res:any) => {
      this.getContacts();
      this.getInvitations();
    });

  }

  sendPrivate(){

    this.chatModel.sender = this.userLogged.username;
    this.chatModel.receiver = this.friend;
    this.chatModel.message = this.message;

    this.chatService.sendPrivate(this.chatModel).then((res:any) => {
      console.log("Mensaje Privado Enviado");
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

  logout() {
    this.authenticationService.logout();
  }

  selectChat(username:string){
    this.friend = username;
    this.getChatMessages();
  }

  public loadScript(url: string) {
    const body = document.body as HTMLInputElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

}
