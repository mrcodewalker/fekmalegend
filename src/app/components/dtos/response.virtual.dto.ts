import {StudentScheduleDto} from "./student.schedule.dto";
import {VirtualCalendarDto} from "./virtual.calendar.dto";

export  class ResponseVirtualDto{
  message: string;
  virtual_calendar: VirtualCalendarDto[];
  code: string;
  constructor(data: any) {
    this.message = data.message;
    this.virtual_calendar = data.virtual_calendar
    this.code = data.code;
  }
}
