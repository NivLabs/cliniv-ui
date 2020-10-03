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
import { AnamnesisComponent } from './anamnesis/anamnesis.component';
import { AllergyComponent } from './allergy/allergy.component';
import { EvolutionComponent } from './evolution/evolution.component';
import { Accommodation } from 'app/model/Accommodation';
import { DocumentSelectorComponent } from './document-selector/document-selector.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CloseEventComponent } from './close-event/close-event.component';

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

  constructor(private router: Router, private route: ActivatedRoute, public confirmDialog: MatDialog, public dialog: MatDialog, private visitService: MedicalRecordService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit() {
    this.router.navigate(['visit']);
    this.visit = {
      patientId: null,
      id: null,
      document: new Document('CPF'),
      fullName: null,
      socialName: null,
      principalNumber: null,
      susNumber: null,
      lastAccommodation: new Accommodation(),
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

    this.displayedColumnsMedicines = ['id', 'datetime', 'description', 'amount', 'responsibleForTheAdministration'];
    this.dataSourceMedicines = new MatTableDataSource([{ id: 'Sem Registro', datetime: 'Sem Registro', description: 'Sem Registro', amount: 'Sem Registro', responsibleForTheAdministration: 'Sem Registro' }]);

  }

  searchActivedVisitByPatientId() {
    if (this.visit.patientId) {
      this.loading = true
      this.visitService.getActivedVisitByPatientId(this.visit.patientId)
        .then(result => this.onFindVisitInfo(result))
        .catch(error => {
          this.loading = false;
          if (error.error && error.error.status === 422) {
            const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
              data: { title: 'Confirmação', message: 'Não há atendimento ativo para o paciente informado, deseja iniciar um novo atendimento?' }
            });
            confirmDialogRef.afterClosed().subscribe(result => {
              if (result)
                this.openNewVisitDialog(this.visit.patientId);
            });
          } else {
            this.onServiceException(error)
          }
        });
    }
  }

  patientNotIdentified() {
    return this.visit.id && this.visit.patientId && ((!this.visit.susNumber && !this.visit.document) || (!this.visit.susNumber && this.visit.document && !this.visit.document.value));
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

      setTimeout(() => {
        this.dataSourceEvents.sort = this.sortEvents;
      });
    }

  }

  onServiceException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialog);
  }

  searchPatientHistory(): void {
    this.loading = true;
    this.visitService.getPatientHistory(this.visit.patientId).
      then(result => {
        this.loading = false;
        this.openHistoryDialog(result);
      })
      .catch(error => this.onServiceException(error))
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


  openNewVisitDialog(patientId) {
    const dialogNewVisit = this.dialog.open(NewAttendanceComponent, {
      width: '90%',
      data: { patientId }
    });

    dialogNewVisit.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.createNewVisit(result);
      }
    });
  }

  createNewVisit(newVisit: NewAttendance) {
    this.loading = true;
    this.visitService.initializeVisit(newVisit).then(resp => {
      this.loading = false;
      this.visit.patientId = resp.patientId;
      this.searchActivedVisitByPatientId();
    }).catch(error => this.onServiceException(error));
  }

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
   * TODO: Finalizar esta implementação no Sábado 04/10/2020
   */
  closeAttendance() {
    const dialogNewVisit = this.dialog.open(CloseEventComponent, {
      width: '100%',
      data: { medicalRecord: this.visit }
    });

    dialogNewVisit.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ngOnInit();
      }
    });
  }

  openAnamnesisDialog(attendanceId) {
    const dialogNewVisit = this.dialog.open(AnamnesisComponent, {
      width: '100%',
      data: { attendanceId: attendanceId }
    });

    dialogNewVisit.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.ngOnInit();
      }
    });
  }

  openAllergyDialog(patientId) {
    const dialogAllergy = this.dialog.open(AllergyComponent, {
      width: '100%',
      data: { patientId: patientId, allergies: this.visit.allergies }
    });

    dialogAllergy.afterClosed().subscribe(result => {
      this.searchActivedVisitByPatientId();
    });
  }

  openEvolutionDialog(attendanceId) {
    const dialogNewEvolution = this.dialog.open(EvolutionComponent, {
      width: '100%',
      data: { attendanceId: attendanceId }
    });

    dialogNewEvolution.afterClosed().subscribe(result => {
      this.searchActivedVisitByPatientId();
    });

  }

}
