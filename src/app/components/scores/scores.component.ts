import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ScoreService} from "../services/score.service";
import {ScoreDto} from "../dtos/score.dto";
import {StudentDto} from "../dtos/student.dto";
import {error} from "@angular/compiler-cli/src/transformers/util";
import * as ts from 'typescript';
import {ScoreResponse} from "../responses/score.response";
import {RankingDto} from "../dtos/ranking.dto";
import {RankingService} from "../services/ranking.service";
import {SearchService} from "../services/search.service";
import {style} from "@angular/animations";
import {SubjectDto} from "../dtos/subject.dto";

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss', './fonts/icomoon/style.css', './css/style.css', './css/owl.carousel.min.css',
  './css/bootstrap.min.css']
})
export class ScoresComponent implements OnInit{
  scores?: ScoreDto[];
  student_code: string = "";
  loading: boolean = false;
  id: number = 0;
  selectedGrade: string = "Xếp hạng trường";
  classRanking: boolean = false;
  schoolRanking: boolean = true;
  hitButton: boolean = false;
  searched: StudentDto[] = [];
  topRanking: RankingDto[] = [];
  subjectsFailed: number = 0;
  subjectList: SubjectDto[] = [];
  cloneRanking: RankingDto = {
    student_name: '',
    student_code: '',
    student_class: '',
    ranking: 0,
    gpa: 0,
    asia_gpa: 0
  }
  student: StudentDto = {
    student_code: "",
    student_class: "",
    student_name: ""
  }
  ranking: RankingDto = {
    student_name: '',
    student_code: '',
    student_class: '',
    ranking: 0,
    gpa: 0,
    asia_gpa: 0
  }
  collectData : RankingDto[] = [];
  constructor(private scoreService: ScoreService,
              private rankingService: RankingService,
              private searchService: SearchService,
              private cdr: ChangeDetectorRef) {
  }


