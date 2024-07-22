import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private scheduleSource = new BehaviorSubject<any>(null);
  currentSchedule = this.scheduleSource.asObservable();

  updateSchedule(schedule: any) {
    this.scheduleSource.next(schedule);
  }
}
