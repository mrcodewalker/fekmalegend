import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { GraphScoresService } from "../services/graph.scores.service";
import { SubjectsDataDto } from "../dtos/subjects.data.dto";
import {GraphRequestDto} from "../dtos/graph.request.dto";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-graph-scores',
  templateUrl: './graph-scores.component.html',
  styleUrls: ['./graph-scores.component.scss']
})
export class GraphScoresComponent implements OnInit {
  @ViewChild('myChart') myChartRef!: ElementRef; // Tham chiếu đến canvas
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  years: string[] = ['2020-2021', '2021-2022', '2022-2023', '2023-2024'];
  selectedSubject: string = 'Tiếng Anh 2';
  public barChartLabels = [];
  listSubjects: SubjectsDataDto[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    { data: [], label: '' }
  ];
  graphRequest: GraphRequestDto = {
    subject_name:  '',
    year_course: ''
  }
  selectedYear: string = '2020-2021';
  totalStudents: number = 0;
  equalsZero: number = 0;
  lessThanFour: number = 0;
  lessThanSix: number = 0;
  lessThanEight: number = 0;
  lessThanNine: number = 0;
  greaterThanNine: number = 0;
  lessThanFive: number = 0;
  eightToTen: number = 0;
  sevenToEight: number = 0;
  fiveToSeven: number = 0;
  valid: boolean = false;
  searchText = '';
  alertMessage: string[] = [];
  filteredSubjects = [...this.listSubjects];
  constructor(private graphScoreService: GraphScoresService,
              private authService: AuthService) {}

  ngOnInit(): void {
    const subject_name = this.authService.getSubjectName();
    const year_course = this.authService.getYearCourse();
    if (subject_name&&year_course){
      this.selectedSubject = subject_name;
      this.selectedYear = year_course;
    }
    this.collectSubjects();
    this.getGraph();
  }
   fetchData(): void {
    this.getGraph();
    console.log(`Fetching data for subject: ${this.selectedSubject}, year: ${this.selectedYear}`);
  }
  onSubjectChange(event: any) {
    this.selectedSubject = event.target.value;  // Update selected subject
  }

  async getGraph() {
    try {
      this.graphRequest = {
        year_course: this.selectedYear,
        subject_name: this.selectedSubject
      }
      // const response = await this.graphScoreService.getGraphScores(this.graphRequest).toPromise();
      const response = await this.graphScoreService.getGraphScores(this.graphRequest).toPromise();
      this.barChartLabels = response.score;
      this.barChartData = [
        {
          data: response.count,
          label: 'Số lượng',
        }
      ];
      this.totalStudents = response.total;
      this.equalsZero = response.equals_zero;
      this.lessThanFour = response.less_than_four;
      this.lessThanSix = response.less_than_six;
      this.lessThanEight = response.less_than_eight;
      this.lessThanNine = response.less_than_nine;
      this.greaterThanNine = response.greater_than_nine;
      this.lessThanFive = response.less_than_five;
      this.eightToTen = response.eight_to_ten;
      this.sevenToEight = response.seven_to_eight;
      this.fiveToSeven = response.five_to_seven;
      this.alertMessage = response.alert_message;
      this.valid = response.valid;
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  }
  filterSubjects() {
    const lowerSearchText = this.searchText.toLowerCase();
    this.filteredSubjects = this.listSubjects.filter(subject =>
      subject.subject_name.toLowerCase().includes(lowerSearchText)
    );
    if(this.filteredSubjects.length===1){
      this.selectedSubject = this.filteredSubjects[0].subject_name;
    }
  }
  selectSubject(subject: any) {
    this.selectedSubject = subject.subject_name;
    // console.log('Môn học đã chọn:', this.selectedSubject);
    // Gọi phương thức để cập nhật biểu đồ hoặc làm gì đó với subject
    // this.onSubjectChange(subject);
  }
  async collectSubjects() {
    try {
      // const subjects = await this.graphScoreService.getAllSubjects().toPromise();
      const subjects = await this.graphScoreService.getAllSubjects().toPromise();
      this.listSubjects = subjects;
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }
  onChartClick(event: any) {
    const chart = this.myChartRef.nativeElement.chartInstance; // Lấy instance của chart
    const activePoints = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);

    if (activePoints.length > 0) {
      const clickedIndex = activePoints[0].index;
      const selectedLabel = this.barChartLabels[clickedIndex];
    }
    debugger;
  }
}
