import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from '../../models/user';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact';
import { Invitation } from 'src/app/models/invitation';
import { InvitationService } from 'src/app/services/invitation.service';
import { ChatModel } from '../../models/message';
import { ChatService } from '../../services/chat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  searched:string;
  message:string;
  selectedFile: File = null;
  userLogged:User;
  friend:User;
  filterContacts: Contact[] = [];
  contacts: Contact[] = [];
  invitations: Invitation[] = [];
  chatModel: ChatModel = new ChatModel();
  currentChatMessages: ChatModel[] = [];
  chatSelected:boolean = false;
  isFile:boolean = false;
  urlApi = environment.apiUrl;

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
      newObj.isFile = res.isFile;
      newObj.fileName = res.fileName
      this.currentChatMessages.push(newObj);
    });  
  }

  getChatMessages(){
    this.currentChatMessages = [];

    if(this.friend != null){
      this.chatService.getCurrentMessages(this.userLogged.username, this.friend.username, this.userLogged.code).then((res: ChatModel[]) =>{
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
      this.filterContacts = res;
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

  onFileSelected($event:any){
    this.selectedFile = $event.target.files[0];
    this.isFile = true;
    this.message = "Archivo: " + this.selectedFile.name;
  }

  sendPrivate(){

    this.chatModel.sender = this.userLogged.username;
    this.chatModel.receiver = this.friend.username;

    if(this.selectedFile != null){
      this.chatModel.message = "";
      this.chatModel.isFile = true;
      this.chatService.sendFile(this.chatModel,this.userLogged.code,this.selectedFile).then((res:any) => {
        this.message = "";
        this.selectedFile = null;
        this.isFile = false;
      });
    }else{
      this.chatModel.message = this.message;
      this.chatModel.isFile = false;
      this.chatService.sendPrivate(this.chatModel,this.userLogged.code).then((res:any) => {
        this.message = "";
      });
    }
  }

  logout() {
    this.authenticationService.logout();
  }

  selectChat(item:User){
    this.friend = item;
    this.getChatMessages();
  }

  downloadFile(item:ChatModel){
    this.chatService.downloadFile(item.id, this.userLogged.username, this.userLogged.code).subscribe(blob => {
      const a = document.createElement('a');
      const objectURL = URL.createObjectURL(blob);
      a.href = objectURL;
      a.download = item.fileName;
      a.click();
      URL.revokeObjectURL(objectURL);
    });
  }

  GetImage(username:string){
    return `${this.urlApi}/user/image/${username}`;
  }

  searchContacts() {
    this.filterContacts = this.contacts;
    const list: Contact[] = [];
    if (this.searched !== '' && this.searched !== undefined) {
      for (const element of this.filterContacts) {
        if (element.friend.username.toLocaleLowerCase().indexOf(this.searched.toLocaleLowerCase()) > -1) {
          list.push(element);
          this.filterContacts = list;
        }else {
          if (list.length == 0) {
            this.filterContacts = [];
          }
        }
      }
    }else{
      this.filterContacts = [];
      this.getContacts();
    }
  }

  public loadScript(url: string) {
    const body = document.body as HTMLInputElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

}
