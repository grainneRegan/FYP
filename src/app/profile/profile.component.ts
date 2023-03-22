import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { User } from '../shared/services/user';
import { ProjectsService } from '../shared/services/projects.service';
import { map } from 'rxjs/operators';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthService } from '../shared/services/auth.service';
import { Projects} from "../shared/services/projects";
import { Tasks } from '../shared/services/task';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

 @Input() user: User = new User();
     submitted = false;
     currentUser2?: User;
     currentIndex = -1;
     title = '';
     auth = getAuth();
     currentDisplayName?: any;
     currentEmail?: any;
     arrayProjects: Projects[] = [];
     numberCompletedTasks: any;
     numberTasks: any = 0;
     percentageCompleted: any;
     //from authService


     constructor(private projectsService: ProjectsService, public authService: AuthService) { }

     async ngOnInit(): Promise<void> {
       // Get all users
       this.onAuthStateChanged();
       console.log('retrieveUsers called');
       await this.retrieveDisplayNameAndProjects();
       console.log(this.arrayProjects);
       this.numberTasks = this.numberOfTasks();
       this.numberOfCompletedTasks();
       this.percentCompleted();
     }


    ngOnChanges(): void{
      this.onAuthStateChanged();
      this.testItem();
    }

 //     get all users
     refreshList(): void {
       this.currentUser2 = undefined;
       this.currentIndex = -1;
     }

       async retrieveDisplayNameAndProjects(): Promise<void> {
         const user2 = localStorage.getItem('user');
         if (user2 !== null) {
           const parsedUser = JSON.parse(user2);
           const uid = parsedUser.uid;

           return new Promise<void>((resolve) => {
             this.projectsService.getAll().snapshotChanges().pipe(
               map(changes =>
                 changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() })),
               ),
               map(users => users.find(user => user.id === uid))
             ).subscribe(user => {
               if (user) {
                 this.currentDisplayName = user.displayName || '';
                 this.currentEmail = user.email || '';
                 this.arrayProjects = user.projects || [];
               } else {
                 this.currentDisplayName = '';
                 this.currentEmail = '';
                 this.arrayProjects = [];
               }
               resolve();
             });
           });
         } else {
           this.currentDisplayName = '';
           this.currentEmail = '';
           this.arrayProjects = [];
           return Promise.resolve();
         }
       }

      deleteProfile() {
        const user2 = this.auth.currentUser;
        if (user2 !== null) {
          this.authService.Delete(user2);
        }
      }

      percentCompleted() {
        this.percentageCompleted = Math.round((this.numberCompletedTasks/this.numberTasks)*100);
      }

      numberOfTasks() {
        console.log('herrrrrrrere', this.arrayProjects);
        return this.arrayProjects.length - 1;
      }

      numberOfCompletedTasks() {
        this.numberCompletedTasks = 0;
        for (const project of this.arrayProjects) {
          console.log('see if true',project.completed)
          if (project.completed) {
            this.numberCompletedTasks++;
          }
        }
      }


      testItem() {
       const user2 = this.auth.currentUser;
       const uid = user2?.uid;
       console.log("this.currentUser.uid", uid )

       if (uid) {
        console.log('valid user')
       }
     }

       getUsers(): any {
         const user2 = this.auth.currentUser;
         const uid = user2?.uid;
         this.projectsService.getUser(uid).then((result) => {
           console.log('result', result)
         });
       }

       setActiveUser(user: User, index: number): void {
         this.currentUser2 = user;
         this.currentIndex = index;
       }

 //       saveData(uid: string, projects: any): any{
 //        return projectsObject = projects;
 //       }

 //  Create new user
     saveUser(): void {
       this.projectsService.create(this.user).then(() => {
         console.log('Created new item successfully!');
         this.submitted = true;
       });
     }

     newUser(): void {
       this.submitted = false;
       this.user = new User();
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
