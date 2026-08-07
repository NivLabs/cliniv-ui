import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { FinancialCategoryService } from './financial-category.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Page, Pageable } from 'app/model/Util';
import { FinancialCategoryFilters } from '../model/FinancialCategory';
import { FinancialCategoryEditComponent } from './financial-category-edit/financial-category-edit.component';
import { DataTableColumn } from '../components/data-table/data-table.component';

@Component({
  selector: 'app-financial-category',
  templateUrl: './financial-category.component.html',
  styleUrls: ['./financial-category.component.css']
})
export class FinancialCategoryComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: FinancialCategoryFilters;

  columns: Array<DataTableColumn> = [
    { key: 'description', label: 'Descrição', sortable: true }
  ];

  constructor(public dialog: MatDialog, private errorHandler: ErrorHandlerService, private principalService: FinancialCategoryService) { }

  ngOnInit() {
    this.page = new Page();
    this.filters = new FinancialCategoryFilters();
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

  openDialog(category): void {
    const dialogRef = this.dialog.open(FinancialCategoryEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedCategory: category }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

}
