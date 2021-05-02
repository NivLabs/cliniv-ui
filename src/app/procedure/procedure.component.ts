import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { Page, Pageable } from 'app/model/Util';
import { ProcedureFilters, ProcedureInfo } from '../model/Procedure';
import { ProcedureService } from 'app/procedure/procedure.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ProcedureEditComponent } from './procedure-edit/procedure-edit.component';

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

  constructor(private principalService: ProcedureService, private errorHandler: ErrorHandlerService, public dialog: MatDialog,
    private notification: NotificationsComponent) { }

  ngOnInit() {

    this.loading = true;
    this.page = new Page();
    this.filters = new ProcedureFilters();
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
