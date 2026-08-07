import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { TissRepasseService } from '../tiss-repasse.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Page, Pageable } from 'app/model/Util';
import { TissRepasse, TissRepasseFilters } from 'app/model/TissRepasse';
import { TissRepasseEditComponent } from './tiss-repasse-edit/tiss-repasse-edit.component';
import { DataTableColumn } from '../../components/data-table/data-table.component';
import { formatCurrency, formatDate } from 'app/model/format.util';

@Component({
  selector: 'app-tiss-repasse',
  templateUrl: './tiss-repasse.component.html',
  styleUrls: ['./tiss-repasse.component.css']
})
export class TissRepasseComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: TissRepasseFilters;

  columns: Array<DataTableColumn> = [
    { key: 'tissBatchId', label: 'ID Lote', sortable: true },
    { key: 'repaymentFinancialReleaseId', label: 'ID Lançamento Repasse', sortable: true },
    { key: 'repaymentValue', label: 'Valor do Repasse', sortable: true, cell: row => formatCurrency(row.repaymentValue) },
    { key: 'paymentDate', label: 'Data de Pagamento', sortable: true, cell: row => formatDate(row.paymentDate) },
    { key: 'bankNumber', label: 'Banco', sortable: true },
    { key: 'agencyNumber', label: 'Agência', sortable: true }
  ];

  constructor(public dialog: MatDialog, private errorHandler: ErrorHandlerService, private principalService: TissRepasseService) { }

  ngOnInit() {
    this.page = new Page();
    this.filters = new TissRepasseFilters();
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
    const dialogRef = this.dialog.open(TissRepasseEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedData: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}
