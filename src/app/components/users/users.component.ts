import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { InvitationService } from 'src/app/services/invitation.service';
import { Invitation } from 'src/app/models/invitation';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {

  urlApi = environment.apiUrl;
  userLogged:User;
  users: User[] = [];
  filterUsers: User[] = [];
  searched:string;

  constructor(
    private userService: UserService,
    private authenticationService:AuthenticationService,
    private invitationService: InvitationService    
    ) { 
    this.authenticationService.user.subscribe(x => this.userLogged = x);
  }

  ngOnInit(): void {
    this.getUsers();
  }

  async getUsers(){
    this.users = [];
    this.filterUsers = [];

    this.userService.getUsers().then((res: User[]) =>{
      if(res != null){
        this.users = res;
        this.filterUsers = res;
      }
    });

  }

  searchUsers() {
    this.filterUsers = this.users;
    const list: User[] = [];
    if (this.searched !== '') {
      for (const element of this.filterUsers) {
        if (element.username.toLocaleLowerCase().indexOf(this.searched.toLocaleLowerCase()) > -1) {
          list.push(element);
          this.filterUsers = list;
        }else {
          if (list.length == 0) {
            this.filterUsers = [];
          }
        }
      }
    }else{
      this.filterUsers = [];
      this.getUsers();
    }
  }

  public GetImage(photo:string){
    return `${this.urlApi}/user/image/${photo}`;
  }

  async addFriend(friend:User){

    let newInvitation: Invitation = {
      id: null,
      sender: this.userLogged.username,
      receiver: friend.username,
      status: "sent"
    }

    let res = await this.invitationService.sendInvitation(newInvitation);

    if (res != null) {
      console.log("Solicitud enviada");
    }

  }

}
