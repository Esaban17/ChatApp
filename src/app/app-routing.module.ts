import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatComponent } from './components/chat/chat.component';
import { LoginGuard } from './guards/login.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'chat', component: ChatComponent, canActivate: [LoginGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [LoginGuard] },
  { path: 'users', component: UsersComponent, canActivate: [LoginGuard] },
  // { path: 'statistics/:idModule', loadChildren: () => import('./components/statistics/statistics.module').then(mod => mod.StatisticsModule) },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
