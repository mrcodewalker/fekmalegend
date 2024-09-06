import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";
import {addThemeToAppStyles} from "@angular/material/schematics/ng-add/theming/theming";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  profileData: any;
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    // Kiểm tra nếu có state được truyền kèm
    const state = window.history.state;
    this.profileData = state.profileData;

    console.log(this.profileData); // Kiểm tra dữ liệu trong console
    debugger;

    if (!this.profileData) {
      this.router.navigate(['/login/forum']);
    }
    this.fetchProfileData();
  }
  async fetchProfileData() {
    const data = await this.userService.viewProfile(this.authService.getUserId()).toPromise();
    if (data.username == null || data.username === 'null') {
      await this.openDialog("Warning", "Do not touch to users data");
      return;
    }
    this.profileData = data;
    this.updateAvatar();
    debugger;
    // Điều hướng đến trang view/profile với dữ liệu profile
  }
  updateAvatar() {
    const avatarImg = document.getElementById('avatar-img') as HTMLImageElement;
    avatarImg.src = this.profileData.avatar;
  }
  async updateAvatarReal(){
    const data = await this.userService.updateAvatar(this.authService.getUserId(), this.profileData.avatar).toPromise();
    debugger;
    if (data.status==='200'){
        await this.openDialog("Congratulations!", "Data has been updated successfully!");
        this.fetchProfileData();
      window.location.reload();
    } else {
      await this.openDialog("Warning", "Something went wrong, please try again!");
    }
    window.location.reload();
  }
  openDialog(title: string, message: string): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title, message },
      width: '400px'
    });

    return dialogRef.afterClosed().toPromise();
  }
  goBack(){
    window.history.back();
  }
}
