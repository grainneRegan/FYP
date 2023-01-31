import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'home-component', component: HomeComponent},
  { path: 'sign-up-component', component: SignUpComponent},
  { path: '**', component: LoginComponent},
]; // sets up routes constant where you define your routes

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
