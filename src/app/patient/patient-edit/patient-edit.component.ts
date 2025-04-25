import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/pt-br';
import { CameraDialogComponent } from 'app/component/camera/dialog/camera-dialog.component';
import { AddressService } from 'app/core/address.service';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { PersonDocumentDialogComponent } from 'app/core/person-document-dialog/person-document-dialog.component';
import { UtilService } from 'app/core/util.service';
import { HealthPlanService } from 'app/healthOperator/health-plan.service';
import { Address } from 'app/model/Address';
import { Appointment } from 'app/model/Appointment';
import { PatientHistory } from 'app/model/Attendance';
import { Document } from 'app/model/Document';
import { HealthPlan } from 'app/model/HealthPlan';
import { PatientInfo } from 'app/model/Patient';
import { PersonDocument } from 'app/model/Person';
import { PatientService } from '../patient.service';
import { DocumentViewerComponent } from 'app/component/document-viewer/document-viewer.component';


@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html'
})
export class PatientEditComponent implements OnInit {

  public dataToForm: PatientInfo;
  public loading: boolean;
  public isNewCpf = false;

  public upcomingAppointmentsDisplayedColumns = ['schedulingDateAndTime', 'professionalName', 'status'];
  public upcomingAppointmentsDatasource: MatTableDataSource<Appointment>;

  public attendanceHistoryDisplayedColumns = ['id', 'entryDatetime', 'entryCause', 'isFinished'];
  public attendanceHistoryDataSource: MatTableDataSource<PatientHistory>;

  public displayedColunsDocuments = ['type', 'value', 'dispatcher', 'uf', 'expeditionDate'];
  public documentsDataSource: MatTableDataSource<PersonDocument>;

  public Editor = DecoupledEditor;
  public editorData = '<p>Anotações sobre o paciente</p>';
  public config = {
    language: 'pt-br'
  };

  constructor(private router: Router,
    public confirmDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public history: Array<PatientHistory>,
    public dialogRef: MatDialogRef<PatientEditComponent>,
    public errorHandler: ErrorHandlerService,
    public healthOperatorService: HealthPlanService,
    @Inject(MAT_DIALOG_DATA) public data: PatientInfo,
    private patientService: PatientService,
    private addressService: AddressService,
    private notification: NotificationsComponent,
    private utilService: UtilService,
    public dialog: MatDialog) {

    this.dialogRef.disableClose = true;
    this.dataToForm = new PatientInfo();

  }

  openWebCam() {
    const dialogRef = this.confirmDialog.open(CameraDialogComponent, {
      width: '500px',
      height: '548px'
    });

    dialogRef.afterClosed().subscribe(webCamImage => {
      if (webCamImage !== undefined) {
        this.dataToForm.profilePhoto = webCamImage.imageAsDataUrl;
      }
    });
  }

