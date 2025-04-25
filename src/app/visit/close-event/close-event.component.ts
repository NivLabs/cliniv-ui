import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { CloseAttendanceRequest } from 'app/model/Attendance';
import { MedicalRecordService } from '../medical-record.service';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/pt-br';

@Component({
  selector: 'app-close-event',
  templateUrl: './close-event.component.html',
  styleUrls: ['./close-event.component.css']
})
export class CloseEventComponent implements OnInit {

  public dataToForm: CloseAttendanceRequest;
  public loading: boolean;
  private attendanceId: number;

  constructor(
    public dialogRef: MatDialogRef<CloseEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public medicalRecService: MedicalRecordService,
    public errorHandler: ErrorHandlerService,
    public notification: NotificationsComponent) {
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
    this.loading = true;
    this.medicalRecService.closeAttendance(this.attendanceId, this.dataToForm)
      .then(resp => {
        this.notification.showSucess("Atendimento encerrado com sucesso!");
        this.onCancelClick();
      })
      .catch(error => this.errorHandler.handle(error, this.dialogRef))
      .then(() => this.loading = false);
  }

  onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }

}
