import {Component, OnInit} from '@angular/core';
import {LoginDto} from "../dtos/login.dto";
import {LoginService} from "../services/login.service";
import {CalendarDto} from "../dtos/calendar.dto";
import {Router} from "@angular/router";
import {SharedService} from "../services/SharedService";
import {DataDto} from "../dtos/data.dto";
import {ResponseVirtualDto} from "../dtos/response.virtual.dto";
import {VirtualCalendarDto} from "../dtos/virtual.calendar.dto";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  user: LoginDto = {
    username: '',
    password: ''
  }
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
  loading: boolean = false;
  schedule: CalendarDto = {
    code: '',
    message: '',
    data: new DataDto({
      student_info: {
        birthday: '',
        student_code: '',
        display_name: '',
        gender: ''
      },
      student_schedule: []
    })
  }
  username: string = '';
  password: string = '';
    ngOnInit(): void {

    }
    constructor(private loginService: LoginService,
                private route: Router,
                private sharedService: SharedService) {
    }
    fetchData(){
      if (this.user.username.indexOf("CT")
      && this.user.username.indexOf("AT")
      && this.user.username.indexOf("DT")
      &&  this.user.username.indexOf("ct")
        && this.user.username.indexOf("at")
        && this.user.username.indexOf("dt")
      ){
        alert("Please check your information again!");
        return;
      }
      if (this.user.username.length>8||
          this.user.password.length==0){
        alert("Please check your information again!");
        return;
      }

      this.loading = true;
      this.loginService.login(this.user).subscribe({
        next: (response: any) => {

          this.schedule = response;

          if (this.schedule.code==="200"){
            localStorage.setItem("schedule", JSON.stringify(this.schedule));
            this.sharedService.updateSchedule(this.schedule);
            localStorage.setItem("wibu", 'true');
            // this.route.navigate(['schedule'], { queryParams: { schedule: JSON.stringify(this.schedule) } });
            this.route.navigate(['/kma/schedule']);
          } else {
            if (this.schedule.code==="401"){
              alert("Please check your password again!");
              localStorage.setItem("wibu", 'false');
            } else {
              alert("An error has been founded, try again");
              localStorage.setItem("wibu", 'false');
            }
          }
        },
        complete: () => {

          this.loading = false;
        },
        error: (err: any) => {

          this.loading = false;
          alert(err.error.message);
        }
      });
    }
    fetchVirtualCalendar(){
      this.loading = true;
      this.loginService.getVirtualCalendar(this.user).subscribe({
        next: (response: any) => {

          this.virtual = response;

          if (this.virtual.code==="200"){
            localStorage.setItem("virtual_calendar", JSON.stringify(this.virtual));
            // this.sharedService.updateSchedule(this.schedule);
            localStorage.setItem("codewalker", 'true');
            // this.route.navigate(['schedule'], { queryParams: { schedule: JSON.stringify(this.schedule) } });
            this.route.navigate(['calendar']);
          } else {
            if (this.schedule.code==="401"){
              alert("Please check your password again!");
              localStorage.setItem("codewalker", 'false');
            } else {
              alert("An error has been founded, try again");
              localStorage.setItem("codewalker", 'false');
            }
          }
        },
        complete: () => {

          this.loading = false;
        },
        error: (err: any) => {

          this.loading = false;
          alert(err.error.message);
        }
      });
    }
  isModalOpen: boolean = false;
  action: string = '';
  clickLogin(): void{
    this.action='login';
    this.openModalData();
  }
  openModalData(): void {
    this.isModalOpen = true;
  }

  async onConfirm(): Promise<void> {
    if (this.action==='login') this.fetchData();
    // if (this.action==='read') this.confirmReadFile();
    this.isModalOpen = false;
  }

  onCancel(): void {
    this.isModalOpen = false;
  }
}
