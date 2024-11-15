import {Component, OnInit, ViewChild} from '@angular/core';
import {FullCalendarComponent} from "@fullcalendar/angular";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CalendarOptions, EventInput} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import minMaxTimePlugin from "flatpickr/dist/plugins/minMaxTimePlugin";
export interface Course {
  id: string;
  courseName: string;
  teacher: string;
  location: string;
  schedule: string;
  department: string;
  type: string;
  color?: string;
}
@Component({
  selector: 'app-virtual-schedule',
  templateUrl: './virtual-schedule.component.html',
  styleUrls: ['./virtual-schedule.component.scss']
})
export class VirtualScheduleComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  filterForm: FormGroup;
  courses: Course[] = [];
  currentView: 'calendar' | 'list' = 'calendar';
  selectedCourses: Course[] = [];

  departments = ['IT', 'Business', 'Engineering', 'Mathematics'];
  courseTypes = ['Core', 'Elective', 'Laboratory'];
  semesters = ['Fall 2024', 'Spring 2025'];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: []
  };

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      department: [''],
      semester: [''],
      courseType: [''],
      searchTerm: ['']
    });
  }

  ngOnInit() {
    this.loadCourses();
    this.setupFilterSubscription();
  }

  private setupFilterSubscription() {
    this.filterForm.valueChanges.subscribe(() => {
      this.filterCourses();
    });
  }

  private loadCourses() {
    // Mock data - replace with actual API call
    this.courses = [
      {
        id: '1',
        courseName: 'Advanced Programming',
        teacher: 'Dr. Smith',
        location: 'Room A101',
        schedule: 'MON,WED 9:00-10:30',
        department: 'IT',
        type: 'Core',
        color: '#4CAF50'
      },
      // Add more courses...
    ];
  }

  private filterCourses() {
    const filters = this.filterForm.value;
    // Implement filtering logic
  }

  onCourseSelect(course: Course) {
    const index = this.selectedCourses.findIndex(c => c.id === course.id);
    if (index === -1) {
      this.selectedCourses.push(course);
      this.addEventToCalendar(course);
    } else {
      this.selectedCourses.splice(index, 1);
      this.removeEventFromCalendar(course);
    }
  }

  private addEventToCalendar(course: Course) {
    // Parse schedule string and create calendar events
    const events = this.parseScheduleToEvents(course);
    const calendarApi = this.calendarComponent.getApi();
    events.forEach(event => calendarApi.addEvent(event));
  }

  private removeEventFromCalendar(course: Course) {
    const calendarApi = this.calendarComponent.getApi();
    const events = calendarApi.getEvents();
    events
      .filter(event => event.id.startsWith(course.id))
      .forEach(event => event.remove());
  }

  private parseScheduleToEvents(course: Course): EventInput[] {
    // Implement schedule string parsing logic
    // Return array of calendar events
    return [];
  }

  exportSchedule() {
    // Implement export logic (ICS file)
  }

  clearSelection() {
    this.selectedCourses = [];
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();
  }
}