  ngOnInit() {

    this.topRanking = [];
    this.loading = true;
    this.rankingService.getListRanking().subscribe({
      next: (response : any) => {
        this.cloneRanking = response;
        this.topRanking = response;
        debugger;
      },
      complete: () => {
        this.cdr.detectChanges()
        setTimeout(() => {
          this.loading = false;
          this.hitButton = false;
        }, 100);
      },
      error: (err: any) => {
        console.log("Error fetching data" + err.error.message);
      }
    })

    this.searchService.searchButtonClick$.subscribe(() => {
      this.hitButton=true;
    });
    // localStorage.removeItem('searchHistory');
    // Lấy dữ liệu từ localStorage
    const searchHistory = localStorage.getItem('searchHistory');

    if (searchHistory) {
      // Chuyển đổi chuỗi JSON thành mảng đối tượng StudentDTO
      this.searched = JSON.parse(searchHistory);

    } else {
      const searched: StudentDto[] = [];
    }

  }
  getMedalIcon(ranking: number): string {
    switch (ranking) {
      case 1:
        return 'https://img.icons8.com/plasticine/100/gold-medal.png';
      case 2:
        return 'https://img.icons8.com/office/100/medal-second-place.png';
      case 3:
        return 'https://img.icons8.com/external-flaticons-flat-flat-icons/100/external-bronze-medal-achievements-flaticons-flat-flat-icons-2.png';
      default:
        return ''; // Hoặc icon mặc định
    }
  }
  fetchData(){
    this.loading = true;
    // if (!this.searched.indexOf(this.student)){
    //   this.searched.push(this.student);
    //   localStorage.setItem('searchHistory', this.searched.toString());
    //   debugger;
    // }
    if (this.selectedGrade.toString()===""||this.selectedGrade.toString().length<=1){
      alert("You must choose selection");
    }
      this.subjectsFailed = 0;
      this.scores = [];

      this.id = 0;
      console.log("Đã bấm nút search");
      this.scoreService.getScoresByStudentCode(this.student_code).subscribe({
        next: (response: any) => {
          this.subjectList = [];

          this.student = response.student_response;
          // if (localStorage.getItem('searchHistory')?.valueOf())
          // localStorage.setItem("searchHistory", localStorage.getItem('searchHistory')?.valueOf()+this.student)
          let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

// Kiểm tra xem student_code đã tồn tại trong searchHistory hay không
          let existingStudent = searchHistory.find((student: any) => student.student_code === this.student.student_code);

// Nếu student_code chưa tồn tại, thêm phần tử mới vào
          if (!existingStudent) {
            searchHistory.unshift({
              student_class: this.student.student_class,
              student_code: this.student.student_code,
              student_name: this.student.student_name
            });

            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
          }

          response.scores_response.forEach((scoreItem: ScoreResponse) => {
            const score: ScoreDto = {
              score_over_rall: scoreItem.score_over_rall,
              score_final: scoreItem.score_final,
              score_second: scoreItem.score_second,
              score_first: scoreItem.score_first,
              score_text: scoreItem.score_text,
              subject_name: scoreItem.subject_name
            };

            if (this.scores) this.scores.push(score);
          });
          this.updateFailedSubjects();

          if (this.selectedGrade.toString().toLowerCase()==="xếp hạng trường") {
            this.rankingService.getRanking(this.student_code).subscribe({
              next: (response: any) => {

                this.collectData = response;
                this.ranking = this.collectData[0];
                this.topRanking = this.collectData.slice(1);
              },
              complete: () => {

                this.hitButton = false;
              },
              error: (error: any) => {

                console.log("Error fetching data " + error.error.message);
              }
            })
          } else {
            if (this.selectedGrade.toString().toLowerCase()==="xếp hạng khóa"){
              this.rankingService.getBlockRanking(this.student_code).subscribe({
                next: (response: any) => {

                  this.collectData = response;
                  this.ranking = this.collectData[0];
                  this.topRanking = this.collectData.slice(1);
                },
                complete: () => {

                  this.hitButton = false;
                },
                error: (error: any) => {

                  console.log("Error fetching data " + error.error.message);
                }
              })
            } else
            if (this.selectedGrade.toString().toLowerCase()==="xếp hạng chuyên nghành"){
              this.rankingService.getMajorRanking(this.student_code).subscribe({
                next: (response: any) => {

                  this.collectData = response;
                  this.ranking = this.collectData[0];
                  this.topRanking = this.collectData.slice(1);
                },
                complete: () => {

                  this.hitButton = false;
                },
                error: (error: any) => {

                  console.log("Error fetching data " + error.error.message);
                }
              })
            } else {
              if (this.selectedGrade.toString().toLowerCase()==="xếp hạng lớp"){
                this.rankingService.getClassRanking(this.student_code).subscribe({
                  next: (response: any) => {

                    this.collectData = response;
                    this.ranking = this.collectData[0];
                    this.topRanking = this.collectData.slice(1);
                  },
                  complete: () => {

                    this.hitButton = false;
                  },
                  error: (error: any) => {

                    console.log("Error fetching data " + error.error.message);
                  }
                })
              } else {
                if (this.selectedGrade.toString().toLowerCase()==="xếp hạng khối"){
                  this.rankingService.getBlockDetailRanking(this.student_code).subscribe({
                    next: (response: any) => {

                      this.collectData = response;
                      this.ranking = this.collectData[0];
                      this.topRanking = this.collectData.slice(1);
                    },
                    complete: () => {

                      this.hitButton = false;
                    },
                    error: (error: any) => {

                      console.log("Error fetching data " + error.error.message);
                    }
                  })
                } else {
                  if (this.selectedGrade.toString().toLowerCase()==="xếp hạng theo kì"){
                    this.rankingService.getScholarShip(this.student_code).subscribe({
                      next: (response: any) => {

                        this.collectData = response.ranking_list;
                        this.subjectList = response.subjects_list;
                        if (this.collectData.length===4) {
                          this.ranking = this.collectData[0];
                          this.topRanking = this.collectData.slice(1);
                        } else {
                          this.ranking = {
                            ranking: 0,
                            gpa: 0,
                            asia_gpa: 0,
                            student_code: this.student_code,
                            student_class: "",
                            student_name: ""
                          }
                          this.topRanking = this.collectData;
                        }
                      },
                      complete: () => {

                        this.hitButton = false;
                      },
                      error: (error: any) => {

                        console.log("Error fetching data " + error.error.message);
                      }
                    })
                  }
                }
              }
            }
          }
        },
        complete: () => {

          this.hitButton = false;
        },
        error: (error: any) => {

          console.log("Error fetching data: " + error.error.message);
        }
      })
      console.log(this.student.student_name+"\n"+this.scores?.toString());
      this.cdr.detectChanges()
    setTimeout(() => {
      this.loading = false;
      this.hitButton = false;
    }, 2000);  }
  onSubmit() {
    this.fetchData();
  }
  updateFailedSubjects() {
    // Tính toán số môn học trượt ở đây
    this.subjectsFailed = 0;
    if (this.scores)
    for (let score of this.scores) {
      if (score.score_text === 'F'||score.score_final<4) {
        this.subjectsFailed++;
      }
    }
  }
  patchValue(id: number){
    this.id = id;
  }
  updateStudentCode(studentCode: string){
    this.student_code = studentCode;
    this.fetchData();
  }
  isSubjectInList(subjectName: string): boolean {
    return this.subjectList.some(subject => subject.subject_name === subjectName);
  }
  checkContainInList(subjectName: string): boolean {
    return this.subjectList.some(response =>
      response.subject_name.toLowerCase() === subjectName.toLowerCase()
    );
  }
  protected readonly style = style;
  protected readonly alert = alert;
  deleteHistory(index: any){
    this.searched = this.searched.filter(student => student!==index);
  }
}
