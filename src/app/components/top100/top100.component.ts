import { Component, OnInit, HostListener } from '@angular/core';
import { RankingDto } from '../dtos/ranking.dto';
import { RankingService } from '../services/ranking.service';
import {SingleStringDto} from "../dtos/single.string.dto";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-top100',
  templateUrl: './top100.component.html',
  styleUrls: ['./top100.component.scss']
})
export class Top100Component implements OnInit {
  searchTerm: string = '';
  students: RankingDto[] = [];
  loading: boolean = false;
  filteredStudents: any[] = [];
  selectedGrade: string = 'CT07';
  selectedRank: string = '';
  filterCode: SingleStringDto = {
    filter_code: ''
  }
  rankingOptions: string[] = [
    'CT08', 'DT07', 'AT20', 'CT07', 'DT06', 'AT19',
    'CT06', 'DT05', 'AT18', 'CT05', 'DT04', 'AT17'
  ];
  isDropdownOpen = false;
  dropdownElement: HTMLElement | null = null;

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.collectData();
    this.dropdownElement = document.querySelector('.select');
  }

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent event bubbling
    this.isDropdownOpen = !this.isDropdownOpen;
  
  }

  updateOption(option: any) {
    this.selectedGrade = option;
    this.isDropdownOpen = false; // Close dropdown after selecting an option
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.dropdownElement && !this.dropdownElement.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.dropdownElement && this.dropdownElement.contains(target)) {
      this.isDropdownOpen = true;
    }
  }


  fetchData() {
    // Simulate fetch data logic
    this.collectData();
  }

  async collectData() {
    this.loading = true;
    this.filterCode.filter_code = this.selectedGrade;
    try {
      const data = await this.rankingService.getListScholarship(this.filterCode).toPromise();
      this.students = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.loading = false;
    }
  }

  getRankClass(ranking: number): string {
    switch (ranking) {
      case 1: return 'top1';
      case 2: return 'top2';
      case 3: return 'top3';
      default: return '';
    }
  }
  exportToExcel(): void {
    // Tạo một workbook mới
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.students);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    // Tạo tệp và tải xuống
    XLSX.writeFile(wb, 'scholarship.xlsx');
  }
}
