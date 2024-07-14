export class RankingDto{
  student_name: string;
  student_code: string;
  student_class: string;
  ranking: number;
  gpa: number;
  asia_gpa: number;

  constructor(data: any) {
    this.student_name = data.student_name;
    this.student_code = data.student_code;
    this.student_class = data.student_class;
    this.ranking = data.ranking;
    this.gpa = data.gpa;
    this.asia_gpa = data.asia_gpa;
  }
}
