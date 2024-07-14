export  class StudentDto{
  student_code: string;
  student_name: string;
  student_class: string;
  constructor(data: any) {
    this.student_code = data.student_code;
    this.student_name = data.student_name;
    this.student_class = data.student_class;
  }
}
