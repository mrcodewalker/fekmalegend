import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-sidebar-calendar',
  templateUrl: './sidebar-calendar.component.html',
  styleUrls: ['./sidebar-calendar.component.scss']
})
export class SidebarCalendarComponent implements OnInit{
  @Output() sectionSelected = new EventEmitter<string>();
  @Input() studentInfo: any;
  isCollapsed = false; // Trạng thái ban đầu
  isSidebarOpen = true; // Sidebar open state
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed; // Đảo ngược trạng thái khi bấm nút
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle sidebar open state
  }
  navigateTo(section: string) {
    this.sectionSelected.emit(section); // Phát sự kiện với tên phần đã chọn
  }
  onStudentInfoReceived(studentInfo: any) {
    this.studentInfo = studentInfo;
  }
  ngOnInit() {
    if (this.studentInfo){

    }
  }
}
