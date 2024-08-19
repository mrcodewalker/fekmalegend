import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent {
  location: string = '';
  teacher: string = '';
  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      debugger;
      this.location = data.description.substring(data.description.indexOf(":")+1, data.description.indexOf(",")).trim();
      this.teacher = data.description.substring(data.description.lastIndexOf(":")+1).trim();
      if (this.teacher.length<2){
        this.teacher = "Giảng viên mời";
      }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
