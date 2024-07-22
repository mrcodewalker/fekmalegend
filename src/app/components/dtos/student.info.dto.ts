export class StudentInfoDto{
  display_name: string;
  student_code: string;
  gender: string;
  birthday: string;
  constructor(data: any) {
    this.display_name = data.display_name;
    this.student_code = data.student_code;
    this.gender = data.gender;
    this.birthday = data.birthday;
  }
}
