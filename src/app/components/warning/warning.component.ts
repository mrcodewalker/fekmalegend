import {Component, OnInit} from '@angular/core';
import {ScoreService} from "../services/score.service";
import {GraphScoresService} from "../services/graph.scores.service";
import {SubjectWarningDto} from "../dtos/subject.warning.dto";
import {AuthService} from "../services/auth.service";
import {GraphRequestDto} from "../dtos/graph.request.dto";
import {Router} from "@angular/router";

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit{
  yearsOption: string[] = [
    '2019-2020', '2020-2021', '2021-2022', '2022-2023', '2023-2024'
  ]
  loading: boolean = false;
  selectedYear: string = '2023-2024';
  subjects: SubjectWarningDto[] = [];
  filteredSubjects: SubjectWarningDto[] = [];
  subjectSearch: string = '';
  constructor(private graphScoreService: GraphScoresService,
              private authService: AuthService,
              private router: Router) {
  }
  ngOnInit() {
    this.filterByYear();
  }
  async filterByYear() {
    try {
      this.loading = true;
      const storedData = sessionStorage.getItem(this.selectedYear);
      if (storedData) {
        this.filteredSubjects = JSON.parse(storedData);
        this.loading = false;
        return;
      }
      // const data = await this.graphScoreService.getWarningSubjects(this.selectedYear).toPromise();
      const data = await this.graphScoreService.getWarningSubjects(this.selectedYear).toPromise();
      // Map data nhận được từ API vào cấu trúc subjects
      this.subjects = data.map((subject: any) => ({
        subject_name: subject.subject_name || '',  // Đảm bảo subject_name không undefined
        eight_to_ten: subject.eight_to_ten || 0,   // Giả sử eight_to_ten đã có từ API
        less_than_five: subject.less_than_five || 0,
        eight_to_ten_percent: (subject.eight_to_ten / subject.total) * 100 || 0, // Tính tỉ lệ học sinh 8-10
        less_than_five_percent: (subject.less_than_five / subject.total) * 100 || 0, // Tính tỉ lệ học sinh dưới 5
        alert_message: subject.alert_message && subject.alert_message.length > 0 ? subject.alert_message[0] : '', // Nếu alert_message là mảng, giữ lại thông điệp đầu tiên
        valid: subject.valid || false,  // Gán giá trị mặc định nếu valid không tồn tại
      }));
      this.filteredSubjects = this.subjects;
      sessionStorage.setItem(this.selectedYear, JSON.stringify(this.filteredSubjects));
      this.loading = false;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    }
  }
  filterSubjects() {
    const lowerSearchText = this.subjectSearch.toLowerCase();
    this.filteredSubjects = this.subjects.filter(subject =>
      subject.subject_name.toLowerCase().includes(lowerSearchText)
    );
  }
    redirectToGraph(subject: SubjectWarningDto){
      let clone: GraphRequestDto = {
        subject_name: subject.subject_name,
        year_course: this.selectedYear
      }
      this.authService.saveGraph(clone);
      this.router.navigate(['dashboard/admin/home']);
    }
}
