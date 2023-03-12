import { Component, OnInit} from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { ProjectsService } from '../shared/services/projects.service';

import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import * as FullCalendar from '@fullcalendar/core'; // import FullCalendar

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  public arrayProjects: any[] = [];
  constructor(public authService: AuthService, public projectsService: ProjectsService) {
    this.setupCalendar();
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    editable: true, // enable drag and drop
    droppable: true, // enable dropping external elements
    eventDrop: (info) => {
      console.log('Event dropped:', info.event);
      // handle event drop here
    },
    drop: function(info) {
      console.log(info.jsEvent)
     }
  };

  ngOnInit(): void {
    this.retrieveProjects();
    document.addEventListener('DOMContentLoaded', () => {
      this.setupCalendar();
    });
  }

  setupCalendar(): void {
    var checkbox = document.getElementById('drop-remove');
    var containerEl = document.getElementById('external-events');

    if (containerEl) {
      new Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: function(eventEl) {
          return {
            title: eventEl.innerText
          };
        }
      });
    }
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
}
