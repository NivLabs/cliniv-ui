import { Component, OnInit, Inject } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { PaymentMethodService } from '../payment-method.service';
import { PaymentMethod } from 'app/model/PaymentMethod';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-payment-method-edit',
  templateUrl: './payment-method-edit.component.html'
})
export class PaymentMethodEditComponent implements OnInit {

  public loading = false;
  public dataToForm: PaymentMethod;

  constructor(public principalService: PaymentMethodService, public confirmDialog: MatDialog, public dialogRef: MatDialogRef<PaymentMethodEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new PaymentMethod();
  }

  ngOnInit(): void {
    const selectedPaymentMethod = this.data ? this.data['selectedPaymentMethod'] : null;
    if (selectedPaymentMethod) {
      this.dataToForm = { ...selectedPaymentMethod };
    }
  }

  /**
   * Fecha o dialog de edição de forma de pagamento
   */
  onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * Cria ou atualiza uma forma de pagamento
   */
  save() {
    this.loading = true;
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.loading = false;
        this.notification.showSucess("Forma de pagamento alterada com sucesso!");
        this.dataToForm = resp;
      }).catch((error) => this.handlerException(error));
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.notification.showSucess("Forma de pagamento cadastrada com sucesso!");
      }).catch((error) => this.handlerException(error));
    }
  }

  /**
   * Limpa o formulário
   */
  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.dataToForm = new PaymentMethod();
      }
    });
  }

  handlerException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialogRef);
  }

}
