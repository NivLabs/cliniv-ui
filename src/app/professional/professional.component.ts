import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Page } from 'app/core/util.service';
import { ProfessionalService } from './professional.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { PatientEditComponent } from 'app/patient/patient-edit/patient-edit.component';

@Component({
  selector: 'app-professional',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.css']
})
export class ProfessionalComponent implements OnInit {


  public loading: boolean;
  public responsibleNotFound: boolean;
  responsibles: any;
  page: Page;

  constructor(public dialog: MatDialog, private patientService: ProfessionalService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit() {
    this.loading = true;
    this.patientService.getPageOfProfessionals(null).then(response => {
      this.loading = false;
      this.responsibles = response.content;
      this.responsibleNotFound = this.responsibles.length === 0;
    }).catch(error => {
      this.responsibleNotFound = this.responsibles !== undefined ? this.responsibles.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error);
    });
  }
  openDialog(id): void {
    const dialogRef = this.dialog.open(PatientEditComponent, {
      width: '80%',
      data: { selectedPatient: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}