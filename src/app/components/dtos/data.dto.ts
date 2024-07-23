import {StudentInfoDto} from "./student.info.dto";
import {StudentScheduleDto} from "./student.schedule.dto";

export class DataDto{
  student_info: StudentInfoDto;
  student_schedule: StudentScheduleDto[];
  constructor(data: any) {
    this.student_info = data.student_info;
    this.student_schedule = data.student_schedule;
  }
}
