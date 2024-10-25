import { Component } from '@angular/core';

@Component({
  selector: 'app-kma-schedule',
  templateUrl: './kma-schedule.component.html',
  styleUrls: ['./kma-schedule.component.scss']
})
export class KmaScheduleComponent {
  isCollapsed = false; // Trạng thái ban đầu
  selectedSection: string = '';
  studentInfo: any;
  showAuthorSupportModal = false; // Biến để quản lý hiển thị modal
  isSidebarOpen = true; // Sidebar open state

  onCloseModal() {
    this.showAuthorSupportModal = false; // Đóng modal khi nhận thông báo
  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed; // Đảo ngược trạng thái khi bấm nút
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle sidebar open state
  }
  closeSidebar() {
    this.isSidebarOpen = false; // Close the sidebar
  }

  onSectionSelected(section: string) {
    if (section==='authorSupport'){
      this.showAuthorSupportModal=true;
    }
    this.selectedSection = section; // Cập nhật selectedSection khi có sự kiện
  }
  onStudentInfoReceived(studentInfo: any) {
    this.studentInfo = studentInfo; // Cập nhật thông tin student_info
  }
}
