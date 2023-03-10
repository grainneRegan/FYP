import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../shared/services/projects.service';
import { User } from '../shared/services/user'
import { getAuth } from "firebase/auth";
import { Projects} from "../shared/services/projects"

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  auth = getAuth();

 constructor(private projectsService: ProjectsService){ }

 ngOnInit(): void {
 }

  title = 'My Projects';
    filter: 'all' | 'active' | 'done' = 'all';

    allItems = [
      { projectName: 'Assignment1', description: 'AI', date: '01/10/22', done: true },
      { projectName: 'Assignment2', description: 'RMI', date: '01/10/22', done: false },
      { projectName: 'Assignment3', description: 'Powerpoint', date: '01/10/22', done: false },
      { projectName: 'Assignment4', description: 'Report', date: '01/10/22', done: false },
    ];

    getProjects(): Projects[] {
      const user = this.auth.currentUser;
      if (user !== null) {
        const project: Projects[] = user.projects;
        return project;
      }
      return [];
    }

    get items() {
      if (this.filter === 'all') {
        return this.getProjects();
      }
      return this.allItems.filter((item) => this.filter === 'done' ? item.done : !item.done);
    }


    addItem(projectName: string, description: string, date: string) {
      this.allItems.unshift({
        projectName,
        description,
        date,
        done: false
      });
    }
}
