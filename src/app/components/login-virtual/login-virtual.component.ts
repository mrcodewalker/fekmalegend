import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ResponseVirtualDto} from "../dtos/response.virtual.dto";
import {LoginDto} from "../dtos/login.dto";
import {LoginService} from "../services/login.service";
import {SharedService} from "../services/SharedService";

@Component({
  selector: 'app-login-virtual',
  templateUrl: './login-virtual.component.html',
  styleUrls: ['./login-virtual.component.scss']
})
export class LoginVirtualComponent implements OnInit{
  loading: boolean = false;
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
  user: LoginDto = {
    username: '',
    password: ''
  }
  passwordFieldType: string = 'password'; // Mặc định là mật khẩu
  constructor(private router: Router,
              private loginService: LoginService,
              private sharedService: SharedService) {

  }
  togglePasswordVisibility(): void {
    // Chuyển đổi giữa 'password' và 'text'
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  ngOnInit(): void {

  }
    fetchData(){
      if (this.user.username.indexOf("CT")
        && this.user.username.indexOf("AT")
        && this.user.username.indexOf("DT")
        &&  this.user.username.indexOf("ct")
        && this.user.username.indexOf("at")
        && this.user.username.indexOf("dt")){
        alert("Please check your information again!");
        return;
      }
      if (this.user.username.length>8||
        this.user.password.length==0){
        alert("Please check your information again!");
        return;
      }
      this.loading = true;
      this.loginService.getVirtualCalendar(this.user).subscribe({
        next: (response: any) => {

          this.virtual = response;
          if (this.virtual.code==="200"){
            localStorage.setItem("calendar", JSON.stringify(this.virtual));
            this.sharedService.updateCalendar(this.virtual);
            localStorage.setItem("jack", 'true');
            // this.route.navigate(['schedule'], { queryParams: { schedule: JSON.stringify(this.schedule) } });
            this.router.navigate(['calendar']);
          } else {
            if (this.virtual.code==="401"){
              alert("Please check your password again!");
              localStorage.setItem("jack", 'false');
            } else {
              alert("An error has been founded, try again");
              localStorage.setItem("jack", 'false');
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
    if (this.action==='signout') this.fetchData();
    // if (this.action==='read') this.confirmReadFile();
    this.isModalOpen = false;
  }

  onCancel(): void {
    this.isModalOpen = false;
  }
}
