import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef, OnInit, ViewEncapsulation,
} from '@angular/core';
import { EventColor } from 'calendar-utils';
import dayGridPlugin from '@fullcalendar/daygrid';
import {ScheduleService} from "../services/schedule.service";
import {ScheduleDto} from "../dtos/schedule.dto";
import {SubjectDto} from "../dtos/subject.dto";
import {disableDebugTools} from "@angular/platform-browser";
import {DetailSubjectDto} from "../dtos/detail.subject.dto";
import {CalendarEvent, CalendarView} from "angular-calendar";
import {DateDto} from "../dtos/date.dto";
import {dataBinding} from "@syncfusion/ej2-angular-schedule";
import {SingleSubjectDto} from "../dtos/single.subject.dto";
import {resetParseTemplateAsSourceFileForTest} from "@angular/compiler-cli/src/ngtsc/typecheck/diagnostics";
import {forkJoin, Observable} from "rxjs";
import {toRelativeImport} from "@angular/compiler-cli";

@Component({
  selector: 'app-virtual-calendar',
  templateUrl: './virtual-calendar.component.html',
  styleUrls: ['./virtual-calendar.component.scss', './assets/css/style.css', './evo-calendar.css', './evo-calendar.midnight-blue.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class VirtualCalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  selectedDay: string = 'Monday';
  errorFound: boolean = false;
  listSingleSubjects: SingleSubjectDto[] = [];
  singleSubject: SingleSubjectDto = {
    subject_name: '',
    start: new Date(),
    end: new Date(),
    day_in_week: 2
  }

  events: CalendarEvent[] = [{
    start: new Date(), // Ngày bắt đầu của sự kiện
    title: 'Event 1' // Tiêu đề của sự kiện
  }];
  selectedCourse: string = "";
  dateDTO: DateDto = {
    day_in_week : [],
    schedule: []
  }
  selectedSubject: string = "";
  scheduleDTO: ScheduleDto [] = [];
  subjectDTO: SubjectDto [] = [];
  selectedSubjects: SubjectDto [] = [];
  listSubject: DetailSubjectDto [] = [];
  replaceSubject: string = '';
  wannaSubject: DetailSubjectDto [] = [];
  suggestSubject: string[] = [];
  subjectDetail: DetailSubjectDto = {
    subject_name : "",
    lesson_number : [],
    day_in_week : [],
    end_day : [],
    start_day : [],
    subject_credits : 0,
    schedule_end: [],
    schedule: this.dateDTO
  }
  tmp_first :string = '';
  tmp_second : string = '';
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  selectedWannaDay: string[] = [];
  isSelected: { [key: string]: boolean } = {};
  loading : boolean = false;
  alertSubjectWrong: boolean = false;
  constructor(
   private scheduleService: ScheduleService
  ) {
  }
  ngOnInit() {
    this.updateCalendar();
  }
  toggleSelection(subject: string): void {
    if (this.isSelected[subject]) {
      this.selectedWannaDay = this.selectedWannaDay.filter(item => item !== subject);
    } else {
      this.selectedWannaDay.push(subject);
    }
    this.isSelected[subject] = !this.isSelected[subject];
  }
  selectDay(day: string) {
    this.selectedDay = day;
    // console.log(this.selectedDay);
  }
  addEvent() {
    // Thêm sự kiện vào danh sách events
    this.events.push({
      start: new Date(), // Ngày bắt đầu của sự kiện
      end: new Date(),   // Ngày kết thúc của sự kiện
      title: 'New Event' // Tiêu đề của sự kiện
    });
  }
  handleEvent(event: { event: CalendarEvent<any>; sourceEvent: MouseEvent | KeyboardEvent }): void {
    console.log('Event clicked:', event.event);
    // Thêm mã xử lý của bạn ở đây
  }
  selectedDate!: Date;
  startDay!: Date;
  endDay!: Date;

  dateSelected(date: Date) {
    if (!this.startDay || (date < this.startDay)) {
      this.startDay = date;
    } else if (!this.endDay || (date > this.endDay)) {
      this.endDay = date;
    } else {
      this.startDay = date;
      this.endDay = date;
    }
    this.selectedDate = date;
  }
  fetchData(){
    debugger;
    this.scheduleService.getSubjects(this.selectedCourse).subscribe({
      next: (response: any) =>{
        debugger;
        this.subjectDTO = response;
      },
      complete: () =>{
        debugger;
      },
      error: (error: any) =>{
        debugger;
        console.log("Error fetching data: "+error.error.message);
      }
    })
  }
  applySubject(event: any) {
    this.loading = true;
    // if (this.alertSubjectWrong){
    //   alert("Please select lab and theory class match!");
    //   this.alertSubjectWrong = false;
    //   return;
    // }
    debugger;
    if (!this.checkMatchSubject(event)) {
      if (this.selectedSubject && !this.selectedSubjects.some(subject => subject.subject_name === this.selectedSubject)) {
        this.selectedSubjects.push({subject_name: this.selectedSubject});
        this.selectedSubject = event.target.value; // Cập nhật selectedSubject với giá trị của option được chọn
      }
    }
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }
  removeFromList(subject: any) {
    const index = this.selectedSubjects.indexOf(subject);
    if (index !== -1) {
      this.selectedSubjects.splice(index, 1); // Xóa môn học khỏi danh sách
      this.suggestSubject.push(subject.subject_name);
      this.updateCalendar();
    }
  }
  checkContainSubject(subjectName: string): boolean {
    return this.selectedSubjects.some(subject => subject.subject_name === subjectName);
  }
  // Check this function
  checkMatchSubject(event : any): boolean{
    debugger;
    let originalSelectedSubjects = [...this.selectedSubjects];
    let clone : string = this.selectedSubject;
    let check : number = 0;
    let selectedTheory = 0;
    let selectedLab = 0;
    let indexTheory = 0;
    let indexLab = 0;
    let matchFound : boolean = false;
    this.selectedSubjects.forEach((subject) => {
      const index = subject.subject_name.indexOf("(");
      let subject_name = subject.subject_name.substring(0, index-1).trim();
      let subject_class = subject.subject_name.substring(index).trim();
      const dot_index = subject_class.indexOf(".");
      const clone_index = clone.indexOf("(");
      let clone_name = clone.substring(0, clone_index-1).trim();
      const clone_dot_index = clone.indexOf(".");
      let clone_class = clone.substring(clone_index,clone_dot_index).trim()+")";
      if (subject_name===clone_name) {
        if (dot_index==-1){
          selectedTheory++;
        } else {
          selectedLab++;
        }
        if (clone_dot_index==-1){
          indexTheory++;
        } else {
          indexLab++;
        }
      }
      debugger;
    })
    debugger;
    if (selectedTheory!=0&&selectedLab!=0){
      if (indexTheory!=0||indexLab!=0){
        this.selectedSubjects.forEach((subject) =>{
          debugger;
          const index_last = subject.subject_name.indexOf("(");
          let subject_name = subject.subject_name.substring(0, index_last-1).trim();
          let subject_class = subject.subject_name.substring(index_last).trim();
          const dot_index = subject_class.indexOf(".");
          const clone_index = clone.indexOf("(");
          let clone_name = clone.substring(0, clone_index-1).trim();
          const clone_dot_index = clone.indexOf(".");
          let clone_class = clone.substring(clone_index, clone_dot_index).trim()+")";
          if (subject_name===clone_name){
            if (dot_index==-1&&clone_dot_index==-1){
              let temp = subject.subject_name;
              subject.subject_name = this.selectedSubject;
              matchFound = true;
              debugger;
            }
            if (dot_index!=-1&&clone_dot_index!=-1){
              let temp = subject.subject_name;
              subject.subject_name = this.selectedSubject;
              matchFound = true;
            }
          }
        });
      }
    }
    if (selectedTheory!=0&&selectedLab==0){ // Trùng lớp lý thuyết
      if (indexLab!=0){
        // this.selectedSubjects.push(new SubjectDto(clone));
      }
      if (indexTheory!=0){
        this.selectedSubjects.forEach((response) => {
          debugger;
          const index_last = response.subject_name.indexOf("(");
          let subject_name = response.subject_name.substring(0, index_last-1).trim();
          let subject_class = response.subject_name.substring(index_last).trim();
          const dot_index = subject_class.indexOf(".");
          const clone_index = clone.indexOf("(");
          let clone_name = clone.substring(0, clone_index-1).trim();
          const clone_dot_index = clone.indexOf(".");
          let clone_class = clone.substring(clone_index, clone_dot_index).trim()+")";
          if (subject_name===clone_name){
            debugger;
            let temp = response.subject_name;
            response.subject_name = clone;

            matchFound = true;
          }
        });
      }
    }
    if (selectedTheory==0&&selectedLab!=0){ // Trùng lớp lý thuyết
      // if (indexLab!=0){
      //   // this.selectedSubjects.push(new SubjectDto(clone));
      // }
      if (indexLab!=0){
        this.selectedSubjects.forEach((response) => {
          debugger;
          const index_last = response.subject_name.indexOf("(");
          let subject_name = response.subject_name.substring(0, index_last-1).trim();
          let subject_class = response.subject_name.substring(index_last).trim();
          const dot_index = subject_class.indexOf(".");
          const clone_index = clone.indexOf("(");
          let clone_name = clone.substring(0, clone_index-1).trim();
          const clone_dot_index = clone.indexOf(".");
          let clone_class = clone.substring(clone_index, clone_dot_index).trim()+")";
          if (subject_name===clone_name){
            debugger;
            let temp = response.subject_name;
            response.subject_name = clone;
            matchFound = true;
          }
        });
      }
    }
    if (matchFound){
      this.listSubject = this.listSubject.filter(response => response.subject_name !== clone);
      this.updateCalendar();
      return matchFound;
    }

    return false;
  }
  checkLabSubject(selected: string){
    debugger;
  }
  // checkMatchSubject(event: any): boolean{
  //   debugger;
  //   this.selectedSubjects.forEach((subject) => {
  //     const index = subject.subject_name.indexOf("(");
  //     let subject_name = subject.subject_name.substring(0, index-1);
  //     let subject_class = subject.subject_name.substring(index);
  //     const dot_index = subject_class.indexOf(".");
  //     if (dot_index===-1) {
  //       this.subjectDTO.forEach((boss) => {
  //         const boss_index = boss.subject_name.indexOf("(");
  //         let boss_subject_name = boss.subject_name.substring(0, boss_index - 1);
  //         let boss_subject_class = boss.subject_name.substring(boss_index);
  //         let boss_dot_index = boss_subject_class.indexOf(".");
  //         let boss_lab = "";
  //         if (boss_dot_index!==-1){
  //           boss_subject_class = boss_subject_class.substring(0,boss_dot_index);
  //           boss_lab = boss_subject_class.substring(boss_dot_index+1);
  //           if (boss_subject_name === subject_name && boss_subject_class===subject_class){
  //             return true;
  //           }
  //         }
  //       })
  //     }
  //     debugger;
  //   })
  //   return false;
  // }
  updateSelected(subject_name: string){
    this.selectedSubject = subject_name;
  }
  formatDate(date: Date): string {
    // Cộng thêm 7 tiếng cho múi giờ
    date.setHours(date.getHours() + 7);
    // Định dạng ngày
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  }
  updateCalendar() {
    debugger;
    this.listSubject = [];
    this.listSingleSubjects = [];
    let dateList: Date[] = [];
    // Khai báo biến requests
    const requests: Observable<any>[] = [];

    this.selectedSubjects.forEach((subject) => {
      const request = this.scheduleService.getDetailSubject(subject.subject_name);
      requests.push(request);

      request.subscribe({
        next: (response: any) => {
          debugger;
          this.subjectDetail = response;
          let i = 0;
          if (dateList.length > 0) {
            let isError = false; // Biến để đánh dấu có lỗi hay không

            // Duyệt qua mỗi ngày trong schedule.schedule
            for (const date of this.subjectDetail.schedule.schedule) {
              // Kiểm tra xem ngày hiện tại đã tồn tại trong dateList hay không
              if (dateList.includes(date)) {
                isError = true;
                this.errorFound = true;
                break; // Thoát khỏi vòng lặp ngay sau khi phát hiện lỗi
              } else {
                dateList.push(date);
              }
            }

            if (!isError) {
              // Gán kết quả của concat() lại cho dateList
              dateList = dateList.concat(this.subjectDetail.schedule.schedule);
            } else {
              alert("An error has been founded!");
              if (this.tmp_second.length>0&&this.tmp_first.length>0) {
                for (let i = 0; i < this.selectedSubjects.length; i++) {
                  if (this.selectedSubjects[i].subject_name === this.tmp_second) {
                    this.selectedSubjects[i].subject_name = this.tmp_first;
                    break;
                  }
                }
                for (let i =0 ;i<this.suggestSubject.length ;i++){
                  if (this.suggestSubject[i]===this.tmp_first){
                    this.suggestSubject[i] = this.tmp_second;
                    break;
                  }
                }
                this.tmp_first = '';
                this.tmp_second ='';
              }
            }
          } else {
            // Gán kết quả của concat() lại cho dateList
            dateList = dateList.concat(this.subjectDetail.schedule.schedule);
          }
          this.listSubject.push(this.subjectDetail);
          this.subjectDetail.schedule.schedule.forEach((clone) => {
            let cloneSubject: SingleSubjectDto = {
              subject_name: '',
              day_in_week: 2,
              end: new Date(),
              start: new Date()
            }
            cloneSubject.subject_name = subject.subject_name;
            cloneSubject.start = new Date(clone);
            cloneSubject.day_in_week = this.subjectDetail.schedule.day_in_week.at(i)!;
            cloneSubject.end = new Date(this.subjectDetail.schedule_end.at(i)!);
            i++;
            this.listSingleSubjects.push(cloneSubject);
          })
          debugger;
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.log("Error fetching data: " + error.error.message);
        }
      })
    });

    // Chờ đợi tất cả các request hoàn tất
    forkJoin(requests).subscribe(() => {
      this.listSingleSubjects = this.listSingleSubjects.filter(item => item.start instanceof Date);
      this.listSingleSubjects.sort((a, b) => a.start.getTime() - b.start.getTime());
    });
    debugger;
  }
  changeToList(event: any, subject_name: string){
    this.loading = true;
    // this.selectedSubject = subject_name;
    let temp_first = "";
    let temp_second = "";
    let originalSelectedSubjects = [...this.selectedSubjects];
    if (!this.checkMatchSubject(event)) {
      let cnt = 0;
      this.selectedSubjects.forEach((response => {
        let responseDates: Date[] = [];

        this.listSubject.forEach(item => {
          responseDates = responseDates.concat(item.schedule.schedule);
        });

        if (response.subject_name.substring(0, response.subject_name.indexOf("(") - 1).trim()
          === subject_name.substring(0, subject_name.indexOf("(") - 1).trim()) {
          if ((response.subject_name.indexOf('.')!=-1&&subject_name.indexOf('.')!=-1)
            || (response.subject_name.indexOf(".")==-1 && subject_name.indexOf('.')==-1)) {

            let originalSubjectName = response.subject_name;
            let originalSuggestSubject = [...this.suggestSubject];

            let change = response.subject_name; // Lưu tên môn học hiện tại
            response.subject_name = subject_name; // Thay đổi tên môn học
            temp_first = response.subject_name;
            temp_second = subject_name;
            this.tmp_first = response.subject_name;
            this.tmp_second = subject_name;

            // Lưu lại vị trí của môn học trong mảng suggestSubject trước khi thay đổi
            for (let i =0 ;i < this.suggestSubject.length ;i ++){
              if (this.suggestSubject[i]===subject_name){
                debugger;
                this.suggestSubject[i] = change;
              }
            }
            this.updateCalendar();

            // Kiểm tra nếu có lỗi xảy ra
            // if(this.errorFound){
            //   // Khôi phục lại trạng thái trước khi thực hiện thay đổi
            //   this.suggestSubject = originalSuggestSubject;
            //   this.selectedSubjects = originalSelectedSubjects;
            //   let found : boolean = false;
            //   this.errorFound = false; // Reset biến errorFound
            // }

            cnt++;
          }
        }
      }))

      // Nếu không có môn học nào được thay đổi
      if (cnt==0){
        let clone: SubjectDto = {
          subject_name : subject_name
        }
        this.suggestSubject = this.suggestSubject.filter(response => response !== clone.subject_name);
        this.selectedSubjects.push(clone);
      }
    }

    setTimeout(() => {
      this.loading = false;
    }, 300);
  }

  suggestSubjects(){
    debugger;
    this.listSubject = [];
    this.loading = true;
    this.selectedSubjects = [];
    const requests: Observable<any>[] = [];
    if (this.selectedWannaDay.length==0||this.selectedCourse.length==0){
      alert("Please try again!");
      setTimeout(() => {
        this.loading = false;
      }, 300);
      return;
    }
    const request = this.scheduleService.wannaSubjects(this.selectedCourse, this.selectedWannaDay);
    requests.push(request);

    request.subscribe({
      next: (response: any) => {
        debugger;
        this.listSubject = response.subject_detail;
        this.suggestSubject = response.subject_suggest;
        this.listSubject.forEach((clone =>{
          let temp : SubjectDto = {
            subject_name: clone.subject_name
          }
          this.selectedSubjects.push(temp);
        }));
        this.listSubject.forEach((each =>{
          let i = 0;
          this.subjectDetail = each;
          each.schedule.schedule.forEach((clone =>{
            let cloneSubject: SingleSubjectDto = {
              subject_name: '',
              day_in_week: 2,
              end: new Date(),
              start: new Date()
            }
            cloneSubject.subject_name = this.subjectDetail.subject_name;
            cloneSubject.start = new Date(clone);
            cloneSubject.day_in_week = this.subjectDetail.schedule.day_in_week.at(i)!;
            cloneSubject.end = new Date(this.subjectDetail.schedule_end.at(i)!);
            i++;
            this.listSingleSubjects.push(cloneSubject);
          }))
        }))
        debugger;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.log("Error fetching data: " + error.error.message);
      }
    });
    forkJoin(requests).subscribe(() => {
      this.listSingleSubjects = this.listSingleSubjects.filter(item => item.start instanceof Date);
      this.listSingleSubjects.sort((a, b) => a.start.getTime() - b.start.getTime());
    });
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }
  protected readonly Date = Date;
}
