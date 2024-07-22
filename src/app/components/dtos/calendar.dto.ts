import {StudentInfoDto} from "./student.info.dto";
import {StudentScheduleDto} from "./student.schedule.dto";

export class CalendarDto{
  message: string;
  code: string;
  student_info: StudentInfoDto;
  data: StudentScheduleDto[];
  constructor(data: any) {
    this.message = data.message;
    this.code = data.code;
    this.student_info = data.student_info;
    this.data = data.data;
  }
}
