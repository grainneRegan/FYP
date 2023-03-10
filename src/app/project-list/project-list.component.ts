import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ProjectsService } from '../shared/services/projects.service';
import { User } from '../shared/services/user'
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import { Projects} from "../shared/services/projects"


@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  auth = getAuth();
  submitted = false;
  message = '';

 constructor(private projectsService: ProjectsService){ }

 ngOnInit(): void {
   this.onAuthStateChanged();
 }

 ngOnChanges(): void {
     this.message = '';
   }

  title = 'My Projects';
    filter: 'all' | 'active' | 'done' = 'all';

//     allItems = [
//       { projectName: 'Assignment1', description: 'AI', date: '01/10/22', done: true },
//       { projectName: 'Assignment2', description: 'RMI', date: '01/10/22', done: false },
//       { projectName: 'Assignment3', description: 'Powerpoint', date: '01/10/22', done: false },
//       { projectName: 'Assignment4', description: 'Report', date: '01/10/22', done: false },
//     ];


//     getProjects(): any {
//       const user = this.auth.currentUser as User;
//       console.log('user', user, user?.uid)
//       if (user !== null) {
//         const project: any = user.projects[0].completed;
//         console.log('project', project)
//         return project;
//       }
//       return [];
//     }

//     get items() {
//     console.log('hello')
//       if (this.filter === 'all') {
//         return this.getProjects();
//       }
//       return this.getProjects().filter((item: Projects) => this.filter === 'done' ? item.completed : !item.completed);
//     }


    addItem(projectName: string, description: string, date: string) {
      const user2 = this.auth.currentUser;
      const uid = user2?.uid;
      console.log("this.currentUser.uid", uid )

      if (uid) {
        this.projectsService.getProjects(uid).subscribe((user: any) => {
          const projects = user.projects || [];
          const newProject = { projectName, description, date, completed: false };
          projects.push(newProject);
          this.projectsService.update(uid, { projects });
        });
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

//         this.getProjects().unshift({
//           projectName,
//           description,
//           date,
//           done: false
//         });

// .then(() => {
//             updateProfile(user2! , { projects: jsonProject })
//               .then(() => {
//                 this.message = 'The status was updated successfully!';
//                 this.submitted = true;
//               })
//               .catch(err => console.log(err));
//           })
//           .catch(err => console.log(err));
