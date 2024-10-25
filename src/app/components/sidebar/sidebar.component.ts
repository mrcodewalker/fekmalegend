import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  selectedName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    debugger;
    // const data = localStorage.getItem('dashboardPage');
    // this.selectedName = data ? data : 'Home'; // Nếu không có dữ liệu, mặc định là 'Home'
  }
  isAdmin(){
    const role = this.authService.getRole();

    if (role?.toLowerCase() === 'admin') {
      return true;
    } else {
      return false;
    }
  }
  selectItem(name: string) {
    // this.selectedName = name; // Cập nhật tab được chọn
    // localStorage.setItem('dashboardPage', name); // Lưu trữ tab vào localStorage
  }
  isCollapsed = false;

  @Output() toggle = new EventEmitter<void>(); // Sự kiện để gửi thông báo

  onToggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit(); // Phát ra sự kiện
  }
}
