import { Component, OnInit } from '@angular/core';
import { HealthOperatorFilter } from 'app/model/HealthOperator';
import { Page, Pageable } from 'app/model/Util';
import { HealthOperatorService } from './health-operator.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { HealthOperatorEditComponent } from './health-operator-edit/health-operator-edit.component';

@Component({
  selector: 'app-health-operator',
  templateUrl: './health-operator.component.html',
  styleUrls: ['./health-operator.component.css']
})
export class HealthOperatorComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  public datas: Array<any>;
  public page: Page;
  public pageSettings: Pageable;
  public filters: HealthOperatorFilter;

  constructor(public dialog: MatDialog, private principalService: HealthOperatorService, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.loading = true;
    this.page = new Page();
    this.filters = new HealthOperatorFilter();
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


  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
    }
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
   * Converte o ENUM de modalidade para a descrição
   * @param modality Modalidade
   */
  getModalityDescription(modality: string) {
    switch (modality) {
      case 'HEALTH_PLAN_OPERATORS':
        return "Operadora de Plano de Saúde";
      case 'MEDICAL_OR_DENTAL_COOPERATIVE':
        return "Cooperativa Médica ou Odontológica";
      case 'SELF_MANAGEMENT':
        return "Autogerenciamento";
      case 'PHILANTHROPY':
        return "Filantropia";
      case 'ADMNISTRATOR':
        return "Administradora";
      case 'HEALTH_INSURERS':
        return "Seguradora de saúde";
    }
  }

  /**
   * Abre dialog com informações da Operadora de saúde
   * 
   * @param id Identificador único da operadora
   * 
   */
  openDialog(id) {
    const dialogRef = this.dialog.open(HealthOperatorEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedId: id },

    });

    dialogRef.afterClosed().subscribe(result => {
      this.applyFilter();
    });
  }

  selectOperatorModality(newValue) {
    this.filters.modality = newValue;
    this.applyFilter();
  }
}
