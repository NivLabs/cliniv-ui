import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { ProfessionalService } from './professional.service';
import { ProfessionalEditComponent } from './professional-edit/professional-edit.component';
import { Page, Pageable } from 'app/model/Util';
import { ProfessionalFilters } from 'app/model/Professional';
import { PageEvent } from '@angular/material/paginator';
import { DataTableColumn } from '../components/data-table/data-table.component';
import { formatCpf, formatDate, formatPhone } from '../model/format.util';

@Component({
  selector: 'app-professional',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.css']
})
export class ProfessionalComponent implements OnInit {


  public loading: boolean;
  public dataNotFound: boolean;
  datas: any;
  page: Page;
  pageSettings: Pageable;
  filters: ProfessionalFilters;

  columns: Array<DataTableColumn> = [
    { key: 'fullName', label: 'Nome' },
    { key: 'id', label: 'Matrícula' },
    { key: 'bornDate', label: 'Nascimento', cell: row => formatDate(row.bornDate) },
    { key: 'gender', label: 'Gênero', cell: row => row.gender === 'M' ? 'Masculino' : (row.gender === 'F' ? 'Feminino' : '-') },
    { key: 'cpf', label: 'CPF', cell: row => row.cpf ? formatCpf(row.cpf) : '-' },
    { key: 'principalNumber', label: 'Telefone', cell: row => formatPhone(row.principalNumber) }
  ];

  constructor(public dialog: MatDialog, private utilService: UtilService, private principalService: ProfessionalService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit() {
    this.page = new Page();
    this.filters = new ProfessionalFilters();
    this.pageSettings = new Pageable();
    this.fetch();
  }

  onPageChange(event: PageEvent) {
    this.pageSettings.page = event.pageIndex;
    this.pageSettings.size = event.pageSize;
    this.fetch();
  }

  private fetch() {
    this.loading = true;
    this.principalService.getPage(this.filters, this.pageSettings).then(response => {
      this.loading = false;
      this.datas = response.content;
      this.page = response;
      this.dataNotFound = this.datas.length === 0;
    }).catch(error => {
      this.dataNotFound = this.datas !== undefined ? this.datas.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }

  /**
   * Aplica filtros de pesquisa
   */
  applyFilter() {
    if (this.filters) {
      this.pageSettings.page = 0;
      this.fetch();
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
   * @param id Identificador do Profissional
   */
  openDialog(id): void {
    const dialogRef = this.dialog.open(ProfessionalEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedProfessional: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.applyFilter();
    });
  }
}