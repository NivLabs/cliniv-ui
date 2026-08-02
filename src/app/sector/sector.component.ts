import { Component, OnInit, ErrorHandler } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SectorService } from './sector.service';
import { SectorEditComponent } from './sector-edit/sector-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Page, Pageable } from 'app/model/Util';
import { SectorFilters } from '../model/Sector';
import { DataTableColumn } from '../components/data-table/data-table.component';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css']
})

export class SectorComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: SectorFilters;

  columns: Array<DataTableColumn> = [
    { key: 'id', label: 'Identificador' },
    { key: 'description', label: 'Descrição' }
  ];

  constructor(public dialog: MatDialog, private errorHandler: ErrorHandlerService, private principalService: SectorService) { }

  ngOnInit() {
    this.page = new Page();
    this.filters = new SectorFilters();
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

  openDialog(id): void {
    const dialogRef = this.dialog.open(SectorEditComponent, {
      width: '100%',
      height: 'auto',
      data: {selectedSector: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}
