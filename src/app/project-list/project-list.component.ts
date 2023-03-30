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
import * as confetti from 'canvas-confetti';
import { NgbDateStruct, NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import {PipeService} from "../shared/services/pipe.service";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  providers: [NgbDropdownModule]
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
    isSubPopupVisible = false;
    isSubPopup2Visible = false;
    newProjectName = '';
    public clicked = false;
    model?: NgbDateStruct;

 constructor(private projectsService: ProjectsService, public authService: AuthService){ }

 ngOnInit(): void {
   this.onAuthStateChanged();
   this.retrieveProjects();
   console.log('retrieveProjects called');
   this.testItem();
 }

  ngOnChanges(): void {
   }

  // function to retrieve the projects again
  refreshList(): void {
   this.currentIndex = -1;
   this.retrieveProjects();
  }

  closePopup() {
     this.isPopupVisible = false;
   }

  showPopup() {
    this.isPopupVisible = true;
  }
  closeSubTaskPopup() {
   this.isSubPopupVisible = false;
  }

  showSubTaskPopup() {
      this.isSubPopupVisible = true;
  }

  closeSubTask2Popup() {
     console.log('close');
     this.isSubPopup2Visible = false;
   }

  showSubTask2Popup(currentProjectName: string) {
      this.isSubPopup2Visible = true;
      this.newProjectName = currentProjectName;
    }

  sortTasksByImportance() {
    this.arrayProjects.sort((a,b) => b.flagged - a.flagged);
  }

  sortTasksByCompleted() {
    this.arrayProjects.sort((a,b) => a.completed - b.completed);
  }

  sortTasksByDueDate() {
    this.arrayProjects.sort((a, b) => this.convertDates(a.date, b.date));
  }

  convertDates(a: string, b: string) {
    const date1 = new Date(a);
    const date2 = new Date(b);
    return date1.getTime() - date2.getTime();
  }

  // function to retrieve all projects/task and their subtasks associated to the current user
  retrieveProjects(): void {
   const user = localStorage.getItem('user');
   if (user !== null) {
     // get the current users uid
     const parsedUser = JSON.parse(user);
     const uid = parsedUser.uid;
     // call the get function which gets all data from the database
     this.projectsService.getAll().snapshotChanges().pipe(
       // map the projects to an array of objects with id and tasks
       map(changes =>
         changes.map(c =>
           ({ id: c.payload.doc.id, projects: c.payload.doc.data()?.projects })
         )
       ),
       // get the list of projects/tasks associated with the current user
       map(arrayProjects => {
         const user = arrayProjects.find(user => user.id === uid);
         return user?.projects || [];
       })
       // update the local projects array to the data stream
     ).subscribe(data => {
       this.arrayProjects = data;
     });
   }
  }

  /* Method to add main task to current user, all 3 parameters are passed in from user input */
  addTask(projectName: string, description: string, date: string) {
   // retrieve the uid of the current signed in user
   const user = this.auth.currentUser;
   const uid = user?.uid;
   // on condition that user exists
   if (uid) {
     // get the current Date and convert the selected date to a comparable date
     const currentDate = new Date();
     const selectedDate = new Date(date);
     // if the selected date is in the past alert the user that the date must be some time in the future
     // and don't continue to add the task to the user.
     if (selectedDate.getTime() < currentDate.getTime()) {
       alert("The due date must be a date in the future.");
       return;
     }

     // Creates a new JSON object with the passed in parameters and default properties
     const newProject = { projectName, description, date, completed: false , flagged: false, tasks: []};
     // creating a new array of projects and adding but the old array of projects and the new project to the arrray
     const projects = [...this.arrayProjects, newProject];

     // call the update method tp update the projects corresponding to the current user
     // updating the local array of projects with added project
     this.projectsService.update(uid, { projects });
     this.arrayProjects = projects;
     // setting flag to true to showcase popup to add subtask to main task
     this.isSubPopupVisible = true;
     // set variable so that the subtask is added to correct main task
     this.newProjectName = projectName;
     // call method to close current popup
     this.closePopup();
   } else {
      console.log('No valid user found, task has failed to add.');
      this.closePopup();
    }
  }


  updateTaskCompletedStatus(projectName: string, completed: boolean) {
    const user = this.auth.currentUser;
    const uid = user?.uid;

    if (uid) {
      // Find the project with the given name
      const projectIndex = this.arrayProjects.findIndex(project => project.projectName == projectName);

      if (projectIndex !== -1) {
        // Update the completed field of the project
        const updatedProject = { ...this.arrayProjects[projectIndex], completed: completed };
        const updatedArrayProjects = [...this.arrayProjects.slice(0, projectIndex), updatedProject, ...this.arrayProjects.slice(projectIndex + 1)];

        // Update the projectsService and arrayProjects properties
        this.projectsService.update(uid, { projects: updatedArrayProjects });
        this.arrayProjects = updatedArrayProjects;
      }
    }
  }

  updateTaskFlaggedStatus(projectName: string, flagged: boolean) {
    const user = this.auth.currentUser;
    const uid = user?.uid;

    if (uid) {
      // Find the project with the given name
      const projectIndex = this.arrayProjects.findIndex(project => project.projectName == projectName);

      if (projectIndex !== -1) {
        // Update the completed field of the project
        const updatedProject = { ...this.arrayProjects[projectIndex], flagged: flagged };
        const updatedArrayProjects = [...this.arrayProjects.slice(0, projectIndex), updatedProject, ...this.arrayProjects.slice(projectIndex + 1)];

        // Update the projectsService and arrayProjects properties
        this.projectsService.update(uid, { projects: updatedArrayProjects });
        this.arrayProjects = updatedArrayProjects;
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

   deleteTask(projectName: string) {
     const user2 = this.auth.currentUser;
     const uid = user2?.uid;
     console.log("this.currentUser.uid", uid)

     if (uid) {
       // Find the index of the project to remove
       const projectIndex = this.arrayProjects.findIndex(project => project.projectName == projectName);

       // Check if the project is found
       if (projectIndex > -1) {
         // Remove the project from the array
         this.arrayProjects.splice(projectIndex, 1);

         // Update the projectsService and arrayProjects properties
         this.projectsService.update(uid, { projects: this.arrayProjects });
         console.log('Task deleted: ', projectName, 'new array', this.arrayProjects)
       } else {
         console.log('Project not found:', projectName);
       }
     }
   }


   addSubTask(taskName: string, description: string) {
     const user = this.auth.currentUser;
     const uid = user?.uid;

     if (uid) {
       // Find the project with the given name
       const projectIndex = this.arrayProjects.findIndex(project => project.projectName == this.newProjectName);
       if (projectIndex !== -1) {
         // Add the new task to the project
         const newTask = { taskName, description, completed: false };
         const updatedTasks: { taskName: string, description: string, completed: boolean }[] = [];
          this.arrayProjects[projectIndex].tasks.push(newTask);

          // Update the project in the arrayProjects property
          const updatedProject = { ...this.arrayProjects[projectIndex], tasks: this.arrayProjects[projectIndex].tasks };
          const updatedArrayProjects = [...this.arrayProjects.slice(0, projectIndex), updatedProject, ...this.arrayProjects.slice(projectIndex + 1)];

          // Update the projectsService and arrayProjects properties
          this.projectsService.update(uid, { projects: updatedArrayProjects });
          this.arrayProjects = updatedArrayProjects;
          this.closeSubTaskPopup();
          this.closeSubTask2Popup();
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

   confetti() {
     confetti.create(document.getElementById('canvas') as HTMLCanvasElement, {
       resize: true,
       useWorker: true,
     })({ particleCount: 200, spread: 200 });
   }


   updateTask(task: any, projectName: string) {
     const user2 = this.auth.currentUser;
     const uid = user2?.uid;
     let updatedTask: any;
     console.log("this.currentUser.uid", uid)

     if (uid) {
       // Find the index of the project
       const projectIndex = this.arrayProjects.findIndex(project => project.projectName == projectName);

       // Check if the project is found
       if (projectIndex > -1) {
         // Find the index of the task in the project's tasks array
         const taskIndex = this.arrayProjects[projectIndex].tasks.findIndex((t: any) => t.taskName == task.taskName);
         console.log('got index', taskIndex)
         // Check if the task is found
         if (taskIndex > -1) {
           // Update the completed field of the task
           const completedStatus = task.completed;
           console.log('completed status', completedStatus);
           console.log('task', task);
           if(completedStatus){
            updatedTask = { ...this.arrayProjects[projectIndex].tasks[taskIndex], completed: false };
           } else {
             updatedTask = { ...this.arrayProjects[projectIndex].tasks[taskIndex], completed: true };
           }
           console.log('updated task', updatedTask);
           const updatedTasks = [...this.arrayProjects[projectIndex].tasks.slice(0, taskIndex), updatedTask, ...this.arrayProjects[projectIndex].tasks.slice(taskIndex + 1)];

           // Update the tasks array of the project
           const updatedProject = { ...this.arrayProjects[projectIndex], tasks: updatedTasks };
           const updatedArrayProjects = [...this.arrayProjects.slice(0, projectIndex), updatedProject, ...this.arrayProjects.slice(projectIndex + 1)];

           // Update the projectsService and arrayProjects properties
           this.projectsService.update(uid, { projects: updatedArrayProjects });
           this.arrayProjects = updatedArrayProjects;
         } else {
           console.log('Task not found:', task.taskName);
         }
       } else {
         console.log('Project not found:', projectName);
       }
     }
   }
}
