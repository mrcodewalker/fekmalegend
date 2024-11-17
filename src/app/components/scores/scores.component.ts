import {ChangeDetectorRef, Component, HostListener, Input, OnInit} from '@angular/core';
import {ScoreService} from "../services/score.service";
import {ScoreDto} from "../dtos/score.dto";
import {StudentDto} from "../dtos/student.dto";
import {ScoreResponse} from "../responses/score.response";
import {RankingDto} from "../dtos/ranking.dto";
import {RankingService} from "../services/ranking.service";
import {SearchService} from "../services/search.service";
import {style} from "@angular/animations";
import {SubjectDto} from "../dtos/subject.dto";
import * as XLSX from "xlsx";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss', './fonts/icomoon/style.css', './css/style.css', './css/owl.carousel.min.css',
  './css/bootstrap.min.css']
})
export class ScoresComponent implements OnInit{
  scores: ScoreDto[] = [];
  student_code: string = "";
  loading: boolean = false;
  id: number = 0;
  message: string = `Xuất sắc: [9;10] => 4.0 => A+<br>
        Giỏi: [8.5;8.9] => 3.8 => A<br>
        Khá: [7.8;8.4] => 3.5 => B+<br>
        Khá: [7.0;7.7] => 3.0 => B<br>
        Trung bình: [6.3;6.9] => 2.4 => C+<br>
        Trung bình: [5.5,6.2] => 2.0 => C<br>
        Trung bình yếu: [4.8;5.4] => 1.5 => D+<br>
        Trung bình yếu: [4.0,4.7] => 1.0 => D<br>
        Kém [0;3.9] => 0.0 => F`;

  selectedGrade: string = "Xếp hạng trường";
  classRanking: boolean = false;
  schoolRanking: boolean = true;
  hitButton: boolean = false;
  historyOptions: StudentDto[] = [];
  searched: StudentDto[] = [];
  topRanking: RankingDto[] = [];
  rankingOptions: string[] = [
    "Xếp hạng khóa",
    "Xếp hạng khối",
    "Xếp hạng trường",
    "Xếp hạng lớp",
    "Xếp hạng chuyên ngành",
    "Xếp hạng theo kì gần nhất"
  ];
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
              private dialog: MatDialog,
              private cdr: ChangeDetectorRef) {
  }


  ngOnInit() {
    const history = localStorage.getItem('historyOptions');
    if (history){
      this.historyOptions = JSON.parse(history);
    }

    this.topRanking = [];
    this.loading = true;

    this.rankingService.getListRanking().subscribe({
      next: (response : any) => {
        this.cloneRanking = response;
        this.topRanking = response;
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
  async fetchData() {
    if (this.student_code.length<7){
      await this.openDialog('Warning', "Please enter your student code!");
      return;
    }
    this.loading = true;

    if (this.selectedGrade.toString() === "" || this.selectedGrade.toString().length <= 1) {
      alert("You must choose selection");
      this.loading = false;
      return;
    }

    this.subjectsFailed = 0;
    this.scores = [];
    this.id = 0;
    console.log("Đã bấm nút search");

    try {
      // Fetch scores
      const response = await this.scoreService.getScoresByStudentCode(this.student_code).toPromise();
      this.subjectList = [];
      this.student = response.student_response;

      let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

      let existingStudent = searchHistory.find((student: any) => student.student_code === this.student.student_code);

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
          subject_name: scoreItem.subject_name,
          score_first: scoreItem.score_first,
          score_second: scoreItem.score_second,
          score_final: scoreItem.score_final,
          score_over_rall: scoreItem.score_over_rall,
          score_text: scoreItem.score_text,
          subject_credit: scoreItem.subject_credit
        };
        if (this.scores) this.scores.push(score);
      });

      this.updateFailedSubjects();

      // Fetch ranking based on selectedGrade
      let rankingResponse;
      switch (this.selectedGrade.toString().toLowerCase()) {
        case "xếp hạng trường":
          rankingResponse = await this.rankingService.getRanking(this.student_code).toPromise();
          break;
        case "xếp hạng khóa":
          rankingResponse = await this.rankingService.getBlockRanking(this.student_code).toPromise();
          break;
        case "xếp hạng chuyên nghành":
          rankingResponse = await this.rankingService.getMajorRanking(this.student_code).toPromise();
          break;
        case "xếp hạng lớp":
          rankingResponse = await this.rankingService.getClassRanking(this.student_code).toPromise();
          break;
        case "xếp hạng khối":
          rankingResponse = await this.rankingService.getBlockDetailRanking(this.student_code).toPromise();
          break;
        case "xếp hạng theo kì gần nhất":
          rankingResponse = await this.rankingService.getScholarShip(this.student_code).toPromise();
          this.collectData = rankingResponse.ranking_list;
          this.subjectList = rankingResponse.subjects_list;
          if (this.collectData.length === 4) {
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
            };
            this.topRanking = this.collectData;
          }
          break;
        default:
          throw new Error("Invalid grade selection");
      }

      if (this.selectedGrade.toString().toLowerCase() !== "xếp hạng theo kì gần nhất") {
        this.collectData = rankingResponse;
        this.ranking = this.collectData[0];
        this.topRanking = this.collectData.slice(1);
      }

      this.hitButton = false;

    } catch (error) {
      console.log("Error fetching data: " + (error as Error).message);
      this.hitButton = false;
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
      setTimeout(() => {
        const exists = this.historyOptions.some(code => code.student_code === this.student_code);
        if (!exists) {
          if (this.student_code !== '' && this.student_code !== null && this.student_code.length > 6) {
            this.historyOptions.push(this.student);
            localStorage.setItem('historyOptions', JSON.stringify(this.historyOptions));
          }
        }
      }, 2000);
    }
  }

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
  deleteHistory(index: any, event: Event){
    event.stopPropagation();
    this.historyOptions = this.historyOptions.filter(student => student!==index);
    localStorage.setItem('historyOptions', JSON.stringify(this.historyOptions));
  }
  updateOption(option: any){
    this.selectedGrade = option;
  }
  isDropdownOpen = false;

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent event bubbling
    this.isDropdownOpen = !this.isDropdownOpen;
  }

