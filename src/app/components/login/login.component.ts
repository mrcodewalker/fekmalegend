import {Component, OnInit} from '@angular/core';
import {LoginDto} from "../dtos/login.dto";
import {LoginService} from "../services/login.service";
import {CalendarDto} from "../dtos/calendar.dto";
import {Router} from "@angular/router";
import {SharedService} from "../services/SharedService";

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
  loading: boolean = false;
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
          debugger;
          this.schedule = response;
          debugger;
          if (this.schedule.code==="200"){
            this.sharedService.updateSchedule(this.schedule);
            localStorage.setItem("wibu", 'true');
            // this.route.navigate(['schedule'], { queryParams: { schedule: JSON.stringify(this.schedule) } });
            this.route.navigate(['schedule']);
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
          debugger;
          this.loading = false;
        },
        error: (err: any) => {
          debugger;
          this.loading = false;
          alert(err.error.message);
        }
      });
    }
}
