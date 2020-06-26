import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrls: ['./medical-record.component.css']
})
export class MedicalRecordComponent implements OnInit {


  visit: MedicalRecord;
  public loading: boolean;

  constructor(private router: Router, private route: ActivatedRoute, public confirmDialog: MatDialog, public dialog: MatDialog, private visitService: MedicalRecordService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit() {
    this.router.navigate(['visit']);
    this.visit = {
      patientId: null,
      id: null,
      document: new Document('CPF'),
      firstName: null,
      lastName: null,
      principalNumber: null,
      susNumber: null,
      bornDate: null,
      gender: null,
      events: [],
      allergies: [],
      evolutions: [],
      medicines: []
    }

    var patientIdFromUrl = this.route.snapshot.paramMap.get('patientId');
    if (patientIdFromUrl) {
      this.visit.patientId = Number.parseInt(patientIdFromUrl);
      this.searchActivedVisitByPatientId();
    }
  }

  searchActivedVisitByPatientId() {
    if (this.visit.patientId) {
      this.loading = true
      this.visitService.getActivedVisitByPatientId(this.visit.patientId)
        .then(result => this.onFindVisitInfo(result))
        .catch(error => {
          this.loading = false;
          if (error.error && error.error.status === 400) {
            this.visitService.getPatientHistory(this.visit.patientId)
              .then(result => this.openHistoryDialog(result))
              .catch(error => {
                const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
                  data: { title: 'Confirmação', message: 'Não há atendimento ativo nem histórico para o paciente informado, deseja iniciar um novo atendimento?' }
                });
                confirmDialogRef.afterClosed().subscribe(result => {
                  if (result)
                    this.openNewVisitDialog(this.visit.patientId);
                });
              });
          } else {
            this.onServiceException(error)
          }
        });
    }
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
    this.loading = false
    this.visit = result;
  }

  onServiceException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialog);
  }

  searchPatientHistory(): void {
    this.visitService.getPatientHistory(this.visit.patientId).
      then(result => this.openHistoryDialog(result))
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
  openDocumentViewerDialog(id): void {
    const dialogDocumentViewer = this.dialog.open(DocumentViewerComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedDigitalDocumentId: id }
    });
    dialogDocumentViewer.afterClosed().subscribe(result => {
    });
  }

  openAnamnesisDialog(visitId) {
    const dialogNewVisit = this.dialog.open(AnamnesisComponent, {
      width: '100%',
      data: { visitId: visitId }
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

}
