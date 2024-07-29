import {StudentScheduleDto} from "./student.schedule.dto";

export  class VirtualCalendarDto{
  course: string;
  details: StudentScheduleDto[];
  base_time: string;
  course_name: string;
  constructor(data: any) {
    this.course = data.course;
    this.details = data.details
    this.base_time = data.base_time;
    this.course_name = data.course_name;
  }
}
