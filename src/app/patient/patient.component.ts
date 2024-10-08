import { Component, OnInit } from '@angular/core';
import { PatientService } from './patient.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { Page, Pageable } from 'app/model/Util';
import { PatientFilters } from '../model/Patient'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: PatientFilters;

  constructor(public dialog: MatDialog, private router: Router, private principalService: PatientService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent, private route: ActivatedRoute) { }

  ngOnInit() {
    var patientIdFromUrl = this.route.snapshot.paramMap.get('patientId');
    this.router.navigate(['patient']);
    this.loading = true;
    this.page = new Page();
    this.filters = new PatientFilters();
    this.pageSettings = new Pageable();
    this.principalService.getPage(this.filters, this.pageSettings).then(response => {
      this.loading = false;
      this.datas = response.content;
      this.page = response;
      this.dataNotFound = this.datas.length === 0;
      if (patientIdFromUrl) {
        this.openDialog(Number.parseInt(patientIdFromUrl));
      }
    }).catch(error => {
      this.dataNotFound = this.datas ? this.datas.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }

  /**
   * Realiza a paginação dos componentes
   */
  loadNextPage() {
    if (this.page && !this.page.last) {
      this.loading = true;
      this.pageSettings.page = this.pageSettings.page + 1;
      this.principalService.getPage(this.filters, this.pageSettings).then(response => {
        this.loading = false;
        response.content.forEach(newItem => {
          this.datas.push(newItem);
        })
        this.page = response;
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, null);
      })
    }
  }

  applyFilter() {
    if (this.filters) {
      this.loading = true;
      this.pageSettings = new Pageable();
      this.principalService.getPage(this.filters, this.pageSettings).then(response => {
        this.loading = false;
        this.datas = response.content;
        this.page = response;
        this.dataNotFound = this.datas.length === 0;
        console.log(this.dataNotFound);
      }).catch(error => {
        this.dataNotFound = this.datas ? this.datas.length === 0 : true;
        this.loading = false;
        this.errorHandler.handle(error, null);
      });
    }
  }

  /**
  * 
  * Executa um evento à partir da tecla enter
  * 
  * @param event Evento de tecla
  */
  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
    }
  }


  selectPatientType(newValue) {
    this.filters.type = newValue;
    this.applyFilter();
  }

  /**
   * 
   * @param id Identificador do paciente
   */
  openDialog(id): void {
    const dialogRef = this.dialog.open(PatientEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedPatient: id },

    });

    dialogRef.afterClosed().subscribe(result => {
      this.applyFilter();
    });
  }

}
