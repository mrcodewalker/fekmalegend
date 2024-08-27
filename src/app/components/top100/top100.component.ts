import {Component, OnInit} from '@angular/core';
import {RankingDto} from "../dtos/ranking.dto";
import {RankingService} from "../services/ranking.service";

@Component({
  selector: 'app-top100',
  templateUrl: './top100.component.html',
  styleUrls: ['./top100.component.scss']
})
export class Top100Component implements OnInit{
  searchTerm: string = '';
  students: RankingDto[] = [];
  loading: boolean = false;
  filteredStudents: any[] = [];
  selectedRank: string = '';
  uniqueRanks: number[] = [];
  constructor(private rankingService: RankingService) {
  }
  ngOnInit() {
    this.collectData();
  }
  filterByRank() {
    if (this.selectedRank === '') {
      this.filteredStudents = [...this.students];
    } else {
      this.filteredStudents = this.students.filter(student => student.ranking === Number(this.selectedRank));
    }
  }
  async collectData(){
    this.loading = true;
    const data = await this.rankingService.getListTop100().toPromise();
    this.loading = false;
    debugger;
    this.students = data.ranking_list;
  }
  getRankClass(ranking: number): string {
    switch (ranking) {
      case 1: return 'top1';
      case 2: return 'top2';
      case 3: return 'top3';
      default: return '';
    }
  }
}
