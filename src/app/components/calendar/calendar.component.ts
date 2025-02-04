import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SharedService} from "../services/SharedService";
import {CalendarDto} from "../dtos/calendar.dto";
import {Router} from "@angular/router";

interface Event {
  date: Date;
  courseCode: string;
  courseName: string;
  teacher: string;
  studyLocation: string;
  lessons: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  days: Date[] = [];
  events: Event[] = [];
  selectedEvent: Event | null = null;

  constructor(private sharedService: SharedService,
              private router: Router) {}

  ngOnInit() {
    this.generateCalendarDays();
    this.parseEvents();
  }

  // Navigation methods
  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendarDays();
    this.parseEvents();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendarDays();
    this.parseEvents();
  }

  generateCalendarDays() {
    this.days = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);

    // Last day of month
    const lastDay = new Date(year, month + 1, 0);

    // Add days from previous month to fill first week
    const startingDay = firstDay.getDay();
    for (let i = 0; i < startingDay; i++) {
      const prevMonthDay = new Date(year, month, -startingDay + i + 1);
      this.days.push(prevMonthDay);
    }

    // Add current month days
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      this.days.push(new Date(d));
    }

    // Add days from next month to complete grid
    const totalDays = this.days.length;
    const remainingDays = 42 - totalDays; // 6 rows * 7 columns
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      this.days.push(nextMonthDay);
    }
  }

  parseEvents() {
    // Existing event parsing logic remains the same
    const savedSchedule = localStorage.getItem('schedule');
    if (savedSchedule) {
      const schedule = JSON.parse(savedSchedule);
      this.parseScheduleEvents(schedule);
    } else {
      this.sharedService.currentSchedule.subscribe(schedule => {
        this.parseScheduleEvents(schedule);
      });
    }
  }

  getLessonTimeRange(lessons: string): { start: string, end: string } {
    const timeMapping: { [key: string]: { start: string, end: string } } = {
      '1,2,3': { start: '07:00', end: '09:30' },
      '4,5,6': { start: '09:35', end: '12:00' },
      '7,8,9': { start: '12:30', end: '14:55' },
      '10,11,12': { start: '15:05', end: '17:30' },
      '13,14,15,16': { start: '18:00', end: '20:30' }
    };

    return timeMapping[lessons] || { start: 'N/A', end: 'N/A' };
  }

  private parseScheduleEvents(schedule: CalendarDto) {
    this.events = [];
    const schedules = schedule.data.student_schedule;
    const processedCourses = new Set<string>();

    schedules.forEach(schedule => {
      const dates = schedule.study_days.split(' ');
      const courseCode = schedule.course_code;

      // Only process if this is the first time seeing this course
      if (!processedCourses.has(courseCode)) {
        const firstLessons = schedule.lessons.split(' ')[0];
        const timeRange = this.getLessonTimeRange(firstLessons);

        dates.forEach(dateStr => {
          const [day, month, year] = dateStr.split('/');
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

          this.events.push({
            date,
            courseCode: courseCode,
            courseName: schedule.course_name,
            teacher: schedule.teacher,
            studyLocation: schedule.study_location,
            lessons: firstLessons,
            startTime: timeRange.start,
            endTime: timeRange.end
          });
        });

        // Mark this course as processed
        processedCourses.add(courseCode);
      }
    });

    // Sort events by start time
    this.events.sort((a, b) => {
      // Convert start times to minutes for easy comparison
      const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };

      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });
  }

  getEventsForDate(date: Date): Event[] {
    return this.events.filter(event =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  }

  selectEvent(event: Event) {
    this.selectedEvent = event;
  }

  closeEventDetails() {
    this.selectedEvent = null;
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth() &&
      date.getFullYear() === this.currentDate.getFullYear();
  }
  exportToICS() {
    const events = this.events; // Assume this method exists
    const icsContent = this.generateICSContent(events);

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `calendar_${new Date().toISOString().split('T')[0]}.ics`;
    link.click();
  }

  private generateICSContent(events: any[]): string {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\n';

    events.forEach(event => {
      icsContent += 'BEGIN:VEVENT\n';
      icsContent += `SUMMARY:${event.courseName}\n`;
      icsContent += `DTSTART:${this.formatDateForICS(event.date, event.startTime)}\n`;
      icsContent += `DTEND:${this.formatDateForICS(event.date, event.endTime)}\n`;
      icsContent += `LOCATION:${event.studyLocation}\n`;
      icsContent += `DESCRIPTION:${event.courseCode} - ${event.teacher}\n`;
      icsContent += 'END:VEVENT\n';
    });

    icsContent += 'END:VCALENDAR';
    return icsContent;
  }

  private formatDateForICS(date: Date, time: string): string {
    const combinedDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    combinedDateTime.setHours(hours, minutes);
    return combinedDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  logout() {
      localStorage.setItem('jack','false');
      localStorage.removeItem('calendar');
      localStorage.removeItem('wish');
      this.router.navigate(['/login']);
  }
}
