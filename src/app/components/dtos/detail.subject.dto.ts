import {DateDto} from "./date.dto";

export class DetailSubjectDto{
  subject_name: string;
  subject_credits: number;
  day_in_week: number[];
  lesson_number: string[];
  start_day: Date[];
  end_day: Date[];
  schedule: DateDto;
  schedule_end: Date[];

  constructor(data: any) {
    this.subject_name = data.subject_name;
    this.subject_credits = data.subject_credits;
    this.day_in_week = data.day_in_week;
    this.lesson_number = data.lesson_number;
    this.start_day = data.start_day;
    this.end_day = data.end_day;
    this.schedule = data.schedule;
    this.schedule_end = data.schedule_end;
  }
}
