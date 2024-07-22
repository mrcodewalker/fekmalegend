import {Component, OnInit} from '@angular/core';
import {RouterService} from "../services/router.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CalendarDto} from "../dtos/calendar.dto";
import {SharedService} from "../services/SharedService";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit{
    schedule: CalendarDto = {
      code: '',
      message: '',
      data: [],
      student_info: {
        birthday: '',
        student_code: '',
        display_name: '',
        gender: ''
      }
    }
    ngOnInit(): void {
      // this.router.queryParams.subscribe(params => {
      //   if (params['schedule']) {
      //     this.schedule = JSON.parse(params['schedule']);
      //     // console.log('Received schedule:', this.schedule);
      //   }
      // });
      this.sharedService.currentSchedule.subscribe(schedule => {
        this.schedule = schedule;
        // console.log('Received schedule:', this.schedule);
      });
    }
    constructor(private route: Router,
                private router: ActivatedRoute,
                private sharedService: SharedService) {
    }
    signOut(){
      localStorage.setItem("wibu","false");
      this.route.navigate(['login']);
    }
}
