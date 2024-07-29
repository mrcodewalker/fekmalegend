import {
  Component, OnInit,
} from '@angular/core';
import {ScheduleService} from "../services/schedule.service";
import {Router} from "@angular/router";
import {ResponseVirtualDto} from "../dtos/response.virtual.dto";
import {SharedService} from "../services/SharedService";

@Component({
  selector: 'app-virtual-calendar',
  templateUrl: './virtual-calendar.component.html',
  styleUrls: ['./virtual-calendar.component.scss']
})
export class VirtualCalendarComponent implements OnInit {

  loading : boolean = false;
  listCourseName: string[] = [];
  alertSubjectWrong: boolean = false;
  set = new Set();
  virtual: ResponseVirtualDto = {
    virtual_calendar : [{
      base_time: '',
      course: '',
      details: [],
      course_name: ''
    }],
    message: '',
    code: ''
  }
  map: Map<string, Set<string>> = new Map();
  detailCourse: Map<string, Set<string>> = new Map();
  constructor(
   private scheduleService: ScheduleService,
   private router: Router,
   private sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    const savedCalendar = localStorage.getItem('calendar');
    if (savedCalendar) {
      this.virtual = JSON.parse(savedCalendar);
    } else {
      this.sharedService.currentCalendar.subscribe(virtual => {
        this.virtual = virtual;
        // console.log('Received schedule:', this.schedule);
      });
    }
    this.virtual.virtual_calendar.forEach(response => {
      if (!this.map.has(response.course)) {
        this.map.set(response.course, new Set<string>());
      }
      if (!this.detailCourse.has(response.course_name)){
        this.detailCourse.set(response.course_name, new Set<string>());
      }
      // @ts-ignore
      this.map.get(response.course).add(response.course_name);
      // @ts-ignore
      this.detailCourse.get(response.course_name).add(response.details);
    });
    debugger;
  }
    signOut(){
    localStorage.setItem('jack','false');
    localStorage.removeItem('calendar');
    this.router.navigate(['/login/virtual']);
  }

}
