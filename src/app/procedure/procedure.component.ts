import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { Page, Pageable } from 'app/model/Util';
import { ProcedureFilters, ProcedureInfo } from '../model/Procedure';
import { ProcedureService } from 'app/procedure/procedure.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ProcedureEditComponent } from './procedure-edit/procedure-edit.component';
import { PageEvent } from '@angular/material/paginator';
import { DataTableColumn } from '../components/data-table/data-table.component';
import { formatCurrency } from '../model/format.util';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: ProcedureFilters;

  columns: Array<DataTableColumn> = [
    { key: 'description', label: 'Descrição', cellClass: row => row.active === false ? 'name-not-identified' : '' },
    { key: 'id', label: 'Código' },
    { key: 'baseValue', label: 'Valor Base', cell: row => row.baseValue != null ? formatCurrency(row.baseValue) : '-' },
    { key: 'specialAuthorization', label: 'Req. Autorização Espec.', cell: row => row.specialAuthorization ? 'SIM' : 'NÃO' },
    { key: 'frequency', label: 'Periocidade', cell: row => row.frequency || '-' }
  ];

  getRowClass = (row: any) => row.active === false ? 'row-danger' : 'row-active';

  constructor(private principalService: ProcedureService, private errorHandler: ErrorHandlerService, public dialog: MatDialog,
    private notification: NotificationsComponent) { }

  ngOnInit() {
    this.page = new Page();
    this.filters = new ProcedureFilters();
    this.pageSettings = new Pageable();
    this.fetch();
  }

  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
    }
  }

  applyFilter() {
    if (this.filters) {
      this.pageSettings.page = 0;
      this.fetch();
    }
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
      this.dataNotFound = this.datas ? this.datas.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }

  openDialog(procedure: ProcedureInfo) {
    const dialogRef = this.dialog.open(ProcedureEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedProcedure: procedure },

    });

    dialogRef.afterClosed().subscribe(result => {
      this.applyFilter();
    });

  }

}
