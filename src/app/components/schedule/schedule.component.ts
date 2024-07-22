import {Component, OnInit} from '@angular/core';
import {RouterService} from "../services/router.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit{
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
    constructor(private route: Router) {
    }
    signOut(){
      localStorage.setItem("wibu","false");
      this.route.navigate(['login']);
    }
}
