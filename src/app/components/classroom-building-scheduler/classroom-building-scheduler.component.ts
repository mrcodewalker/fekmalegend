import { Component, OnInit } from '@angular/core';
import { ScoreService } from "../services/score.service";

interface Lesson {
  id: number;
  courseCode: string;
  courseName: string;
  dayOfWeek: number;
  periodStart: string;
  periodEnd: string;
  classroom: string;
  lecturer: string;
  startDate: number[];
  endDate: number[];
  studentQuantity: number;
}
interface RoomDetails {
  roomCode: string;
  courseName?: string;
  lecturer?: string;
  studentQuantity?: number;
  periodStart?: string;
  periodEnd?: string;
}
@Component({
  selector: 'app-classroom-building-scheduler',
  templateUrl: './classroom-building-scheduler.component.html',
  styleUrls: ['./classroom-building-scheduler.component.scss']
})
export class ClassroomBuildingSchedulerComponent implements OnInit {
  lessons: Lesson[] = [];
  filteredLessons: Lesson[] = [];
  floors: number[] = [1, 2, 3, 4, 5, 6, 7];
  selectedDate: string = '';
  selectedPeriod: string = '';
  expandedLessons: Lesson[] = [];
  selectedRoom: RoomDetails | null = null;
  constructor(private scoreService: ScoreService) {}

  ngOnInit() {
    this.fetchLessons();
    this.selectedDate = new Date().toISOString().split('T')[0]; // Set today's date as default
  }

  fetchLessons() {
    this.scoreService.fetchRoom('ki2-2024-2025').subscribe(
      data => {
        this.lessons = data;
        this.expandLessons();
        this.filterLessons();
      }
    );
  }
  showRoomDetails(event: MouseEvent) {
    const target = event.target as SVGRectElement
    const roomCode = target.getAttribute("data-room-code")
    if (roomCode) {
      const roomNumber = this.extractRoomNumber(roomCode)
      const roomLessons = this.filteredLessons.filter(
        (lesson) => this.extractRoomNumber(lesson.classroom) === roomNumber,
      )

      if (roomLessons.length > 0) {
        const roomLesson = roomLessons[0]
        this.selectedRoom = {
          roomCode: roomCode,
          courseName: roomLesson.courseName,
          lecturer: roomLesson.lecturer,
          studentQuantity: roomLesson.studentQuantity,
          periodStart: roomLesson.periodStart,
          periodEnd: roomLesson.periodEnd,
        }
      } else {
        this.selectedRoom = {
          roomCode: roomCode,
          courseName: "No class scheduled",
          lecturer: "N/A",
          studentQuantity: 0,
          periodStart: "N/A",
          periodEnd: "N/A",
        }
      }
      console.log(this.selectedRoom)
    }
  }
  private expandLessons() {
    this.expandedLessons = [];

    this.lessons.forEach(lesson => {
      const startDate = new Date(lesson.startDate[0], lesson.startDate[1] - 1, lesson.startDate[2]);
      const endDate = new Date(lesson.endDate[0], lesson.endDate[1] - 1, lesson.endDate[2]);

      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        if (date.getDay() + 1 === lesson.dayOfWeek) { // +1 vì getDay() trả về 0-6
          this.expandedLessons.push({
            ...lesson,
            startDate: [date.getFullYear(), date.getMonth() + 1, date.getDate()]
          });
        }
      }
    });
  }
  private extractRoomNumber(roomCode: string): string {
    const parts = roomCode.split(/[-_]/)
    // Return only the numeric part
    return parts[0].replace(/\D/g, "")
  }
  closeRoomDetails() {
    this.selectedRoom = null;
  }
  filterLessons() {
    if (!this.selectedDate) {
      this.filteredLessons = [];
      return;
    }

    const selectedDate = new Date(this.selectedDate);
    const dayOfWeek = selectedDate.getDay() + 1; // 1-7 for Monday-Sunday

    this.filteredLessons = this.lessons.filter(lesson => {
      const startDate = new Date(lesson.startDate[0], lesson.startDate[1] - 1, lesson.startDate[2]);
      const endDate = new Date(lesson.endDate[0], lesson.endDate[1] - 1, lesson.endDate[2]);

      const isDateInRange = selectedDate >= startDate && selectedDate <= endDate;
      const isDayMatch = lesson.dayOfWeek === dayOfWeek;

      const isPeriodMatch = this.selectedPeriod
        ? this.selectedPeriod.split(',').some(p =>
          parseInt(lesson.periodStart) <= parseInt(p) && parseInt(lesson.periodEnd) >= parseInt(p)
        )
        : true;

      return isDateInRange && isDayMatch && isPeriodMatch;
    });
    console.log(this.filteredLessons);
  }

  getRoomStatus(roomCode: string): string {
    const [roomNumber, building] = this.parseRoomCode(roomCode);
    const isOccupied = this.filteredLessons.some(lesson => {
      const [lessonRoomNumber, lessonBuilding] = this.parseRoomCode(lesson.classroom);
      return roomNumber === lessonRoomNumber && building === lessonBuilding;
    });
    return isOccupied ? 'occupied' : 'available';
  }

  getRoomTitle(roomCode: string): string {
    const [roomNumber, building] = this.parseRoomCode(roomCode);
    const occupyingLesson = this.filteredLessons.find(lesson => {
      const [lessonRoomNumber, lessonBuilding] = this.parseRoomCode(lesson.classroom);
      return roomNumber === lessonRoomNumber && building === lessonBuilding;
    });
    return occupyingLesson
      ? `${roomCode} - ${occupyingLesson.courseName} (${occupyingLesson.studentQuantity} students)`
      : `${roomCode} - Available`;
  }

  private parseRoomCode(roomCode: string): [string, string] {
    const match = roomCode.match(/^(\d+)[-_]?(.+)$/);
    if (match) {
      return [match[1], match[2]]; // [roomNumber, building]
    }
    return ['', '']; // Default if parsing fails
  }
}
