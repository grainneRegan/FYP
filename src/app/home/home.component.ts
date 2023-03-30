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
import {Observable} from 'rxjs/';
import { map } from 'rxjs/operators';

import { createEventId } from '../shared/services/event_utils';

import { getFirestore, collection, addDoc, getDoc, doc} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('calendar') calendarComponent?: FullCalendarComponent;

  public arrayProjects: any[] = [];
  public taskArray: any[] = [];
  selectedProject: string = '';
  taskSelected = false;

  calendarVisible = true;
  private dbPath = '/Events';
  eventsRef: AngularFirestoreCollection<Event>;
  initialEvents2: any[] = [];

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
    eventColor: 'pink',
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  currentEvents: EventApi[] = [];
  allEvents: AngularFirestoreCollection<Event>;
  events?: Event[];
  arrayFormattedEvents: any[] = [];

  arrayEvents: any[] = [];
  calendarOptionsUpdated = false;

  constructor(public authService: AuthService, public projectsService: ProjectsService, private db: AngularFirestore) {
    this.eventsRef = db.collection(this.dbPath);
    this.allEvents = this.getAll();
  }

  ngOnInit(): void {
    this.retrieveProjects();
    this.retrieveEvents().then(() => {
      this.formatEvents().then(() => {
        this.updateCalendar()
      });
    });
    this.getTasks();
  }

  populateCalendar() {
    this.calendarOptions = {
                              plugins: [ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin ],
                              headerToolbar: {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                              },
                              initialView: 'dayGridMonth',
                              // field which initialises the calendar with the initial events retrieved
                              initialEvents: this.arrayFormattedEvents,
                              weekends: true,
                              editable: true,
                              selectable: true,
                              selectMirror: true,
                              dayMaxEvents: true,
                              events: [],
                              eventColor: 'pink',
                              select: this.handleDateSelect.bind(this),
                              eventClick: this.handleEventClick.bind(this),
                              eventsSet: this.handleEvents.bind(this)
                            };
                            this.calendarOptionsUpdated = true;
                            this.getTasks();
  }

  updateCalendar() {
    this.calendarOptionsUpdated = false;
    this.populateCalendar();
  }

  // method to take the retrieved events
  // and add only events created by the current user to a new array
  formatEvents() {
    return new Promise<void>((resolve) => {
     const user = localStorage.getItem('user');
     if (user !== null) {
        const parsedUser = JSON.parse(user);
        const uid = parsedUser.uid;
        for(let tempEvent of this.arrayEvents) {
          if(tempEvent.event.uid === uid){
            this.arrayFormattedEvents.push(tempEvent.event);
          }
        }
        resolve();
      }
    });
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  // method which is called when a date is selected on the calendar
  handleDateSelect(selectInfo: DateSelectArg) {
    // gets title from dropdown list
    const title = this.selectedProject;
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();
    // only creates event object if title has been selected
    if (title) {
      const eventData = {
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      };
      // adds event to calendar and also calls method to add event to firestore database
      calendarApi.addEvent(eventData);
      this.addEvent(eventData);
      this.selectedProject = '';
      this.taskSelected = false;
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      for(let eventObject of this.arrayEvents){
        if(eventObject.event.title == clickInfo.event.title){
          const id = eventObject.id;
          this.eventsRef.doc(id).delete();
        }
      }
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
     this.formatEvents();
   }

  getTasks() {
    for(let project of this.arrayProjects){
      for(let task of project.tasks){
        this.taskArray.push(task);
      }
    }
  }
   // method to retrieve events from firestore
   retrieveEvents(): Promise<void> {
     // return a promise when the method is resolved
     return new Promise<void>((resolve) => {
       const user = localStorage.getItem('user');
       if (user !== null) {
         const parsedUser = JSON.parse(user);
         const uid = parsedUser.uid;
         // retrieves all the data from the firestore events database
         this.getAll().snapshotChanges().pipe(
           map(changes =>
             changes.map(c =>
               ({ id: c.payload.doc.id, event: c.payload.doc.data() })
             )
           )
         ).subscribe(data => {
           this.arrayEvents = data;
           resolve();
         });
       } else {
         resolve();
       }
     });
   }

  getAll(): AngularFirestoreCollection<Event> {
      console.log('reference', this.eventsRef);
      return this.eventsRef;
    }

   async getEvents(id: any): Promise<any>{
     console.log(id)
     console.log('here');
     const eventsRef = doc(this.eventsRef.ref, "Events", id);
     const docSnap = await getDoc(eventsRef);
     console.log(docSnap)
     if (docSnap.exists()) {
       console.log("Document data:", docSnap.data());
       return docSnap.data();
     } else {
       // doc.data() will be undefined in this case
       console.log("No such document!");
       return null;
     }
   }

   addEvent(eventData: any) : any {
   const user = localStorage.getItem('user');
    if (user !== null) {
      const parsedUser = JSON.parse(user);
      const tempUid = parsedUser.uid;
      try {
        return this.eventsRef.add({ ...eventData, uid: tempUid});
        console.log("Document written with ID: ", this.eventsRef);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
   }
}
