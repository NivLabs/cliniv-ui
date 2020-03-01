import { Component, OnInit } from '@angular/core';
import { PatientService } from './patient.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { MatDialog } from '@angular/material/dialog';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { Page } from 'app/core/util.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  public loading: boolean;
  public patientNotFound: boolean;
  patients: any;
  page: Page;

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
      this.errorHandler.handle(error, null);
    });
  }
  openDialog(id): void {
    const dialogRef = this.dialog.open(PatientEditComponent, {
      width: '100%',
      height: '100%',
      data: { selectedPatient: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

}
