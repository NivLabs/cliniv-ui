import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { Page, UtilService } from 'app/core/util.service';
import { PatientEditComponent } from 'app/patient/patient-edit/patient-edit.component';
import { ProfessionalService } from './professional.service';
import { ProfessionalEditComponent } from './professional-edit/professional-edit.component';

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

  constructor(public dialog: MatDialog, private utilService: UtilService, private patientService: ProfessionalService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit() {
    this.loading = true;
    this.patientService.getPageOfProfessionals(null).then(response => {
      this.loading = false;
      this.responsibles = response.content;
      this.responsibleNotFound = this.responsibles.length === 0;
    }).catch(error => {
      this.responsibleNotFound = this.responsibles !== undefined ? this.responsibles.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error, null);
    });

  }

  openDialog(id): void {
    const dialogRef = this.dialog.open(ProfessionalEditComponent, {
      width: '100%',
      height: '100%',
      data: { selectedProfessional: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}