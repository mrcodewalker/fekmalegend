export class UpdateDataDto{
  id: string;
  content:string;
  constructor(data: any) {
    this.id = data.id;
    this.content = data.content;
  }
}
