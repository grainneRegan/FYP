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
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  @Input() user: User = new User();
    currentUser2?: User;
    submitted = false;
    currentIndex = -1;
    title = '';
    auth = getAuth();
    projects: any;
    public arrayProjects: any[] = [];
    tasks: any[] = [];
    isPopupVisible = false;
    name = '';
    description = '';


 constructor(private projectsService: ProjectsService, public authService: AuthService){ }

 ngOnInit(): void {
   this.onAuthStateChanged();
   this.retrieveProjects();
   console.log('retrieveProjects called');
   //this.retrieveTasks();
 }

 ngOnChanges(): void {
   }

   //     get all projects
   refreshList(): void {
     this.currentIndex = -1;
     this.retrieveProjects();
   }

   closePopup() {
       this.isPopupVisible = false;
       this.name = '';
       this.description = '';
     }

    showPopup() {
        this.isPopupVisible = true;
        console.log('hello')
      }

     retrieveProjects(): void {
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
         });
       }
     }


     addProject(projectName: string, description: string, date: string) {
       const user2 = this.auth.currentUser;
       const uid = user2?.uid;
       console.log("this.currentUser.uid", uid )

       if (uid) {
         // Retrieve the projects only once, outside of the subscription
         const newProject = { projectName, description, date, completed: false , tasks: []};
         const projects = [...this.arrayProjects, newProject]; // create a new array with the new project added

         // Update the projectsService and arrayProjects properties
         this.projectsService.update(uid, { projects });
         this.arrayProjects = projects;
       }
     }

     addTask(projectName: string, taskName: string, description: string) {
       const user = this.auth.currentUser;
       const uid = user?.uid;
       console.log("this.currentUser.uid here", uid )

       if (uid) {
         // Find the project with the given name
         console.log('Here!!!', this.arrayProjects)
         const projectIndex = this.arrayProjects.findIndex(project => project.projectName == projectName);
         if (projectIndex !== -1) {
           // Add the new task to the project
           const newTask = { taskName, description, completed: false };
           console.log('new task', newTask);
           const updatedTasks: { taskName: string, description: string, completed: boolean }[] = [];
           console.log('updated Tasks', updatedTasks);
            this.arrayProjects[projectIndex].tasks.push(newTask);

            // Update the project in the arrayProjects property
            const updatedProject = { ...this.arrayProjects[projectIndex], tasks: this.arrayProjects[projectIndex].tasks };
            const updatedArrayProjects = [...this.arrayProjects.slice(0, projectIndex), updatedProject, ...this.arrayProjects.slice(projectIndex + 1)];

            // Update the projectsService and arrayProjects properties
            this.projectsService.update(uid, { projects: updatedArrayProjects });
            this.arrayProjects = updatedArrayProjects;
         }
       }
     }

     setActiveUser(user: User, index: number): void {
       this.currentUser2 = user;
       this.currentIndex = index;
     }

   onAuthStateChanged(): void {
     onAuthStateChanged(this.auth, (user) => {
       if (user) {
         const uid = user.uid;
       } else {
       }
     });
   }
}

//   title = 'My Projects';
//     filter: 'all' | 'active' | 'done' = 'all';

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


//     addItem(projectName: string, description: string, date: string) {
//       const user2 = this.auth.currentUser;
//       const uid = user2?.uid;
//       console.log("this.currentUser.uid", uid )
//
//       if (uid) {
//         this.projectsService.getProjects(uid).subscribe((user: any) => {
//           const projects = user.projects || [];
//           console.log('initialprojects', projects);
//           const newProject = { projectName, description, date, completed: false };
//           console.log('newprojects', newProject);
//           projects.push(newProject);
//           this.projectsService.update(uid, { projects });
//         });
//       }
//     }

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
