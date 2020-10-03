import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CloseAttendanceRequest } from 'app/model/Attendance';

@Component({
  selector: 'app-close-event',
  templateUrl: './close-event.component.html',
  styleUrls: ['./close-event.component.css']
})
export class CloseEventComponent implements OnInit {

  public dataToForm: CloseAttendanceRequest;
  private attendanceId: number;

  constructor(public dialogRef: MatDialogRef<CloseEventComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.attendanceId = this.dialogRef.componentInstance.data.attendanceId;
    if (this.attendanceId) {
      this.dataToForm = new CloseAttendanceRequest();
    } else {
      this.onCancelClick();
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  save() {
    console.log('id: ', this.attendanceId, 'form: ', this.dataToForm);
  }

}