  saveImagem(fileInputEvent: any) {

    var t = this;
    var file = fileInputEvent.target.files[0];

    var reader = new FileReader();

    reader.onload = function (readerEvt) {
      var binaryString = readerEvt.target.result.toString();
      var base64 = btoa(binaryString);
      t.dataToForm.profilePhoto = 'data:image/png;base64,' + base64;
    };

    reader.readAsBinaryString(file);
  }

  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.dataToForm = new PatientInfo();
        this.documentsDataSource = new MatTableDataSource(this.dataToForm.documents);
        this.attendanceHistoryDataSource = new MatTableDataSource(this.dataToForm.attendanceHistory);

      }
    });
  }

  ngOnInit() {
    this.dataToForm = new PatientInfo();
    if (this.dialogRef.componentInstance.data['selectedPatient'] !== null) {
      this.loading = true;
      var selectedPatientId = this.dialogRef.componentInstance.data['selectedPatient'];
      this.patientService.getById(selectedPatientId).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        if (!resp.document) {
          this.isNewCpf = true;
          this.dataToForm.document = new Document('CPF');
        }
        if (!resp.healthPlan) {
          this.dataToForm.healthPlan = new HealthPlan();
        }
        if (resp.healthPlan && !resp.healthPlan.patientPlanNumber) {
          this.dataToForm.healthPlan.patientPlanNumber = "";
        }
        if (resp.attendanceHistory) {
          this.dataToForm.attendanceHistory = resp.attendanceHistory;
          this.attendanceHistoryDataSource = new MatTableDataSource(this.dataToForm.attendanceHistory);
        }
        if (resp.upcomingAppointments) {
          this.dataToForm.upcomingAppointments = resp.upcomingAppointments;
          this.upcomingAppointmentsDatasource = new MatTableDataSource(this.dataToForm.upcomingAppointments);
        }
        if (resp.documents) {
          this.documentsDataSource = new MatTableDataSource(this.dataToForm.documents);
        } else {
          this.dataToForm.documents = [];
        }
      }).catch(error => {
        this.loading = false;
        var cpf = this.dataToForm.document.value;
        this.dataToForm = new PatientInfo();
        this.dataToForm.document.value = cpf;
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.dataToForm.id) {
      this.loading = true;
      this.patientService.update(this.dataToForm).then(resp => {
        this.ngOnInit();
        this.notification.showSucess("Paciente alterado com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    } else {
      this.patientService.create(this.dataToForm).then(resp => {
        this.loading = true;
        this.dialogRef.componentInstance.data['selectedPatient'] = resp.id;
        this.ngOnInit();
        this.notification.showSucess("Paciente cadastrado com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  searchAddressByCEP() {
    this.loading = true;
    this.addressService.getAddressByCep(this.dataToForm.address.postalCode).then(address => {
      this.loading = false;
      this.dataToForm.address = address;
    }).catch(error => {
      this.loading = false;
      this.notification.showWarning("Não foi possível realizar a busca do CEP, verifique se o mesmo está correto e continue o cadastro normalmente.")
    });
  }

  gotToVisit(attendanceId) {
    this.dialogRef.close();
    if (attendanceId)
      this.router.navigate(['visit', { attendanceId: attendanceId }]);
    else
      this.router.navigate(['visit', { patientId: this.dataToForm.id }]);
  }

  selectGender(newValue) {
    this.dataToForm.gender = newValue;
  }

  selectGenderIdeology(newValue) {
    this.dataToForm.genderIdentity = newValue;
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

  openEditDocument(document, personId) {
    if (!document) {
      document = new PersonDocument();
      document.personId = personId;
    }
    const dialogRef = this.dialog.open(PersonDocumentDialogComponent, {
      width: '100%',
      height: 'auto',
      data: { document: document }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!this.dataToForm.documents.find(doc => doc.type == result.type && doc.value == result.value && doc.personId == result.personId)) {
          this.dataToForm.documents.push(result);
          this.documentsDataSource = new MatTableDataSource(this.dataToForm.documents);
        }
      }
    });
  }

  deleteDocument(document) {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você tem certeza que deseja apagar este ' + document.type + '?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        for (var i = 0; i < this.dataToForm.documents.length; i++) {
          if (this.dataToForm.documents[i] == document) {
            this.dataToForm.documents.splice(i--, 1);
            this.documentsDataSource = new MatTableDataSource(this.dataToForm.documents);
          }
        }
      }
    });
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

  searchHealthPlan() {
    if (!this.dataToForm.healthPlan || !this.dataToForm.healthPlan.planCode) {
      this.notification.showWarning("Limpando campos de informções do plano de saúde");
      let patientPlanNumber = this.dataToForm.healthPlan.patientPlanNumber;
      this.dataToForm.healthPlan = new HealthPlan();
      this.dataToForm.healthPlan.patientPlanNumber = patientPlanNumber;
    } else {
      this.loading = true;
      this.healthOperatorService.getByAnsCode(this.dataToForm.healthPlan.planCode).then(resp => {
        this.loading = false;
        let patientPlanNumber = this.dataToForm.healthPlan.patientPlanNumber;
        this.dataToForm.healthPlan = resp;
        this.dataToForm.healthPlan.patientPlanNumber = patientPlanNumber;
      }).catch(error => {
        this.loading = false;
        let patientPlanNumber = this.dataToForm.healthPlan.patientPlanNumber;
        this.dataToForm.healthPlan = new HealthPlan();
        this.dataToForm.healthPlan.patientPlanNumber = patientPlanNumber;
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  searchPatientByCpf() {
    if (!this.cpfIsValid()) {
      this.notification.showWarning("CPF Inválido, favor informar um CPF válido");
      this.dataToForm.document = new Document("CPF");
    } else {
      this.loading = true;
      this.patientService.getByDocument('CPF', this.dataToForm.document.value).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        if (!resp.document) {
          this.isNewCpf = true;
          this.dataToForm.document = new Document('CPF');
        }
        if (!resp.healthPlan) {
          this.dataToForm.healthPlan = new HealthPlan();
        }
        if (resp.attendanceHistory) {
          this.dataToForm.attendanceHistory = resp.attendanceHistory;
          this.attendanceHistoryDataSource = new MatTableDataSource(this.dataToForm.attendanceHistory);
        }
      }).catch(error => {
        this.loading = false;
        this.dataToForm.document = new Document('CPF');
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  searchPatientBycnsNumber() {
    if (this.dataToForm.cnsNumber) {
      this.loading = true;
      this.patientService.getByDocument('SUS', this.dataToForm.cnsNumber).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        if (!resp.document) {
          this.isNewCpf = true;
          this.dataToForm.document = new Document('CPF');
        }
        if (!resp.healthPlan) {
          this.dataToForm.healthPlan = new HealthPlan();
        }
        if (resp.attendanceHistory) {
          this.dataToForm.attendanceHistory = resp.attendanceHistory;
          this.attendanceHistoryDataSource = new MatTableDataSource(this.dataToForm.attendanceHistory);
        }
        if (resp.upcomingAppointments) {
          this.dataToForm.upcomingAppointments = resp.upcomingAppointments;
          this.upcomingAppointmentsDatasource = new MatTableDataSource(this.dataToForm.upcomingAppointments);
        }
      }).catch(error => {
        this.loading = false;
        this.dataToForm.cnsNumber = "";
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  getAppointmentStatusDescription(status: string) {
    switch (status) {
      case "WAITING_CONFIRMATION":
        return "Aguardando confirmação";
      case "CONFIRMED":
        return "Paciente confirmado(Paciente confirmou presença)";
      case "COMPLETED":
        return "Atendimento realizado";
      case "CANCELED":
        return "Agendamento cancelado";
      case "MISSED":
        return "Paciente faltou";
      case "REESCHEDULED":
        return "Remarcado";
    }
  }

  /**
   * 
   * Executa um evento à partir da tecla enter
   * 
   * @param event Evento de tecla
   */
  enterKeyPress(event: any, handler: string) {
    // Windows
    if (event.key === "Enter") {
      event.preventDefault();
      if (handler === "searchCPF")
        this.searchPatientByCpf();
      if (handler === "searchSUS")
        this.searchPatientBycnsNumber();
      if (handler === "searchHealthPlan")
        this.searchHealthPlan();
    }
  }

  showStatus(status: boolean) {
    return status ? 'Teve alta' : 'Em atendimento';
  }

  onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  openAppointmentsReport() {
    this.loading = true;

    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const firstDayISO = firstDay.toISOString().slice(0, 10);
    const lastDayISO = lastDay.toISOString().slice(0, 10);

    this.patientService.generateAppointmentsReport(this.dataToForm.id, { initDate: firstDayISO, endDate: lastDayISO }).then(resp => {
      this.loading = false;
      this.dialog.open(DocumentViewerComponent, {
        width: '100%',
        height: 'auto',
        data: { selectedDigitalDocumentId: 0, document: resp }
      });
    }).finally(() => this.loading = false);
  }

}
