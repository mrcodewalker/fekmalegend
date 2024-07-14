export class DateDto{
  day_in_week: number[];
  schedule: Date[];

  constructor(data: any) {
    this.day_in_week = data.day_in_week;
    this.schedule = data.schedule;
  }
}
