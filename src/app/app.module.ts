import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { LogInComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

// Firebase services + environment module
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { AuthService } from "./shared/services/auth.service";

//imports for calendar
import { FullCalendarModule } from '@fullcalendar/angular';
import { ProjectListComponent } from './project-list/project-list.component';
import { UserOperationsComponent } from './user-operations/user-operations.component';

import { FormsModule } from '@angular/forms';
import { UserUpdateComponent } from './user-update/user-update.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    HomeComponent,
    LogInComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    ProjectListComponent,
    UserOperationsComponent,
    UserUpdateComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AppRoutingModule,
    FullCalendarModule,
    FormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
