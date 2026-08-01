import { CurrencyPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ProcedureInfo } from 'app/model/Procedure';
import { ProcedureService } from '../procedure.service';

@Component({
  selector: 'app-procedure-edit',
  templateUrl: './procedure-edit.component.html',
  styleUrls: ['./procedure-edit.component.css']
})
export class ProcedureEditComponent implements OnInit {

  dataToForm: ProcedureInfo;
  loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<ProcedureEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProcedureInfo,
    private principalService: ProcedureService,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent,
    public confirmDialog: MatDialog
  ) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new ProcedureInfo();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.dataToForm = new ProcedureInfo();
    if (this.dialogRef.componentInstance.data['selectedProcedure'] !== null) {
      this.dataToForm = this.dialogRef.componentInstance.data['selectedProcedure'];
      this.loading = true;
      this.principalService.getById(this.dataToForm.id).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
      }).catch(error => {
        this.loading = false;
        this.dataToForm = new ProcedureInfo();
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  /**
 * Cria ou atualiza um setor
 */
  save() {
    this.loading = true;
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.loading = false;
        this.notification.showSucess("Procedimento alterado com sucesso!");
        this.dataToForm = resp;
      }).catch((error) => this.handlerException(error));
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.notification.showSucess("Procedimento cadastrado com sucesso!");
      }).catch((error) => this.handlerException(error));
    }
  }

  handlerException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialogRef);
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
        this.dataToForm = new ProcedureInfo();
      }
    });
  }

  formatCurrency(event) {
    var uy = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BLR' }).format(event.target.value);
    this.dataToForm.baseValue = parseFloat(parseFloat(uy).toFixed(2));
  }

}