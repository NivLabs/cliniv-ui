import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CloseAttendanceRequest } from 'app/model/Attendance';

@Component({
  selector: 'app-close-event',
  templateUrl: './close-event.component.html',
  styleUrls: ['./close-event.component.css']
})
export class CloseEventComponent implements OnInit {

  public dataToForm: CloseAttendanceRequest;

  constructor(public dialogRef: MatDialogRef<CloseEventComponent>) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.dataToForm = new CloseAttendanceRequest();
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  save() {
    console.log(this.dataToForm);
  }

}
