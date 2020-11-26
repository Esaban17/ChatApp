import { environment } from './../../../environments/environment.prod';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  
  selectedImage: File;
  urlApi = environment.apiUrl;
  date: Date;
  userLogged:User;
  
  constructor(
    private authenticationService:AuthenticationService,
    private userService: UserService
  ) { 
    setInterval(() => {
      this.date = new Date()
    }, 1000)
    this.authenticationService.user.subscribe(x => this.userLogged = x);
  }

  ngOnInit(): void {
  }

  getUsuario(){
    this.userService.getUserById(this.userLogged.id).then((res:any) => {
      localStorage.setItem('user', JSON.stringify(res.user));
      this.authenticationService.refreshSubject();
      this.authenticationService.user.subscribe(x => this.userLogged = x);
    });
  }

  public GetImage(photo:string){
    return `${this.urlApi}/user/image/${photo}`;
  }

  onImageSelected($event:any){
    this.selectedImage = $event.target.files[0];
  }

  uploadImage(){
    if(this.selectedImage != null){
      this.userService.uploadImage(this.userLogged.id,this.selectedImage).then(() => {       
        this.getUsuario();
      }).catch(error => {
          console.error(error);
      });
    }else{
      alert("Selecciona una imagen");
    }
  }

}
