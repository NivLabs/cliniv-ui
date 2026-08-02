import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { PaymentMethodService } from './payment-method.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Page, Pageable } from 'app/model/Util';
import { PaymentMethodFilters } from '../model/PaymentMethod';
import { PaymentMethodEditComponent } from './payment-method-edit/payment-method-edit.component';
import { DataTableColumn } from '../components/data-table/data-table.component';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: PaymentMethodFilters;

  columns: Array<DataTableColumn> = [
    { key: 'id', label: 'Identificador' },
    { key: 'name', label: 'Nome' }
  ];

  constructor(public dialog: MatDialog, private errorHandler: ErrorHandlerService, private principalService: PaymentMethodService) { }

  ngOnInit() {
    this.page = new Page();
    this.filters = new PaymentMethodFilters();
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

  openDialog(paymentMethod): void {
    const dialogRef = this.dialog.open(PaymentMethodEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedPaymentMethod: paymentMethod }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

}
