import {Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {RouterService} from "../services/router.service";
import {ActivatedRoute, Router} from "@angular/router";
import interactionPlugin from '@fullcalendar/interaction';
import {CalendarDto} from "../dtos/calendar.dto";
import {SharedService} from "../services/SharedService";
import {CalendarOptions} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import momentPlugin from '@fullcalendar/moment';
import moment from 'moment';
import {ScheduleDto} from "../dtos/schedule.dto";
import {StudentScheduleDto} from "../dtos/student.schedule.dto";
import {MatDialog} from "@angular/material/dialog";
import {EventDialogComponent} from "../event-dialog/event-dialog.component";
import { CalendarApi, EventInput } from '@fullcalendar/core';
import { format } from 'date-fns';
import {DataDto} from "../dtos/data.dto";
import {LoginService} from "../services/login.service";
import {FullCalendarComponent} from "@fullcalendar/angular";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnChanges{
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @Output() studentInfoSent = new EventEmitter<any>();
  @Input() selectedSection!: string;
  currentMonthYear: string = '';
  showModal = false;
  loading: boolean = false;
  showAuthorSupportModal = false;
  isMobile = false;
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
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    events: [],
    // headerToolbar: {
    //   // right: 'today prev,next',
    //   right: 'prev,next',
    //   left: 'title'
    // },
    headerToolbar: false,
    plugins: [dayGridPlugin, interactionPlugin, momentPlugin],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventTimeFormat: { // like '14:30'
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    },
    datesSet: (info) => {
      // Định dạng tiêu đề
      const titleEl = document.querySelector('.fc-toolbar-title');
      if (titleEl) {
        const startDate = info.view.currentStart;
        const endDate = info.view.currentEnd;
        const formattedStartDate = format(startDate, 'dd/MM/yyyy');
        const formattedEndDate = format(endDate, 'dd/MM/yyyy');
        titleEl.textContent = `${formattedStartDate} - ${formattedEndDate}`;
      }

      // Loại bỏ các ngày không thuộc tháng hiện tại
      const view = info.view;
      const currentStart = view.currentStart;
      const currentEnd = view.currentEnd;

      const allCells = document.querySelectorAll('.fc-daygrid-day');
      allCells.forEach(cell => {
        const cellDate = new Date(cell.getAttribute('data-date') as string);
        // if (cellDate < currentStart || cellDate >= currentEnd) {
        //   cell.style.display = 'none';
        // } else {
        //   cell.style.display = '';
        // }
      });
    },
    viewDidMount: (info) => {
      // Chỉ cần hiển thị tháng hiện tại
      const { currentStart } = info.view;
      info.view.calendar.gotoDate(currentStart);
    },
    titleFormat: { // like 'Tuesday, September 4, 2018'
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
  };
  ngOnChanges() {
    if (this.selectedSection) {
      this.handleSectionChange(this.selectedSection);
    }
  }
    ngOnInit(): void {
      // this.router.queryParams.subscribe(params => {
      //   if (params['schedule']) {
      //     this.schedule = JSON.parse(params['schedule']);
      //     // console.log('Received schedule:', this.schedule);
      //   }
      // });
      const savedSchedule = localStorage.getItem('schedule');
      if (savedSchedule) {
        this.schedule = JSON.parse(savedSchedule);
      } else {
        this.sharedService.currentSchedule.subscribe(schedule => {
          this.schedule = schedule;
          // console.log('Received schedule:', this.schedule);
        });
      }
      // console.log(this.schedule);
      this.studentInfoSent.emit(this.schedule.data.student_info);
      this.loadEvents();
      this.updateCurrentMonthYear(new Date());
    }
  updateCurrentMonthYear(date: Date) {
    this.currentMonthYear = moment(date).format('MMMM YYYY');
  }
  handleSectionChange(section: string) {
    switch (section) {
      case 'timeTable':
        // this.loadTimeTable();
        break;
      case 'sync':
        // this.syncData();
        break;
      case 'exportICS':
        this.exportICS();
        break;
      case 'signOut':
        this.clickSignOut();
        break;
      case 'authorSupport':
        this.showModal = true;
        break;
      // Các trường hợp khác...
      default:
        break;
    }
  }
  closeModal() {
    this.showModal = false; // Ẩn modal
  }
  previousMonth() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();
    this.updateCurrentMonthYear(calendarApi.getDate());
  }

  nextMonth() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
    this.updateCurrentMonthYear(calendarApi.getDate());
  }

    constructor(private route: Router,
                private router: ActivatedRoute,
                private sharedService: SharedService,
                public dialog: MatDialog,
                private loginService: LoginService) {
      this.checkIfMobile();
    }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile(); // Kiểm tra lại kích thước khi thay đổi
  }

  private checkIfMobile() {
    this.isMobile = window.innerWidth < 768; // Thay đổi giá trị 768 nếu cần
  }
  action: string = '';
  clickSignOut(): void{
    this.action = 'signout';
    this.openModalData();
  }
    signOut(){
      localStorage.setItem("wibu","false");
      localStorage.removeItem("schedule");
      this.route.navigate(['login']);
    }
  exportICS() {
    this.loading = true;
    this.loginService.export(this.schedule).subscribe({
      next: (response: Blob) => {
        // Tạo URL và tải file
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.schedule.data.student_info.display_name+"-"+this.schedule.data.student_info.student_code+'.ics';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        console.error('Error fetching data:', err.message);
      }
    });
    setTimeout(() => {
      this.loading = false;
    }, 200);
  }
  loadEvents() {

    // @ts-ignore
    this.calendarOptions.events = this.schedule.data.student_schedule.flatMap(item => {
      const dates = item.study_days.split(' ');
      const lessons = item.lessons.split(' ');
      return dates.map((date: any, index: number) => {
        const { start, end } = this.getLessonTimeRange(lessons[index]);
        const startDateTime = moment(`${date} ${start}`, 'DD/MM/YYYY HH:mm').toISOString();
        const endDateTime = moment(`${date} ${end}`, 'DD/MM/YYYY HH:mm').toISOString();

        return {
          title: item.course_name,
          start: startDateTime,
          end: endDateTime,
          description: `Location: ${item.study_location}, Teacher: ${item.teacher}`
        };
      });
    });
  }
   getLessonTimeRange  (lessons: string): { start: string, end: string }  {
    const timeMapping: { [key: string]: { start: string, end: string } } = {
      '1,2,3': { start: '07:00', end: '09:30' },
      '4,5,6': { start: '09:35', end: '12:00' },
      '7,8,9': { start: '12:30', end: '14:55' },
      '10,11,12': { start: '15:05', end: '17:30' },
      '13,14,15,16': { start: '18:00', end: '20:30' }
    };

    return timeMapping[lessons] || { start: '00:00', end: '23:59' }; // Giá trị mặc định nếu không tìm thấy lesson
  };

  handleDateClick(arg: any) {
    // const selectedDate = moment(arg.dateStr, 'YYYY-MM-DD').format('DD/MM/YYYY');
    //
    // // Kiểm tra xem calendarOptions.events có phải là mảng không
    // if (!Array.isArray(this.calendarOptions.events)) {
    //   alert('No events data available.');
    //   return;
    // }

    // // Lọc các sự kiện trong ngày được nhấp
    // const eventsInDay = (this.calendarOptions.events as EventInput[]).filter(event => {
    //   const eventDate = moment(event.start as string).format('DD/MM/YYYY');
    //   return eventDate === selectedDate;
    // });
    //
    // if (eventsInDay.length > 0) {
    //   // Mở hộp thoại với danh sách các sự kiện
    //   this.dialog.open(EventDialogComponent, {
    //     data: {
    //       date: selectedDate,
    //       events: eventsInDay
    //     }
    //   });
    // } else {
    //   alert('No events on this day.');
    // }
  }
  currentScrollPosition: number = 0;

  handleEventClick(arg: any) {
    this.currentScrollPosition = window.scrollY;
    this.dialog.open(EventDialogComponent, {
      data: {
        title: arg.event.title,
        description: arg.event.extendedProps.description, // Lấy mô tả từ extendedProps
        start: arg.event.start,
        end: arg.event.end,
      }
    }).afterClosed().subscribe(() => {
      window.scrollTo(0, this.currentScrollPosition);
    });
  }
  isModalOpen: boolean = false;

  openModalData(): void {
    this.isModalOpen = true;
  }

  async onConfirm(): Promise<void> {
    if (this.action==='signout') this.signOut();
    // if (this.action==='read') this.confirmReadFile();
    this.isModalOpen = false;
    this.action = '';
  }

  onCancel(): void {
    this.isModalOpen = false;
    this.action = '';
  }
}
