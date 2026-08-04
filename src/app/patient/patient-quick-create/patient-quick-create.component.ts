import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { PatientQuickCreate } from 'app/model/Patient';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-quick-create',
  templateUrl: './patient-quick-create.component.html'
})
export class PatientQuickCreateComponent {

  public loading = false;
  public dataToForm: PatientQuickCreate = new PatientQuickCreate();

  constructor(public dialogRef: MatDialogRef<PatientQuickCreateComponent>, private patientService: PatientService,
    private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
    this.dialogRef.disableClose = true;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.dataToForm.isMinor && !this.dataToForm.guardianName) {
      this.notification.showWarning('Informe o nome do responsável para paciente menor de idade');
      return;
    }
    this.loading = true;
    this.patientService.createQuick(this.dataToForm).then(resp => {
      this.loading = false;
      this.notification.showSucess('Paciente pré-cadastrado com sucesso!');
      this.dialogRef.close(resp);
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error, this.dialogRef);
    });
  }

}
