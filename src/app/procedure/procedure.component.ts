import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { Page, Pageable } from 'app/model/Util';
import { ProcedureFilters, ProcedureInfo } from '../model/Procedure';
import { ProcedureService } from 'app/procedure/procedure.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { NotificationsComponent } from 'app/core/notification/notifications.component';

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

  constructor(private principalService: ProcedureService, private errorHandler: ErrorHandlerService, public confirmDialog: MatDialog,
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

  selectProcedureType(newValue) {
    this.filters.activeType = newValue;
    this.applyFilter();
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

    this.updateProcedure(procedure);

  }

  updateProcedure(procedure: ProcedureInfo) {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: procedure.active ? 'Tem certeza que deseja inativar esse procedimento?' : 'Tem certeza que deseja ativar esse procedimento?' }
    });
    confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.principalService.update(procedure.id).then(() => {
          
          this.loading = false;

          this.notification.showSucess(procedure.active ? "Procedimento inativado com sucesso!" : "Procedimento ativado com sucesso!");

          var cardBody = document.getElementById('card_body_' + procedure.id);
          var liName = document.getElementById('li_name_' + procedure.id);
          var span = document.getElementById('span_' + procedure.id);

          if (procedure.active) {
            cardBody.classList.add('margin-color-danger');
            liName.classList.add('name-not-identified');
            span.classList.remove('fa-check-square');
            span.classList.add('fa-window-close');     
            procedure.active = false;
          }
          else {
            cardBody.classList.remove('margin-color-danger');
            liName.classList.remove('name-not-identified');
            span.classList.remove('fa-window-close');
            span.classList.add('fa-check-square');
            procedure.active = true;
          }

          if(this.filters.activeType != undefined){
            this.applyFilter();
          }

        }).catch(error => {
          this.loading = false;
          this.errorHandler.handle(error, confirmDialogRef);
        });
      }
    });
  }

}
