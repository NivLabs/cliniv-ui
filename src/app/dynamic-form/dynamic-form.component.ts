import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { DynamicFormFilter } from 'app/model/DynamicForm';
import { Page, Pageable } from 'app/model/Util';
import { DynamicFormService } from 'app/visit/dynamicForm/dynamic-form.service';
import { DynamicFormEditComponent } from './dynamic-form-edit/dynamic-form-edit.component';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { NotificationsComponent } from 'app/core/notification/notifications.component';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {


  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: DynamicFormFilter;
  card: boolean;

  constructor(private principalService: DynamicFormService,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog, 
    private notification: NotificationsComponent) { }

  ngOnInit(): void {
    this.card = true;
    this.loading = true;
    this.page = new Page();
    this.filters = new DynamicFormFilter();
    this.pageSettings = new Pageable();
    this.principalService.getPageOfForms(this.filters, this.pageSettings).then(response => {
      this.loading = false;
      this.datas = response.content;
      this.page = response;
      this.dataNotFound = this.datas.length === 0;
      console.log(this.dataNotFound);
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
      this.principalService.getPageOfForms(this.filters, this.pageSettings).then(response => {
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
      this.principalService.getPageOfForms(this.filters, this.pageSettings).then(response => {
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


  openDialog(id) {

    if(this.card){
      const dialogRef = this.dialog.open(DynamicFormEditComponent, {
        width: '100%',
        height: 'auto',
        data: { dynamicFormSelectedId: id }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    }
  }

  openDeleteDynamicFormDialog(id) {
    this.card = false;
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a exclusão do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
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