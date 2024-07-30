export class StudentScheduleDto{
  course_name: string;
  teacher: string;
  course_code: string;
  study_days: string;
  study_location: string;
  lessons: string;
  base_time: string;  // Add this line
  constructor(data: any) {
    this.course_name = data.course_name;
    this.teacher = data.teacher;
    this.course_code = data.course_code;
    this.study_days = data.study_days;
    this.study_location = data.study_location;
    this.lessons = data.lessons;
    this.base_time = data.base_time;
  }
}
