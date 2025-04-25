import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { ReportService } from './report.service';
import { ReportEditComponent } from './report-edit/report-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { Page, Pageable } from 'app/model/Util';
import { ReportFilters } from '../model/Report';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { NotificationsComponent } from 'app/core/notification/notifications.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: ReportFilters;
  card: boolean;

  constructor(public dialog: MatDialog, private errorHandler: ErrorHandlerService, private principalService: ReportService, private notification: NotificationsComponent) { }

  ngOnInit() {
    this.card = true;
    this.loading = true;
    this.page = new Page();
    this.filters = new ReportFilters();
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
    if (this.card) {
      const dialogRef = this.dialog.open(ReportEditComponent, {
        width: '100%',
        height: 'auto',
        data: { selectedReport: id }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    }
  }

  openDeleteReportDialog(id) {
    this.card = false;
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a exclusão do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      this.loading = true;
      if (result !== undefined && result.isConfirmed) {
        this.principalService.delete(id).then(resp => {
          this.ngOnInit();
          this.notification.showSucess("Formulário excluído com sucesso!");
        }).catch((error) => this.handlerException(error));
      }
      this.card = true;
    });
  }

  handlerException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialog);
  }

}