// Close the dropdown if clicking outside of it
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!this.isDropdownOpen) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.select')) {
      this.isDropdownOpen = false;
    }
  }
  openDialog(title: string, message: string): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title, message },
      width: '400px'
    });

    return dialogRef.afterClosed().toPromise();
  }
  clickExportData(): void{
    this.action='export';
    this.openModalData();
  }
  showTable: boolean = false;
  clickPreview(): void{
    this.action='preview';
    this.showTable=!this.showTable;
  }
  async exportData():Promise<void> {
    if (this.scores?.length === 0) {
      await this.openDialog('Warning', 'Nothing in your score list!');
      return;
    }
    const scoresWithAdditionalProperties = this.scores.map((score) => ({
      ...score,  // Sao chép các thuộc tính cũ từ đối tượng score
      student_name: this.ranking.student_name,
      student_code: this.student_code,
      student_class: this.ranking.student_class,
      gpa: this.ranking.gpa,
      ranking: this.ranking.ranking,
      asia_gpa: this.ranking.asia_gpa,
      createdAt: new Date().toISOString(),
      updatedBy: 'Mr.CodeWalker',
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(scoresWithAdditionalProperties);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scores');

    // Tạo tệp và tải xuống
    XLSX.writeFile(wb, 'MyScores_KMA_LEGEND.xlsx');
  }
  isModalOpen: boolean = false;

  openModalData(): void {
    this.isModalOpen = true;
  }

  async onConfirm(): Promise<void> {
    if (this.action==='export') await this.exportData();
    this.isModalOpen = false;
  }

  onCancel(): void {
    this.isModalOpen = false;
  }
  handleClose(): void{
    this.showTable=false;
  }
  action: string = '';
}
