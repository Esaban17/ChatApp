import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  date: Date;
  userLogged:User;
  constructor(private authenticationService:AuthenticationService) { 
    setInterval(() => {
      this.date = new Date()
    }, 1000)
    this.authenticationService.user.subscribe(x => this.userLogged = x);
  }

  ngOnInit(): void {
  }

}
