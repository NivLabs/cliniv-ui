import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { PatientHistoryComponent } from './history/patient-history.component';
import { NewAttendanceComponent } from './newVisit/new-attendance.component';
import { MedicalRecordService } from './medical-record.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalRecord, NewAttendance } from 'app/model/Attendance';
import { Document } from 'app/model/Document';
import { DocumentViewerComponent } from 'app/component/document-viewer/document-viewer.component';
import { AttDynamicFormComponent } from './dynamicForm/att-dynamic-form.component';
import { AllergyComponent } from './allergy/allergy.component';
import { EvolutionComponent } from './evolution/evolution.component';
import { Accommodation } from 'app/model/Accommodation';
import { DocumentSelectorComponent } from './document-selector/document-selector.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CloseEventComponent } from './close-event/close-event.component';
import { NewEventComponent } from './new-event/new-event.component';
import { SelectFormComponent } from './dynamicForm/select-form/select-form.component';
import * as moment from 'moment';
import { PrescriptionComponent } from './prescription/prescription.component';
import { ChangeSectorAndResponsibleComponent } from './change-sector-and-responsible/change-sector-and-responsible.component';
import { Professional } from 'app/model/Professional';

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrls: ['./medical-record.component.css']
})
export class MedicalRecordComponent implements OnInit {

  @ViewChild("sortEvents", { static: true }) sortEvents: MatSort;
  @ViewChild("sortEvolutions", { static: true }) sortEvolutions: MatSort;
  @ViewChild("sortMedicines", { static: true }) sortMedicines: MatSort;

  visit: MedicalRecord;
  public loading: boolean;
  public dataSourceEvents: any;
  public displayedColumnsEvents: any;
  public dataSourceEvolutions: any;
  public displayedColumnsEvolutions: any;
  public dataSourceMedicines: any;
  public displayedColumnsMedicines: any;
  public timer: string;

