import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { User } from '../shared/services/user';
import { ProjectsService } from '../shared/services/projects.service';
import { map } from 'rxjs/operators';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-operations',
  templateUrl: './user-operations.component.html',
  styleUrls: ['./user-operations.component.css']
})
export class UserOperationsComponent implements OnInit {
//   Get all users
  @Input() user: User = new User();
    submitted = false;
    users?: User[];
    currentUser?: User;
    currentIndex = -1;
    title = '';

    constructor(private projectsService: ProjectsService) { }

    ngOnInit(): void {
//     Get all users
      this.retrieveUsers();
    }

//     get all users
    refreshList(): void {
        this.currentUser = undefined;
        this.currentIndex = -1;
        this.retrieveUsers();
      }

      retrieveUsers(): void {
        this.projectsService.getAll().snapshotChanges().pipe(
          map(changes =>
            changes.map(c =>
              ({ id: c.payload.doc.id, ...c.payload.doc.data() })
            )
          )
        ).subscribe(data => {
          this.users = data;
        });
      }

      setActiveUser(user: User, index: number): void {
        this.currentUser = user;
        this.currentIndex = index;
      }

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
}
