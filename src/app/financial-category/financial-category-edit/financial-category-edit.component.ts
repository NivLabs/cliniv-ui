import { Component, OnInit, Inject } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { FinancialCategoryService } from '../financial-category.service';
import { FinancialCategory } from 'app/model/FinancialCategory';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-financial-category-edit',
  templateUrl: './financial-category-edit.component.html'
})
export class FinancialCategoryEditComponent implements OnInit {

  public loading = false;
  public dataToForm: FinancialCategory;

  constructor(public principalService: FinancialCategoryService, public confirmDialog: MatDialog, public dialogRef: MatDialogRef<FinancialCategoryEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new FinancialCategory();
  }

  ngOnInit(): void {
    const selectedCategory = this.data ? this.data['selectedCategory'] : null;
    if (selectedCategory) {
      this.dataToForm = { ...selectedCategory };
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.loading = true;
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.loading = false;
        this.notification.showSucess("Categoria financeira alterada com sucesso!");
        this.dataToForm = resp;
      }).catch((error) => this.handlerException(error));
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.notification.showSucess("Categoria financeira cadastrada com sucesso!");
      }).catch((error) => this.handlerException(error));
    }
  }

  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.dataToForm = new FinancialCategory();
      }
    });
  }

  handlerException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialogRef);
  }

}
