import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { HealthPricingService } from './health-pricing.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Page, Pageable } from 'app/model/Util';
import { HealthPricingTable, HealthPricingTableFilters } from 'app/model/HealthPricingTable';
import { HealthPricingEditComponent } from './health-pricing-edit/health-pricing-edit.component';
import { DataTableColumn } from '../components/data-table/data-table.component';
import { formatCurrency } from 'app/model/format.util';

@Component({
  selector: 'app-health-pricing',
  templateUrl: './health-pricing.component.html',
  styleUrls: ['./health-pricing.component.css']
})
export class HealthPricingComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: HealthPricingTableFilters;

  columns: Array<DataTableColumn> = [
    { key: 'healthOperatorName', label: 'Operadora', sortable: true, sortKey: 'operador' },
    { key: 'procedureDescription', label: 'Procedimento', sortable: true, sortKey: 'procedure.description' },
    { key: 'negotiatedValue', label: 'Valor Negociado', sortable: true, cell: row => formatCurrency(row.negotiatedValue) }
  ];

  constructor(public dialog: MatDialog, private errorHandler: ErrorHandlerService, private principalService: HealthPricingService) { }

  ngOnInit() {
    this.page = new Page();
    this.filters = new HealthPricingTableFilters();
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
    const dialogRef = this.dialog.open(HealthPricingEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedData: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}
