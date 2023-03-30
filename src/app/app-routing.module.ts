import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './login/login.component';
import { ProjectListComponent } from './project-list/project-list.component'
import { ProfileComponent } from './profile/profile.component'
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/sign_in', pathMatch: 'full' },
  { path: 'sign-in', component: LogInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'project-list', component: ProjectListComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'home-component', component: HomeComponent, canActivate: [AuthGuard]},
  { path: '**', component: LogInComponent},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
