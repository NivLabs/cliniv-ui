import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { PatientInfo } from 'app/model/Patient';
import { PatientService } from 'app/patient/patient.service';

@Component({
  selector: 'app-patient-register',
  templateUrl: './patient-register.component.html',
  styleUrls: ['./patient-register.component.css']
})
export class PatientRegisterComponent implements OnInit {


  public dataToForm: PatientInfo;
  public loading: boolean;
  public isNewCpf = false;

  public Editor = DecoupledEditor;
  public editorData = '<p>Anotações sobre o paciente</p>';
  public config = {
    language: 'pt-br'
  };

  constructor(public confirmDialog: MatDialog,
    public errorHandler: ErrorHandlerService,
    private patientService: PatientService,
    private notification: NotificationsComponent,
    private utilService: UtilService) {

    this.dataToForm = new PatientInfo();

  }

  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.dataToForm = new PatientInfo();
        this.dataToForm.annotations = "O paciente realizou o registro pelo link público da CliNiv";

      }
    });
  }

  ngOnInit() {
    this.dataToForm = new PatientInfo();
    this.dataToForm.annotations = "O paciente realizou o registro pelo link público da CliNiv";
  }

  save() {
    this.loading = true;
    this.patientService.createPublic(this.dataToForm).then(resp => {
      this.ngOnInit();
      this.notification.showSucess("Paciente cadastrado com sucesso!");
    }).catch(error => {
      this.errorHandler.handle(error, this);
    }).finally(() => this.loading = false);
  }

  selectGender(newValue) {
    this.dataToForm.gender = newValue;
  }


  selectState(newValue) {
    this.dataToForm.address.state = newValue;
  }

  selectPatientType(newValue) {
    this.dataToForm.type = newValue;
  }

  selectEthnicGroup(newValue) {
    this.dataToForm.ethnicGroup = newValue;
  }

  cpfIsValid() {
    if (this.dataToForm.document) {
      if (this.dataToForm.document.value === "" || this.dataToForm.document.value === undefined)
        return false
      else
        return this.utilService.cpfIsValid(this.dataToForm.document.value);
    } else
      return false
  }

  onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
}
