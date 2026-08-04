import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { Address } from 'app/model/Address';
import { Document } from 'app/model/Document';
import { AppointmentInfo, AppointmentParameters, AppointmentRecurrenceSettings } from 'app/model/Appointment';
import { PatientFilters, PatientInfo } from 'app/model/Patient';
import { Page, Pageable } from 'app/model/Util';
import { PatientService } from 'app/patient/patient.service';
import { PatientQuickCreateComponent } from 'app/patient/patient-quick-create/patient-quick-create.component';
import { AppointmentService } from '../appointment.service';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/pt-br';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

const PATIENT_SEARCH_MIN_LENGTH = 3;

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.css']
})
export class AppointmentEditComponent implements OnInit {

  public dataToForm: AppointmentInfo;
  public scheduleParameters: AppointmentParameters;
  public responsibleControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);

  public loading = false;

  public responsibles = [];

  public patients = [];
  public patientPage: Page;
  public patientFilters: PatientFilters;
  public patientPageSettings: Pageable;
  public loadingPatientAutocomplete = false;
  public patientSearchTermTooShort = true;

  public Editor = DecoupledEditor;
  public editorData = '<p>Anotações</p>';
  public config = {
    language: 'pt-br'
  };

  @ViewChild('patientSearch', { static: true }) patientSearchInput: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<AppointmentEditComponent>,
    private notification: NotificationsComponent,
    private confirmDialog: MatDialog,
    private patientService: PatientService,
    private errorHandler: ErrorHandlerService,
    private scheduleService: AppointmentService,
    private router: Router,
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

    this.patientPage = new Page();
    this.patientFilters = new PatientFilters();
    this.patientPageSettings = new Pageable();
    this.patientPageSettings.size = 20;

    fromEvent(this.patientSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe((text: string) => {
      this.patientSearchTermTooShort = !text || text.length < PATIENT_SEARCH_MIN_LENGTH;
      if (this.patientSearchTermTooShort) {
        this.patients = [];
        return;
      }
      this.searchPatientsByName(text);
    });
  }

  searchPatientsByName(text: string) {
    this.loadingPatientAutocomplete = true;
    this.patientFilters.fullName = text;
    this.patientPageSettings.page = 0;
    this.patientService.getPage(this.patientFilters, this.patientPageSettings).then(response => {
      this.loadingPatientAutocomplete = false;
      this.patients = response.content;
      this.patientPage = response;
    }).catch(error => {
      this.loadingPatientAutocomplete = false;
      this.errorHandler.handle(error, null);
    });
  }

  selectPatient(patientId: number) {
    this.loading = true;
    this.patientService.getById(patientId).then(resp => {
      this.loading = false;
      this.dataToForm.patient = resp;
      if (!resp.address) {
        this.dataToForm.patient.address = new Address();
      }
      if (!resp.document) {
        this.dataToForm.patient.document = new Document('CPF');
      }
      this.patients = [];
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error, this.dialogRef);
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  clearSelectedPatient() {
    this.dataToForm.patient = new PatientInfo();
    this.patients = [];
    this.patientSearchInput.nativeElement.value = '';
  }

  openQuickCreateDialog() {
    const quickCreateDialogRef = this.confirmDialog.open(PatientQuickCreateComponent);
    quickCreateDialogRef.afterClosed().subscribe(createdPatient => {
      if (createdPatient) {
        this.dataToForm.patient = createdPatient;
        if (!createdPatient.address) {
          this.dataToForm.patient.address = new Address();
        }
        if (!createdPatient.document) {
          this.dataToForm.patient.document = new Document('CPF');
        }
        this.patients = [];
      }
    });
  }

  openRepeatSettingsDialog() {
  }

  navigateToPatient() {
    this.router.navigate(['patient', { patientId: this.dataToForm.patient.id }]);
    this.onCancelClick();
  }

  onRemoveClick(id: number) {
    if (id) {
      this.loading = true;

      this.scheduleService.delete(id).then(_ => {
        this.loading = false;
        this.notification.showSucess("Agendamento removido com sucesso!");
        this.onCancelClick();
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
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
  selectIntervalType(newValue: string) {
    this.dataToForm.repeatSettings.intervalType = newValue;
  }

}
