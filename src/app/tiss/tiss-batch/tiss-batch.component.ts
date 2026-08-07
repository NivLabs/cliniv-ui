import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { TissBatchService } from '../tiss-batch.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Page, Pageable } from 'app/model/Util';
import { TissBatch, TissBatchFilters, tissBatchStatuses } from 'app/model/TissBatch';
import { TissBatchEditComponent } from './tiss-batch-edit/tiss-batch-edit.component';
import { DataTableColumn } from '../../components/data-table/data-table.component';
import { formatCurrency } from 'app/model/format.util';

@Component({
  selector: 'app-tiss-batch',
  templateUrl: './tiss-batch.component.html',
  styleUrls: ['./tiss-batch.component.css']
})
export class TissBatchComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: TissBatchFilters;

  public tissBatchStatuses = tissBatchStatuses;

  columns: Array<DataTableColumn> = [
    { key: 'healthOperatorName', label: 'Operadora', sortable: true, sortKey: 'operator' },
    { key: 'referenceMonth', label: 'Mês', sortable: true },
    { key: 'referenceYear', label: 'Ano', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'totalGross', label: 'Valor Bruto', sortable: true, cell: row => formatCurrency(row.totalGross) },
    { key: 'totalGlosa', label: 'Glosa', sortable: true, cell: row => formatCurrency(row.totalGlosa) },
    { key: 'totalNet', label: 'Valor Líquido', sortable: true, cell: row => formatCurrency(row.totalNet) }
  ];

  constructor(public dialog: MatDialog, private errorHandler: ErrorHandlerService, private principalService: TissBatchService) { }

  ngOnInit() {
    this.page = new Page();
    this.filters = new TissBatchFilters();
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

  openDialog(data): void {
    const dialogRef = this.dialog.open(TissBatchEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedData: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}
