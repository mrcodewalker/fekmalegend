import {Component, EventEmitter, Input, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
interface Grade {
  level: string;
  range: string;
  gpa: string;
  letter: string;
}
@Component({
  selector: 'app-grade-table',
  template: `
    <div class="table-container" [@tableState]="isVisible ? 'visible' : 'hidden'" *ngIf="isVisible">
      <div class="overlay" (click)="onClose()"></div>
      <div class="table-wrapper">
        <div class="close-button" (click)="onClose()">×</div>
        <h2 class="title">Bảng Quy Đổi Điểm KMA</h2>
        <table class="grade-table">
          <thead>
          <tr>
            <th>Xếp loại</th>
            <th>Thang điểm 10</th>
            <th>Điểm hệ 4</th>
            <th>Điểm chữ</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let grade of grades" [ngClass]="{'highlight': grade.letter === 'A+'}">
            <td>{{grade.level}}</td>
            <td>{{grade.range}}</td>
            <td>{{grade.gpa}}</td>
            <td>{{grade.letter}}</td>
          </tr>
          </tbody>
        </table>
        <p class="footer">Nếu có vấn đề gì hãy liên hệ CodeWalker</p>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      cursor: pointer;
    }

    .table-wrapper {
      position: relative;
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      max-width: 800px;
      width: 90%;
      z-index: 1001;
    }

    .close-button {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      transition: color 0.3s ease;
    }

    .close-button:hover {
      color: #000;
    }

    .title {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 25px;
      font-size: 24px;
      font-weight: bold;
    }

    .grade-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .grade-table th, .grade-table td {
      padding: 12px;
      text-align: center;
      border: 1px solid #ddd;
    }

    .grade-table th {
      background-color: #3498db;
      color: white;
      font-weight: bold;
    }

    .grade-table tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    .grade-table tr:hover {
      background-color: #f5f5f5;
      transition: background-color 0.3s ease;
    }

    .highlight {
      background-color: #e8f5e9 !important;
    }

    .footer {
      text-align: center;
      color: #7f8c8d;
      margin-top: 20px;
      font-style: italic;
    }

    @media (max-width: 600px) {
      .table-wrapper {
        padding: 15px;
        width: 95%;
      }

      .grade-table th, .grade-table td {
        padding: 8px;
        font-size: 14px;
      }
    }
  `],
  animations: [
    trigger('tableState', [
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.7)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('hidden => visible', [
        animate('0.3s ease-out')
      ]),
      transition('visible => hidden', [
        animate('0.2s ease-in')
      ])
    ])
  ]
})
export class GradeTableComponent {
  @Input() isVisible: boolean = false;
  @Output() closeTable = new EventEmitter<void>();
  grades = [
    { level: "Xuất sắc", range: "[9.0 - 10.0]", gpa: "4.0", letter: "A+" },
    { level: "Giỏi", range: "[8.5 - 8.9]", gpa: "3.8", letter: "A" },
    { level: "Khá", range: "[7.8 - 8.4]", gpa: "3.5", letter: "B+" },
    { level: "Khá", range: "[7.0 - 7.7]", gpa: "3.0", letter: "B" },
    { level: "Trung bình", range: "[6.3 - 6.9]", gpa: "2.4", letter: "C+" },
    { level: "Trung bình", range: "[5.5 - 6.2]", gpa: "2.0", letter: "C" },
    { level: "Trung bình yếu", range: "[4.8 - 5.4]", gpa: "1.5", letter: "D+" },
    { level: "Trung bình yếu", range: "[4.0 - 4.7]", gpa: "1.0", letter: "D" },
    { level: "Kém", range: "[0.0 - 3.9]", gpa: "0.0", letter: "F" }
  ];

  onClose() {
    this.closeTable.emit();
  }
}
