import { Component, OnInit, Inject } from '@angular/core';
import { EvolutionInfo } from 'app/model/Evolution';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MedicalRecordService } from '../medical-record.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/pt-br';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-evolution',
  templateUrl: './evolution.component.html',
  styleUrls: ['./evolution.component.scss']
})
export class EvolutionComponent implements OnInit {

  dataToForm: EvolutionInfo;
  public loading = false;

  constructor(public dialogRef: MatDialogRef<EvolutionComponent>, @Inject(MAT_DIALOG_DATA) public data: EvolutionInfo, public principalService: MedicalRecordService,
    private notification: NotificationsComponent, private errorHandler: ErrorHandlerService) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    const attendanceId = this.dialogRef.componentInstance.data.attendanceId;
    if (attendanceId !== null) {
      this.dataToForm = new EvolutionInfo();
      this.dataToForm.attendanceId = attendanceId;
    } else {
      this.onCancelClick();
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  save() {
    this.loading = true;
    this.principalService.saveEvolution(this.dataToForm).then(resp => {
      this.loading = false;
      this.notification.showSucess("Evolução salva com sucesso!");
      this.dialogRef.close();
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error, this.dialogRef);
    });

  }

}
