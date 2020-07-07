import { Component, OnInit, Inject } from '@angular/core';
import { EvolutionInfo } from 'app/model/Evolution';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-evolution',
  templateUrl: './evolution.component.html',
  styleUrls: ['./evolution.component.scss']
})
export class EvolutionComponent implements OnInit {

  dataToForm: EvolutionInfo;

  constructor(public dialogRef: MatDialogRef<EvolutionComponent>, @Inject(MAT_DIALOG_DATA) public data: EvolutionInfo) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.dialogRef.componentInstance.data.attendanceId);
    if (this.dialogRef.componentInstance.data.attendanceId !== null) {
      this.dataToForm = new EvolutionInfo();
    } else {
      this.onCancelClick();
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  save() {

  }

}
