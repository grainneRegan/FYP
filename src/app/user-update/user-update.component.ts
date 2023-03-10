import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { User } from '../shared/services/user';
import { ProjectsService } from '../shared/services/projects.service';
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  @Input() user?: User;
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentUser: User = {
    email: '',
    uid: ''
  };
  email = '';
  message = '';
  submitted = false;
  auth = getAuth();

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.onAuthStateChanged();
    this.message = '';
  }

  ngOnChanges(): void {
    this.message = '';
    this.currentUser = { ...this.user };
  }

  updateEmail(newEmail: string): void {
      const user2 = this.auth.currentUser;
      const uid = user2?.uid;
      console.log("this.currentUser.uid", uid )
      if (uid) {

        this.projectsService.update(uid, { diplayName: newEmail })
        .then(() => {
          updateProfile(user2! , { displayName: newEmail })
            .then(() => {
              this.message = 'The status was updated successfully!';
              this.submitted = true;
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
      }
  }

  updateUser(): void {
    console.log("email", this.currentUser.email, this.currentUser.uid)
    const data = {
      email: this.currentUser.email,
      uid: this.currentUser.uid
    };

    if (this.currentUser.uid) {
      this.projectsService.update(this.currentUser.uid, data)
        .then(() => this.message = 'The tutorial was updated successfully!')
        .catch(err => console.log(err));
    }
  }

  deleteUser(): void {
    const user2 = this.auth.currentUser;
    const uid = user2?.uid;
    console.log("Inside method", uid)
      if (uid) {
        this.projectsService.delete(uid)
          .then(() => {
            this.refreshList.emit();
            this.message = 'The tutorial was deleted successfully!';
          })
          .catch(err => console.log(err));
    }
  }

  onAuthStateChanged(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }
}
