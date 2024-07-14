export class ScheduleDto {
  subject_credits: number;
  subject_name: string;
  day_in_week: number;
  lesson_number: string;
  start_day: Date;
  end_day: Date;

  constructor(data: any) {
    this.subject_credits = data.subject_credits;
    this.subject_name = data.subject_name;
    this.day_in_week = data.day_in_week;
    this.lesson_number = data.lesson_number;
    this.start_day = data.start_day;
    this.end_day = data.end_day;
  }
}
