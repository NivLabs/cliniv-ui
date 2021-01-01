import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ScheduleInfo } from 'app/model/Schedule';

@Component({
  selector: 'app-schedule-edit',
  templateUrl: './schedule-edit.component.html',
  styleUrls: ['./schedule-edit.component.css']
})
export class ScheduleEditComponent implements OnInit {

  public dataToForm: ScheduleInfo;
  public dateSelected: Date;
  public timeSelected: Date;
  public responsibleControl: FormControl = new FormControl('', [Validators.required]);
  public dateSelectControl: FormControl = new FormControl('', [Validators.required]);
  public timeSelectControl: FormControl = new FormControl('', [Validators.required]);

  public responsibles = [];
  constructor(
    public dialogRef: MatDialogRef<ScheduleEditComponent>
  ) { }

  ngOnInit(): void {
    this.dataToForm = new ScheduleInfo();
    console.log(this.dataToForm);
  }


  onCancelClick(): void {
    this.dialogRef.close();
  }
}
