import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { DocumentTemplateInfo } from 'app/model/DocumentTemplate';
import { DocumentTemplateService } from '../document-template.service';

@Component({
  selector: 'app-document-template-edit',
  templateUrl: './document-template-edit.component.html',
  styleUrls: ['./document-template-edit.component.css']
})
export class DocumentTemplateEditComponent implements OnInit {

  public loading = false;
  public dataToForm: DocumentTemplateInfo;
  public selectedDocumentTemplateId: number = 0;
  
  constructor(public principalService: DocumentTemplateService,
    public confirmDialog: MatDialog,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DocumentTemplateEditComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DocumentTemplateInfo,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new DocumentTemplateInfo();
  }


  ngOnInit(): void {
    if (this.dialogRef.componentInstance.data['selectedDocumentTemplateId'] !== null || this.selectedDocumentTemplateId !== 0) {
      this.loading = true;
      this.selectedDocumentTemplateId = this.dialogRef.componentInstance.data['selectedDocumentTemplateId'];
      this.principalService.findById(this.selectedDocumentTemplateId).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
      }).catch(error => {
        this.dataToForm = new DocumentTemplateInfo();
        this.handlerException(error);
      });
    }
  }

  /**
   * Fecha o dialog de edição de modelo de documento
   */
   onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * Cria ou atualiza um modelo de documento
   */
  save() {
    this.loading = true;
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.loading = false;
        this.notification.showSucess("Modelo de documento alterado com sucesso!");
        this.dataToForm = resp;
      }).catch((error) => this.handlerException(error));
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.notification.showSucess("Modelo de documento cadastrado com sucesso!");
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
        this.dataToForm = new DocumentTemplateInfo();
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
  
  onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }

}
