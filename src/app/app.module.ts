import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//HTTP CLIENT
import { HttpClientModule } from '@angular/common/http';

//ROUTING
import { AppRoutingModule } from './app-routing.module';

//COMPONENTS
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChatComponent } from './components/chat/chat.component';
import { UsersComponent } from './components/users/users.component';

//LIBRARy
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DemoComponent } from './components/demo/demo.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ChatComponent,
    UsersComponent,
    DemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SweetAlert2Module.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
