import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { Page, Pageable } from 'app/model/Util';
import { ProcedureFilters } from '../model/Procedure';
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
  datas: [];
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

  changeToggle(event: any, procedureId: number) {

    this.updateProcedure(procedureId, event);

  }

  updateProcedure(procedureId: number, event: any) {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: event.checked ? 'Tem certeza que deseja ativar esse procedimento?' : 'Tem certeza que deseja inativar esse procedimento?' }
    });
    confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.principalService.update(procedureId).then(() => {
          
          this.loading = false;

          this.notification.showSucess(event.checked ? "Procedimento ativado com sucesso!" : "Procedimento inativado com sucesso!");

          var cardBody = document.getElementById('card_body_' + procedureId);
          var liName = document.getElementById('li_name_' + procedureId);

          if (event.checked) {
            cardBody.classList.remove('margin-color-danger');
            liName.classList.remove('name-not-identified');
          }
          else {
            cardBody.classList.add('margin-color-danger');
            liName.classList.add('name-not-identified');
          }

          if(this.filters.activeType != undefined){
            this.applyFilter();
          }

        }).catch(error => {
          this.loading = false;
          this.errorHandler.handle(error, confirmDialogRef);
        });
      }
      else{
        
        if(event.source.checked == true){
          event.source.checked = false;
        }
        else{
          event.source.checked = true;
        }

      }
    });
  }

}
