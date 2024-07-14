export class ScoreDto{
  subject_name: string;
  score_text: string;
  score_first: number;
  score_second: number;
  score_final: number;
  score_over_rall: number;

  constructor(data: any) {
   this.subject_name = data.subject_name;
   this.score_text = data.score_text;
   this.score_first = data.score_first;
   this.score_second = data.score_second;
   this.score_final = data.score_final;
   this.score_over_rall = data.score_over_rall;
  }
}
