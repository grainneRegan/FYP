import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { ProjectsService } from '../shared/services/projects.service';

import * as FullCalendar from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';

import { map } from 'rxjs/operators';

import { createEventId } from '../shared/services/event_utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('calendar') calendarComponent?: FullCalendarComponent;

  public arrayProjects: any[] = [];

  selectedProject: string = '';

  calendarVisible = true;

  calendarOptions: CalendarOptions = {
    plugins: [ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],

    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  currentEvents: EventApi[] = [];

  constructor(public authService: AuthService, public projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.retrieveProjects();
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = this.selectedProject;
    console.log(this.selectedProject);
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
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
