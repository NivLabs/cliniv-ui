import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { FinancialReleaseService } from './financial-release.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Page, Pageable } from 'app/model/Util';
import { FinancialReleaseFilters, financialReleaseStatuses, financialReleaseTypes } from '../model/FinancialRelease';
import { FinancialReleaseEditComponent } from './financial-release-edit/financial-release-edit.component';
import { DataTableColumn } from '../components/data-table/data-table.component';
import { formatCurrency, formatDate } from 'app/model/format.util';

@Component({
  selector: 'app-financial-release',
  templateUrl: './financial-release.component.html',
  styleUrls: ['./financial-release.component.css']
})
export class FinancialReleaseComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: FinancialReleaseFilters;

  public financialReleaseTypes = financialReleaseTypes;
  public financialReleaseStatuses = financialReleaseStatuses;

  columns: Array<DataTableColumn> = [
    { key: 'title', label: 'Título', sortable: true },
    { key: 'categoryDescription', label: 'Categoria', sortable: true, sortKey: 'category.description' },
    { key: 'type', label: 'Tipo', cell: row => row.type === 'RECEIVABLE' ? 'A Receber' : 'A Pagar', sortable: true },
    { key: 'status', label: 'Situação', sortable: true },
    { key: 'grossValue', label: 'Valor Bruto', cell: row => formatCurrency(row.grossValue), sortable: true },
    { key: 'netValue', label: 'Valor Líquido', cell: row => formatCurrency(row.netValue), sortable: true },
    { key: 'dueDate', label: 'Vencimento', cell: row => formatDate(row.dueDate), sortable: true }
  ];

  constructor(public dialog: MatDialog, private errorHandler: ErrorHandlerService, private principalService: FinancialReleaseService) { }

  ngOnInit() {
    this.page = new Page();
    this.filters = new FinancialReleaseFilters();
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

  onSortChange(sort: Sort) {
    this.pageSettings.page = 0;
    if (sort.direction) {
      this.pageSettings.orderBy = sort.active;
      this.pageSettings.direction = sort.direction.toUpperCase() as 'ASC' | 'DESC';
    } else {
      delete this.pageSettings.orderBy;
      delete this.pageSettings.direction;
    }
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

  openDialog(release): void {
    const dialogRef = this.dialog.open(FinancialReleaseEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedRelease: release }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

}
