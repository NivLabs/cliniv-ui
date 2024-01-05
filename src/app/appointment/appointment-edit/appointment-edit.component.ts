import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { Address } from 'app/model/Address';
import { Document } from 'app/model/Document';
import { AppointmentInfo, AppointmentParameters, AppointmentRecurrenceSettings } from 'app/model/Appointment';
import { PatientService } from 'app/patient/patient.service';
import { AppointmentService } from '../appointment.service';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/pt-br';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.css']
})
export class AppointmentEditComponent implements OnInit {

  public dataToForm: AppointmentInfo;
  public scheduleParameters: AppointmentParameters;
  public responsibleControl: FormControl = new FormControl('', [Validators.required]);

  public loading = false;

  public responsibles = [];

  public Editor = DecoupledEditor;
  public editorData = '<p>Anotações</p>';
  public config = {
    language: 'pt-br'
  };

  constructor(
    private dialogRef: MatDialogRef<AppointmentEditComponent>,
    private notification: NotificationsComponent,
    private confirmDialog: MatDialog,
    private utilService: UtilService,
    private patientService: PatientService,
    private errorHandler: ErrorHandlerService,
    private scheduleService: AppointmentService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.responsibles = this.dialogRef.componentInstance.data['responsibles'];
    this.dataToForm = this.dialogRef.componentInstance.data['schedule'];
    this.scheduleParameters = this.dialogRef.componentInstance.data['scheduleParameters'];
    if (!this.scheduleParameters) {
      this.scheduleParameters = new AppointmentParameters();
    }
    if (!this.dataToForm) {
      this.dataToForm = new AppointmentInfo();
    }
    if (!this.responsibles || this.responsibles.length == 0) {
      this.onCancelClick();
      this.notification.showWarning('Nenhum profissional habilitado para realizar atendimento');
    }
    if (!this.dataToForm.repeatSettings) {
      this.dataToForm.repeatSettings = new AppointmentRecurrenceSettings();
    }
  }


  onCancelClick(): void {
    this.dialogRef.close();
  }

  enterKeyPress(event, type) {
    if (event.key === "Enter") {
      event.preventDefault();
      switch (type) {
        case "ID":
          this.searchPatientById();
          break;
        case "CPF":
          this.searchPatientByCpf();
          break;
        default:
          this.notification.showError('Tipo de consulta não encontrado!');
          break;
      }
    }
  }


  cpfIsValid() {
    if (this.dataToForm.patient.document) {
      if (this.dataToForm.patient.document.value === "" || this.dataToForm.patient.document.value === undefined)
        return true
      return this.utilService.cpfIsValid(this.dataToForm.patient.document.value);
    }
    return false
  }

  searchPatientByCpf() {
    if (!this.cpfIsValid()) {
      this.notification.showWarning("CPF Inválido, favor informar um CPF válido e sem pontos e/ou traços");
      this.dataToForm.patient.document = new Document("CPF");
    } else {
      this.loading = true;
      this.patientService.getByDocument('CPF', this.dataToForm.patient.document.value).then(resp => {
        this.loading = false;
        this.dataToForm.patient = resp;
        if (!resp.address) {
          this.dataToForm.patient.address = new Address();
        }
      }).catch(error => {
        this.loading = false;
        this.doResetForm();
        if (error instanceof HttpErrorResponse && error.status == 404) {
          this.notification.showWarning('Cadastro não encontrado, realize o cadastro do paciente antes de iniciar o agendamento');
        } else {
          this.errorHandler.handle(error, this.dialogRef);
        }
      });
    }
  }

  openRepeatSettingsDialog() {

  }
  searchPatientById() {
    if (this.dataToForm.patient.id) {
      this.loading = true;
      this.patientService.getById(this.dataToForm.patient.id).then(resp => {
        this.loading = false;
        this.dataToForm.patient = resp;
        if (!resp.address) {
          this.dataToForm.patient.address = new Address();
        }
        if (!resp.document) {
          this.dataToForm.patient.document = new Document('CPF');
        }
      }).catch(error => {
        this.loading = false;
        this.doResetForm();
        if (error instanceof HttpErrorResponse && error.status == 404) {
          this.notification.showWarning('Cadastro não encontrado, realize o cadastro do paciente antes de iniciar o agendamento');
        } else {
          this.errorHandler.handle(error, this.dialogRef);
        }
      });
    }
  }

  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.doResetForm();
      }
    });
  }

  doResetForm() {
    if (!this.dataToForm.id) {
      var schedulingDateAndTime = this.dataToForm.schedulingDateAndTime;
      var professional = this.dataToForm.professional;
      this.dataToForm = new AppointmentInfo();
      this.dataToForm.schedulingDateAndTime = schedulingDateAndTime;
      this.dataToForm.professional = professional;
    } else {
      this.dataToForm = new AppointmentInfo();
    }
  }

  save() {
    this.loading = true;

    this.scheduleService.createOrUpdate(this.dataToForm).then(response => {
      this.loading = false;
      this.dataToForm = response;
      this.notification.showSucess("Agendamento salvo com sucesso!");
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error, this.dialogRef);
    });
  }

  onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

}
