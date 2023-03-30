import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { getAuth, deleteUser } from 'firebase/auth';


import { Projects } from '../services/projects'
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  Delete(user: any) {
   console.log(user)
    user.delete().then(() => {
      console.log(' deleted');
    }).catch((error: Error) => {
      console.log('not deleted');
    });
  }


  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData2(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            console.log("hello")
            this.router.navigate(['home-component']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Sign up with email/password
  SignUp(email: string, password: string, userName: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        //this.SendVerificationMail();
        this.SetUserData(result.user, userName);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['home-component']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Returns true when user is logged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null ? true : false;
    // return user !== null && user.emailVerified !== false ? true : false;

  }

  /* Setting up user data when sign in with username/password */
  SetUserData(user: any, userName: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    // creating an empty array of tasks for a single project
    const project = {tasks: []}
    // creating a user of type User (an interface defined in this project)
    const userData: User = {
      uid: user.uid,
      email: user.email,
      projects: [project],
      displayName: userName,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  SetUserData2(user: any) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(
        `users/${user.uid}`
      );
      const userData: User = {
        uid: user.uid,
        email: user.email
      };
      console.log("Here");
      return userRef.set(userData, {
        merge: true,
      });
    }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}
