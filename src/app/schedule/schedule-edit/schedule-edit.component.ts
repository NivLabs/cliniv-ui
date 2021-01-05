import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { Address } from 'app/model/Address';
import { Document } from 'app/model/Document';
import { PatientInfo } from 'app/model/Patient';
import { ScheduleInfo } from 'app/model/Schedule';
import { PatientService } from 'app/patient/patient.service';
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
    private utilService: UtilService,
    private patientService: PatientService,
    private errorHandler: ErrorHandlerService,
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
        this.dataToForm.patient.document = new Document('CPF');
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  searchPatientById() {
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
      this.dataToForm.patient = new PatientInfo();
      this.errorHandler.handle(error, this.dialogRef);
    });
  }

  save() {
    console.log(this.dataToForm);
  }

  selectResponsible(id) {

  }
}