  constructor(private router: Router, private route: ActivatedRoute, public confirmDialog: MatDialog, public dialog: MatDialog, private visitService: MedicalRecordService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit() {
    this.router.navigate(['visit']);
    this.visit = {
      patientId: null,
      id: null,
      document: new Document('CPF'),
      fullName: null,
      bloodType: null,
      socialName: null,
      principalNumber: null,
      cnsNumber: null,
      lastAccommodation: new Accommodation(),
      lastProfessional: new Professional(),
      bornDate: null,
      entryDateTime: null,
      exitDateTime: null,
      gender: null,
      events: [],
      allergies: [],
      evolutions: [],
      medicines: [],
      attendanceLevel: null
    }

    var patientIdFromUrl = this.route.snapshot.paramMap.get('patientId');
    if (patientIdFromUrl) {
      this.visit.patientId = Number.parseInt(patientIdFromUrl);
      this.searchActivedVisitByPatientId();
    }
    var attendanceFromUrl = this.route.snapshot.paramMap.get('attendanceId');
    if (attendanceFromUrl) {
      this.visit.id = Number.parseInt(attendanceFromUrl);
      this.searchVisitById();
    }

    this.displayedColumnsEvents = ['id', 'datetime', 'description', 'documents'];
    this.dataSourceEvents = new MatTableDataSource([{ id: 'Sem Registro', datetime: 'Sem Registro', description: 'Sem Registro', documents: 'Sem Registro' }]);

    this.displayedColumnsEvolutions = ['id', 'datetime', 'responsibleName', 'action'];
    this.dataSourceEvolutions = new MatTableDataSource([{ id: 'Sem Registro', datetime: 'Sem Registro', responsibleName: 'Sem Registro', action: 'Sem Registro' }]);

    this.displayedColumnsMedicines = ['id', 'datetime', 'amount', 'responsibleForTheAdministration'];
    this.dataSourceMedicines = new MatTableDataSource([{ id: 'Sem Registro', datetime: 'Sem Registro', amount: 'Sem Registro', responsibleForTheAdministration: 'Sem Registro' }]);

  }

  searchActivedVisitByPatientId() {
    if (this.visit.patientId) {
      this.loading = true
      this.visitService.getActivedVisitByPatientId(this.visit.patientId)
        .then(result => this.onFindVisitInfo(result))
        .catch(error => {
          this.loading = false;
          if (error.error && error.error.status === 404) {
            const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
              data: { title: 'Confirmação', message: 'Não há atendimento ativo para o paciente informado, deseja iniciar um novo atendimento?' }
            });
            confirmDialogRef.afterClosed().subscribe(result => {
              if (result)
                this.openNewAttendanceDialog(this.visit.patientId);
            });
          } else {
            this.onServiceException(error);
          }
        });
    }
  }

  patientNotIdentified() {
    return this.visit.id && this.visit.patientId && ((!this.visit.cnsNumber && !this.visit.document) || (!this.visit.cnsNumber && this.visit.document && !this.visit.document.value));
  }

  searchVisitById() {
    if (this.visit.id) {
      this.loading = true
      this.visitService.getVisitById(this.visit.id)
        .then(result => this.onFindVisitInfo(result))
        .catch(error => this.onServiceException(error));
    }
  }

  onFindVisitInfo(result) {
    this.loading = false;
    this.visit = result;
    this.timer = this.getTime();

    if (!this.visit.lastAccommodation) {
      this.visit.lastAccommodation = new Accommodation();
    }

    if (this.visit.medicines.length > 0) {

      this.visit.medicines = this.visit.medicines.sort(function (a, b) {
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      });

      this.dataSourceMedicines = new MatTableDataSource(this.visit.medicines);

      setTimeout(() => {
        this.dataSourceMedicines.sort = this.sortMedicines;
      });
    }

    if (this.visit.evolutions.length > 0) {

      this.visit.evolutions = this.visit.evolutions.sort(function (a, b) {
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      });

      this.dataSourceEvolutions = new MatTableDataSource(this.visit.evolutions);

      setTimeout(() => {
        this.dataSourceEvolutions.sort = this.sortEvolutions;
      });
    }

    if (this.visit.events.length > 0) {

      this.visit.events = this.visit.events.sort(function (a, b) {
        return a.id > b.id ? -1 : a.id < b.id ? 1 : 0;
      });

      this.dataSourceEvents = new MatTableDataSource(this.visit.events);

      if (!this.visit.exitDateTime)
        setInterval(() => {
          this.timer = this.getTime();
        }, 1000);
      else {
        this.getTime();
      }

      setTimeout(() => {
        this.dataSourceEvents.sort = this.sortEvents;
      });
    }

  }

  onServiceException(error) {
    this.loading = false;
    this.errorHandler.handle(error, null);
  }

  searchPatientHistory(): void {
    this.loading = true;
    this.visitService.getPatientHistory(this.visit.patientId).
      then(result => {
        this.loading = false;
        this.openHistoryDialog(result);
      })
      .catch(error => this.onServiceException(error));
  }

  identifyPatient() {

  }

  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      if (this.visit.id) {
        this.searchVisitById();
      } else if (this.visit.patientId) {
        this.searchActivedVisitByPatientId();
      }
    }
  }

  /**
   * Abre componente de criação de novo atendimento
   * 
   * @param patientId Código interno do paciente
   */
  openNewAttendanceDialog(patientId) {
    const dialogNewVisit = this.dialog.open(NewAttendanceComponent, {
      width: '90%',
      data: { patientId }
    });

    dialogNewVisit.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.createNewAttendance(result);
      }
    });
  }

  /**
   * Cria um novo atendimento
   * 
   * @param dataToForm Objeto para novo atendimento
   */
  createNewAttendance(dataToForm: NewAttendance) {
    this.loading = true;
    this.visitService.initializeVisit(dataToForm).then(resp => {
      this.loading = false;
      this.visit.patientId = resp.patientId;
      this.searchActivedVisitByPatientId();
    }).catch(error => this.onServiceException(error));
  }

  /**
   * Abre componente que exibe o hitórico do paciente
   * 
   * @param patientHistory Histórico do paciente
   */
  openHistoryDialog(patientHistory) {
    const dialogPatitenHistory = this.dialog.open(PatientHistoryComponent, {
      width: '90%',
      data: { patientHistory }
    });

    dialogPatitenHistory.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.visit.id = result.id;
        this.searchVisitById();
      }
    });
  }

  getTime() {

    var initDate = moment(this.visit.entryDateTime, "YYYY-MM-DD'T'HH:mm:ss")
    var currentDate = this.visit.exitDateTime ? moment(this.visit.exitDateTime, "YYYY-MM-DD'T'HH:mm:ss") : moment();
    var ms = currentDate.diff(initDate);
    var d = moment.duration(ms);
    return Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

  }

  /**
   * 
   * @param id Identificador do documento
   */
  openDocumentViewerDialog(documents): void {
    if (documents.length === 1) {
      const dialogDocumentViewer = this.dialog.open(DocumentViewerComponent, {
        width: '100%',
        height: 'auto',
        data: { selectedDigitalDocumentId: documents[0].id }
      });
      dialogDocumentViewer.afterClosed().subscribe(result => {
      });
    } else {
      const dialogDocumentSelectorViewer = this.dialog.open(DocumentSelectorComponent, {
        width: '100%',
        height: 'auto',
        data: { dataSource: documents }
      });
      dialogDocumentSelectorViewer.afterClosed().subscribe(result => {
        if (result) {
          this.openDocumentViewerDialog(result);
        }
      });
    }
  }

  /**
   * Abre o componente que cria o Evento de alta clínica
   */
  closeAttendance() {
    const closeAttendanceDialog = this.dialog.open(CloseEventComponent, {
      width: '100%',
      data: { attendanceId: this.visit.id }
    });

    closeAttendanceDialog.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  /**
   * Abre o componente de seleção de formulário do paciente
   * @param attendanceId Identificador único do atendimento
   */
  openDynamicFormDialog(attendanceId) {
    const dialogSelectForm = this.dialog.open(SelectFormComponent, {
      width: '100%',
      data: { attendanceId: attendanceId }
    });

    dialogSelectForm.afterClosed().subscribe(result => {
      this.searchVisitById();
    });
  }

  /**
   * Abre componente de manutenção de alergias do paciente
   * @param patientId Identificador único do paciente
   */
  openAllergyDialog(patientId) {
    const dialogAllergy = this.dialog.open(AllergyComponent, {
      width: '100%',
      data: { patientId: patientId, allergies: this.visit.allergies }
    });

    dialogAllergy.afterClosed().subscribe(result => {
      this.searchActivedVisitByPatientId();
    });
  }

  /**
   * Abre componente de criação de prescrição
   */
  openNewPrescriptionDialog() {
    const dialogPrescriptionComponent = this.dialog.open(PrescriptionComponent, {
      width: '100%',
      data: { attendance: this.visit }
    });

    dialogPrescriptionComponent.afterClosed().subscribe(result => {
      this.searchActivedVisitByPatientId();
    });
  }

  /**
   * Abre componente de criação de evolução clínica
   * @param attendanceId Identificador único do atendimento
   */
  openEvolutionDialog(attendanceId) {
    const dialogNewEvolution = this.dialog.open(EvolutionComponent, {
      width: '100%',
      data: { attendanceId: attendanceId }
    });

    dialogNewEvolution.afterClosed().subscribe(result => {
      this.searchActivedVisitByPatientId();
    });

  }

  /**
   * Abre componente de criação de eventos clínicos
   * @param attendanceId Identificador único do atendimento
   */
  openNewEventDialog() {
    const dialogNewEvolution = this.dialog.open(NewEventComponent, {
      width: '100%',
      data: { attendanceId: this.visit.id, lastAccommodation: this.visit.lastAccommodation }
    });

    dialogNewEvolution.afterClosed().subscribe(result => {
      this.searchVisitById();
    });

  }

  /**
   * Abre componente de alteração de setor e profissional responsável
   * @param attendanceId Identificador único do atendimento
   */
  openChangeSectorAndResponsibleDialog() {
    const dialogNewEvolution = this.dialog.open(ChangeSectorAndResponsibleComponent, {
      width: '100%',
      data: { attendanceId: this.visit.id, lastAccommodation: this.visit.lastAccommodation, lascProfessional: this.visit.lastProfessional }
    });

    dialogNewEvolution.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;

        this.visitService.createAttendanceEvent(result).then(resp => {
          this.notification.showSucess("Movimentação realizada com sucesso!");
        }).catch(e => this.errorHandler.handle(e, null))
          .then(() => {
            this.loading = false;
            this.searchVisitById();
          });
      }
    });
  }
}
