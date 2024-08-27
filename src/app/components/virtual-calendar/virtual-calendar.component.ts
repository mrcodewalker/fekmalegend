import {
  Component, OnInit,
} from '@angular/core';
import {ScheduleService} from "../services/schedule.service";
import {Router} from "@angular/router";
import {ResponseVirtualDto} from "../dtos/response.virtual.dto";
import {SharedService} from "../services/SharedService";
import {StudentScheduleDto} from "../dtos/student.schedule.dto";
import {CalendarDto} from "../dtos/calendar.dto";
import {DataDto} from "../dtos/data.dto";
import {Calendar, CalendarOptions} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentPlugin from "@fullcalendar/moment";
import {format} from "date-fns";
import {MatDialog} from "@angular/material/dialog";
import moment from "moment/moment";
import {EventDialogComponent} from "../event-dialog/event-dialog.component";
import {LoginService} from "../services/login.service";
import {DialogComponent} from "../dialog/dialog.component";

@Component({
  selector: 'app-virtual-calendar',
  templateUrl: './virtual-calendar.component.html',
  styleUrls: ['./virtual-calendar.component.scss']
})
export class VirtualCalendarComponent implements OnInit {

  loading : boolean = false;
  listCourseName: string[] = [];
  selectedCourse: string = '';
  baseTime: string = '';
  selectedCourseName: string = '';
  alertSubjectWrong: boolean = false;
  set = new Set();
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
  schedule: StudentScheduleDto[] = [];
  listSubjects: StudentScheduleDto[] = [];
  addToList: StudentScheduleDto = {
    base_time: '',
    teacher: '',
    course_name: '',
    study_days: '',
    study_location: '',
    course_code: '',
    lessons: ''
  }
  calendarFakeICS: CalendarDto = {
    code: '200',
    message: 'OK',
    data: {
      student_info: {
        birthday: '',
        student_code: '',
        gender: '',
        display_name: ''
      },
      student_schedule: []
    }
  }
  map: Map<string, Set<string>> = new Map();
  detailCourse: Map<string, Set<string>> = new Map();
  detailBaseTime: Map<string, Set<string>> = new Map();
  calendar: any;
  constructor(
   private scheduleService: ScheduleService,
   private router: Router,
   private sharedService: SharedService,
   public dialog: MatDialog,
   private loginService: LoginService
  ) {

  }

  ngOnInit(): void {
    const savedCalendar = localStorage.getItem('calendar');
    const savedWishList = localStorage.getItem('wish');
    if (savedWishList){
      this.listSubjects = JSON.parse(savedWishList);
    }
    if (savedCalendar) {
      this.virtual = JSON.parse(savedCalendar);
    } else {
      this.sharedService.currentCalendar.subscribe(virtual => {
        this.virtual = virtual;
        // console.log('Received schedule:', this.schedule);
      });
    }
    this.virtual.virtual_calendar.forEach(response => {
      if (!this.map.has(response.course)) {
        this.map.set(response.course, new Set<string>());
      }
      if (!this.detailCourse.has(response.course_name)){
        this.detailCourse.set(response.course_name, new Set<string>());
      }
      // @ts-ignore
      this.map.get(response.course).add(response.course_name);
      // @ts-ignore
      response.details.base_time = response.base_time;
      // @ts-ignore
      this.detailCourse.get(response.course_name).add(response.details);
    });
    this.loadEvents();
  }
    signOut(){
    localStorage.setItem('jack','false');
    localStorage.removeItem('calendar');
    localStorage.removeItem('wish');
    this.router.navigate(['/login/virtual']);
  }
  get keys() {
    return Array.from(this.map.keys());
  }

  getValue(key: string) {
    return Array.from(this.map.get(key) || []).join(', ');
  }
  selectCourse(key: string) {
    this.selectedCourse = key;
    this.selectedCourseName = '';
  }
  selectCourseName(key: string) {
    this.selectedCourseName = key;
  }
  fetchRegistrationData(){
    this.loading = true;
      // @ts-ignore
    this.schedule = this.detailCourse.get(this.selectedCourseName);
    setTimeout(() => {
      this.loading = false;
    }, 200);
  }
  processBaseTime(baseTime: string): string {
    const sections = baseTime.split('Từ');
    if (sections.length <= 1) {
      return baseTime; // Return as-is if no "Từ" found
    }

    // Remove empty sections and trim spaces
    return sections
      .slice(1) // Skip the first section which is before the first "Từ"
      .map(section => section.trim()) // Trim each section
      .join('<br>'); // Join with a line break for HTML rendering
  }
  updateSelected(key: any) {
    this.addToList = key;
    const newStudyDays = this.addToList.study_days.split(' ');
    const newLessons = this.addToList.lessons.split(' ');

    let isUnique = true;

    for (let subject of this.listSubjects) {
      // Check if the subject is not itself
      if (subject.course_name !== this.addToList.course_name) {
        const existingStudyDays = subject.study_days.split(' ');
        const existingLessons = subject.lessons.split(' ');

        for (let newDay of newStudyDays) {
          if (existingStudyDays.includes(newDay)) {
            for (let newLesson of newLessons) {
              if (existingLessons.includes(newLesson)) {
                this.openDialog('Warning', `2 môn bị trùng nhau gồm \n${this.addToList.course_name} \nvà \n${subject.course_name}`);
                isUnique = false;
                break;
              }
              if (!isUnique) {
                return;
              }
            }
            if (!isUnique) {
              return;
            }
          }
          if (!isUnique) {
            return;
          }
        }
        if (!isUnique) {
          return;
        }
      }
    }
    if (isUnique) {
      let check_contain_subject = '';
      check_contain_subject = this.addToList.course_name.substring(0, this.addToList.course_name.indexOf('(')).trim();
      const index = this.listSubjects.findIndex(subject =>
        subject.course_name.substring(0, subject.course_name.indexOf('(')).trim() === check_contain_subject
      );
      if (index !== -1) {
        this.listSubjects[index] = this.addToList;
      } else {
        // If not found, add a new item to the array
        this.listSubjects.push(this.addToList);
      }
    }
    this.loadEvents();
  }

