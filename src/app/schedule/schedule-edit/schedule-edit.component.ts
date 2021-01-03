import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ScheduleInfo } from 'app/model/Schedule';
import * as moment from 'moment';

@Component({
  selector: 'app-schedule-edit',
  templateUrl: './schedule-edit.component.html',
  styleUrls: ['./schedule-edit.component.css']
})
export class ScheduleEditComponent implements OnInit {

  public dataToForm: ScheduleInfo;
  public responsibleControl: FormControl = new FormControl('', [Validators.required]);

  public loading = false;

  public responsibles = [];
  constructor(
    private dialogRef: MatDialogRef<ScheduleEditComponent>,
    private notification: NotificationsComponent,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.responsibles = this.dialogRef.componentInstance.data['responsibles'];
    this.dataToForm = this.dialogRef.componentInstance.data['schedule'];
    if (!this.dataToForm) {
      this.dataToForm = new ScheduleInfo();
    }
    if (!this.responsibles || this.responsibles.length == 0) {
      this.onCancelClick();
      this.notification.showWarning('Nenhum profissional habilitado para realizar atendimento');
    }
    console.log(this.dataToForm);
  }


  onCancelClick(): void {
    this.dialogRef.close();
  }

  enterKeyPress(event, type) {

  }

  save() {
    console.log(this.dataToForm);
  }

  selectResponsible(id) {

  }
}
