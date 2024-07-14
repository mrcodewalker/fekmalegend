export class SingleSubjectDto{
  subject_name: string;
  start: Date;
  end: Date;
  day_in_week: number;

  constructor(data: any) {
    this.subject_name = data.subject_name;
    this.start = data.start;
    this.end = data.end;
    this.day_in_week = data.day_in_week;
  }
}
