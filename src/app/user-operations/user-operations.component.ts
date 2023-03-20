import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { User } from '../shared/services/user';
import { ProjectsService } from '../shared/services/projects.service';
import { map } from 'rxjs/operators';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthService } from '../shared/services/auth.service';


@Component({
  selector: 'app-user-operations',
  templateUrl: './user-operations.component.html',
  styleUrls: ['./user-operations.component.css']
})
export class UserOperationsComponent implements OnInit {
//   Get all users
  @Input() user: User = new User();
    submitted = false;
    currentUser2?: User;
    currentIndex = -1;
    title = '';
    auth = getAuth();
    projects: any;
    public arrayProjects: any[] = [];
    //from authService


    constructor(private projectsService: ProjectsService, public authService: AuthService) { }

    ngOnInit(): void {
//     Get all users
      this.onAuthStateChanged();
      this.retrieveUsers();
      console.log('retrieveUsers called');

    }

//     get all users
    refreshList(): void {
        this.currentUser2 = undefined;
        this.currentIndex = -1;
        this.printProjects();
      }

      retrieveUsers(): void {
        const user2 = localStorage.getItem('user');
        if (user2 !== null) {
          const parsedUser = JSON.parse(user2);
          const uid = parsedUser.uid;
          console.log(uid)
          this.projectsService.getAll().snapshotChanges().pipe(
            map(changes =>
              changes.map(c =>
                ({ id: c.payload.doc.id, projects: c.payload.doc.data()?.projects }) // modify here
              )
            ),
            map(arrayProjects => {
              const user = arrayProjects.find(user => user.id === uid);
              return user?.projects || []; // extract projects array from user or return empty array
            })
          ).subscribe(data => {
            this.arrayProjects = data;
            console.log(this.arrayProjects);
            this.printProjects();
          });
        }
      }

    addItem(projectName: string, description: string, date: string) {
      const user2 = this.auth.currentUser;
      const uid = user2?.uid;
      console.log("this.currentUser.uid", uid )

      if (uid) {
        // Retrieve the projects only once, outside of the subscription
        const newProject = { projectName, description, date, completed: false };
        const projects = [...this.arrayProjects, newProject]; // create a new array with the new project added

        // Update the projectsService and arrayProjects properties
        this.projectsService.update(uid, { projects });
        this.arrayProjects = projects;
      }
    }

      printProjects(): void {
        console.log('printing projects',this.arrayProjects)
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
//         if(id.equals(uid){
//           projects = saveData(id, projects);
//         }
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
