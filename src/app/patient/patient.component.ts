import { Component, OnInit } from '@angular/core';
import { PatientService, PatientPage } from './patient.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { MatDialog } from '@angular/material';
import { PatientEditComponent } from './patient-edit/patient-edit.component';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  public loading: boolean;
  public patientNotFound: boolean;
  patients: any;
  page: PatientPage;

  constructor(public dialog: MatDialog, private patientService: PatientService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit() {
    this.loading = true;
    this.patientService.getPageOfPatients(null).then(response => {
      this.loading = false;
      this.patients = response.content;
      this.patientNotFound = this.patients.length === 0;
      console.log(this.patientNotFound);
    }).catch(error => {
      this.patientNotFound = this.patients !== undefined ? this.patients.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error);
    });
  }
  openDialog(id): void {
    const dialogRef = this.dialog.open(PatientEditComponent, {
      width: '70%',
      data: { selectedPatient: id }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
