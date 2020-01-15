import { Component, OnInit } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { VisitService, VisitInfo, Visit } from './visit.service';
import { PatientHistoryComponent } from './history/patient-history.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { NewVisitComponent } from './newVisit/new-visit.component';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {

  constructor(public confirmDialog: MatDialog, public dialog: MatDialog, private visitService: VisitService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  visit: VisitInfo;
  public loading: boolean;

  ngOnInit() {
    this.visit = {
      patientId: null,
      id: null,
      document: { type: 'CPF', value: null },
      firstName: null,
      lastName: null,
      principalNumber: null,
      bornDate: null,
      gender: null,
      events: [],
      allergies: [],
      evolutions: [],
      medicines: []
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
                  data: { title: 'Confirmação', message: 'Não há visita ativa nem histórico para o paciente informado, deseja iniciar uma nova visita?' }
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
    this.errorHandler.handle(error);
  }

  searchPatientHistory(): void {
    this.visitService.getPatientHistory(this.visit.patientId).
      then(result => this.openHistoryDialog(result))
      .catch(error => this.onServiceException(error))
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
    const dialogNewVisit = this.dialog.open(NewVisitComponent, {
      width: '90%',
      data: { patientId }
    });

    dialogNewVisit.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.createNewVisit(result);
      }
    });
  }

  createNewVisit(newVisit: Visit) {
    this.loading = true;
    this.visitService.initializeVisit(newVisit).then(resp => {
      this.loading = false;
      this.visit.patientId = newVisit.id;
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
}
