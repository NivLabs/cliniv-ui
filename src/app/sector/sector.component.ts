import { Component, OnInit, ErrorHandler } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SectorService } from './sector.service';
import { SectorEditComponent } from './sector-edit/sector-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { Page, Pageable } from 'app/model/Util';
import { SectorFilters } from '../model/Sector';

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

  constructor(public dialog: MatDialog, private errorHandler: ErrorHandlerService, private principalService: SectorService) { }

  ngOnInit() {
    this.loading = true;
    this.page = new Page();
    this.filters = new SectorFilters();
    this.pageSettings = new Pageable();

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

  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
    }
  }

  applyFilter() {
    if (this.filters) {
      this.loading = true;
      this.pageSettings = new Pageable();
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
  }

  loadNextPage() {
    if (this.page && !this.page.last) {
      this.loading = true;
      this.pageSettings.page = this.pageSettings.page + 1;
      this.principalService.getPage(this.filters, this.pageSettings).then(response => {
        this.loading = false;
        response.content.forEach(newItem => {
          this.datas.push(newItem);
        })
        this.page = response;
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, null);
      })
    }
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
