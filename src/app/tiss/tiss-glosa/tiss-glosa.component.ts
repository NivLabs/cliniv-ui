import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { TissGlosaService } from '../tiss-glosa.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Page, Pageable } from 'app/model/Util';
import { TissGlosa, TissGlosaFilters } from 'app/model/TissGlosa';
import { TissGlosaEditComponent } from './tiss-glosa-edit/tiss-glosa-edit.component';
import { DataTableColumn } from '../../components/data-table/data-table.component';
import { formatCurrency } from 'app/model/format.util';

@Component({
  selector: 'app-tiss-glosa',
  templateUrl: './tiss-glosa.component.html',
  styleUrls: ['./tiss-glosa.component.css']
})
export class TissGlosaComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: TissGlosaFilters;

  columns: Array<DataTableColumn> = [
    { key: 'tissBatchId', label: 'ID Lote', sortable: true },
    { key: 'financialReleaseId', label: 'ID Lançamento', sortable: true },
    { key: 'reason', label: 'Motivo', sortable: true },
    { key: 'contestedValue', label: 'Valor Contestado', sortable: true, cell: row => formatCurrency(row.contestedValue) },
    { key: 'contestedPercentage', label: 'Percentual (%)', sortable: true }
  ];

  constructor(public dialog: MatDialog, private errorHandler: ErrorHandlerService, private principalService: TissGlosaService) { }

  ngOnInit() {
    this.page = new Page();
    this.filters = new TissGlosaFilters();
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
    const dialogRef = this.dialog.open(TissGlosaEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedData: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}
