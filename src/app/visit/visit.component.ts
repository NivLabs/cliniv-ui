import { Component, OnInit } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { VisitService, VisitInfo, Visit } from './visit.service';
import { PatientHistoryComponent } from './history/patient-history.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {

  constructor(public dialog: MatDialog, private visitService: VisitService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

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
        .catch(error => this.onServiceException(error));
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
