import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { ReportService } from '../report.service';
import { UtilService } from 'app/core/util.service';
import { FormBuilder } from '@angular/forms';
import { Report } from 'app/model/Report';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-report-edit',
  templateUrl: './report-edit.component.html'
})
export class ReportEditComponent implements OnInit {

  public loading = false;
  public dataToForm: Report;
  public dataSource: any;
  public displayedColumns: any;
  public selectedReportId: number = 0;

  constructor(public principalService: ReportService, public confirmDialog: MatDialog, public dialog: MatDialog, public dialogRef: MatDialogRef<ReportEditComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: Report, public formBuilder: FormBuilder, private utilService: UtilService, private errorHandler: ErrorHandlerService, 
              private notification: NotificationsComponent) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new Report();
  }

  ngOnInit(): void {

    if (this.dialogRef.componentInstance.data['selectedReport'] !== null || this.selectedReportId !== 0) {
      this.loading = true;
      this.selectedReportId = this.dialogRef.componentInstance.data['selectedReport'];
      this.principalService.getById(this.selectedReportId).then(resp => {
        this.loading = false;
        this.dataToForm = resp;        
      }).catch(error => {
        this.dataToForm = new Report();
        this.handlerException(error);
      });

    }

  }

  /**
   * Fecha o dialog de edição de relatório
   */
  onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * Cria ou atualiza um relatório
   */
  save() {
    this.loading = true;
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.loading = false;
        this.notification.showSucess("Relatório alterado com sucesso!");
        this.dataToForm = resp;
      }).catch((error) => this.handlerException(error));
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.notification.showSucess("Relatório cadastrado com sucesso!");
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
        this.dataToForm = new Report();
      }
    });
  }

  /**
   * 
   * @param error Trata exception padrão
   */
  handlerException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialogRef);
  }

  saveImagem(fileInputEvent: any) {

    var t = this;
    var file = fileInputEvent.target.files[0];

    var reader = new FileReader();

    reader.onload = function (readerEvt) {
      var binaryString = readerEvt.target.result.toString();
      var base64 = btoa(binaryString);
      t.dataToForm.base64 = base64;
    };

    reader.readAsBinaryString(file);
  }

  formValid() {

    return this.dataToForm && this.dataToForm.base64 != "" && this.dataToForm.base64 != undefined && this.dataToForm.name != "" && this.dataToForm.name != undefined;

}

}
