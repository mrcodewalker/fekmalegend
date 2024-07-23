import {StudentInfoDto} from "./student.info.dto";
import {StudentScheduleDto} from "./student.schedule.dto";
import {DataDto} from "./data.dto";

export class CalendarDto{
  message: string;
  code: string;
  data: DataDto;
  constructor(data: any) {
    this.message = data.message;
    this.code = data.code;
    this.data = data.data;
  }
}
