export  class SubjectDto{
  subject_name: string;
  constructor(data: any) {
    this.subject_name = data.subject_name;
  }
}
