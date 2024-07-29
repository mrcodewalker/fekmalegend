import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private scheduleSource = new BehaviorSubject<any>(null);
  private calendarSource = new BehaviorSubject<any>(null);

  currentSchedule = this.scheduleSource.asObservable();
  currentCalendar = this.calendarSource.asObservable();

  updateSchedule(schedule: any) {
    this.scheduleSource.next(schedule);
  }

  updateCalendar(calendar: any) {
    this.calendarSource.next(calendar);
  }
}
