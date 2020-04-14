import { Component, OnInit } from '@angular/core';
import { PatientService } from './patient.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { MatDialog } from '@angular/material/dialog';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { Page, Pageable } from 'app/model/Util';
import { PatientFilters } from '../model/Patient'
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: [];
  page: Page;
  pageSettings: Pageable;
  filters: PatientFilters;

  constructor(public dialog: MatDialog, private principalService: PatientService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit() {
    this.loading = true;
    this.filters = new PatientFilters();
    this.principalService.getPage(this.filters, this.pageSettings).then(response => {
      this.loading = false;
      this.datas = response.content;
      this.dataNotFound = this.datas.length === 0;
      console.log(this.dataNotFound);
    }).catch(error => {
      this.dataNotFound = this.datas !== undefined ? this.datas.length === 0 : true;
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
        this.dataNotFound = this.datas.length === 0;
        console.log(this.dataNotFound);
      }).catch(error => {
        this.dataNotFound = this.datas !== undefined ? this.datas.length === 0 : true;
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

  /**
   * 
   * @param id Identificador do paciente
   */
  openDialog(id): void {
    const dialogRef = this.dialog.open(PatientEditComponent, {
      width: '100%',
      height: '68%',
      data: { selectedPatient: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

}