  updateHeartIcon(isUnique: boolean) {
    const heartIcon = document.querySelector('.svg-filled');
    if (heartIcon) {
      if (isUnique) {
        heartIcon.classList.add('active');
      } else {
        heartIcon.classList.remove('active');
      }
    }
  }

  isLiked(detail: any): boolean {
    const course_name = detail.course_name;
    const newStudyDays = this.addToList.study_days.split(' ');
    const newLessons = this.addToList.lessons.split(' ');

    let isUnique = true;

    for (let subject of this.listSubjects) {
      // Kiểm tra nếu subject hiện tại không phải là chính nó
      if (subject.course_name !== this.addToList.course_name) {
        const existingStudyDays = subject.study_days.split(' ');
        const existingLessons = subject.lessons.split(' ');

        for (let newDay of newStudyDays) {
          if (existingStudyDays.includes(newDay)) {
            for (let newLesson of newLessons) {
              if (existingLessons.includes(newLesson)) {
                isUnique = false;
                break;
              }
              if (!isUnique) {
                return false;
              }
            }
            if (!isUnique) {
              return false;
            }
          }
          if (!isUnique) {
            return false;
          }
        }
        if (!isUnique) {
          return false;
        }
      }
    }
    return this.listSubjects.some(subject =>
      subject.course_name === course_name
    );
  }
  saveWishList(){
    localStorage.setItem('wish',JSON.stringify(this.listSubjects));
    this.openDialog('Information', `Your data has been saved successfully!`);
  }
  async refreshList() {
    await this.openDialog('Information', `All of subjects have been deleted successfully!`);

    localStorage.removeItem('wish');

    // Perform navigation after the dialog is closed
    this.router.navigate(['/calendar']).then(() => {
      window.location.reload();
    });

    this.loadEvents();
  }

  removeItem(key: any) {
    this.listSubjects = this.listSubjects.filter(subject => subject !== key);
    this.loadEvents();
  }
  openDialog(title: string, message: string): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title, message },
      width: '400px'
    });

    return dialogRef.afterClosed().toPromise();
  }



  scheduleVirtual: CalendarDto = {
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
    headerToolbar: {
      right: 'prev,next',
      left: 'title'
    },
    plugins: [dayGridPlugin, interactionPlugin, momentPlugin],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    },
    datesSet: (info) => {
      const titleEl = document.querySelector('.fc-toolbar-title');
      if (titleEl) {
        const startDate = info.view.currentStart;
        const endDate = info.view.currentEnd;
        const formattedStartDate = format(startDate, 'dd/MM/yyyy');
        const formattedEndDate = format(endDate, 'dd/MM/yyyy');
        titleEl.textContent = `${formattedStartDate} - ${formattedEndDate}`;
      }
    },
    viewDidMount: (info) => {
      const { currentStart } = info.view;
      info.view.calendar.gotoDate(currentStart);
    },
    titleFormat: { // Định dạng tiêu đề
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },

  };
  loadEvents() {
    // Xóa tiêu đề cũ trước khi cập nhật
    const titleEl = document.querySelector('.fc-toolbar-title');
    if (titleEl) {
      titleEl.textContent = '';
    }

    // Cập nhật các sự kiện
    this.calendarOptions.events = this.listSubjects.flatMap(item => {
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

    if (titleEl) {
      titleEl.textContent = '';
    }
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
  exportTxtFile() {
    const content = this.listSubjects.map(subject => subject.course_name).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kma_legend.txt';
    link.click();
    URL.revokeObjectURL(url);
  }
  exportICSFile() {
    this.loading = true;
    this.calendarFakeICS.data.student_schedule = this.listSubjects;
    this.loginService.export(this.calendarFakeICS).subscribe({
      next: (response: Blob) => {
        // Tạo URL và tải file
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kma_legend.ics';
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
}
