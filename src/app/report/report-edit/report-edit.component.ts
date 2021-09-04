import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { ReportService } from '../report.service';
import { UtilService } from 'app/core/util.service';
import { FormBuilder } from '@angular/forms';
import { Report } from 'app/model/Report';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentViewerComponent } from '../../component/document-viewer/document-viewer.component';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/pt-br';
import * as DecoupledEditor  from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-report-edit',
  templateUrl: './report-edit.component.html'
})
export class ReportEditComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public loading = false;
  public dataToForm: Report;
  public dataSource: any;
  public displayedColumns: any;
  public selectedReportId: number = 0;
  public document: any;

  public Editor = DecoupledEditor;
  public editorData = '<p>teste</p>';
  public config = {
    language: 'pt-br'
  };

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
        this.dataToForm.id = resp.id;
        this.dataToForm.name = resp.name;
        this.dataToForm.base64 = resp.base64;
        console.log(this.dataToForm.base64);
        this.dataToForm.params = resp.params;
        this.dataToForm.params = this.dataToForm.params.sort(function (a, b) {
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        });
        this.dataSource = new MatTableDataSource(this.dataToForm.params);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });

      }).catch(error => {
        this.dataToForm = new Report();
        this.handlerException(error);
      });

      this.displayedColumns = ['name', 'type', 'value'];

    }

  }

  /**
   * Fecha o dialog de edição de Layout
   */
  onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * Cria ou atualiza um Layout
   */
  save() {
    this.loading = true;
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.dataToForm.id = resp.id;
        this.dataToForm.name = resp.name;
        this.dataToForm.base64 = resp.base64;
        this.dataToForm.params = resp.params;
        this.dataToForm.params = this.dataToForm.params.sort(function (a, b) {
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        });
        this.dataSource = new MatTableDataSource(this.dataToForm.params);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      }).catch((error) => this.handlerException(error));
      this.notification.showSucess("Layout alterado com sucesso!");
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.dataToForm.id = resp.id;
        this.dataToForm.name = resp.name;
        this.dataToForm.base64 = resp.base64;
        this.dataToForm.params = resp.params;
        this.dataToForm.params = this.dataToForm.params.sort(function (a, b) {
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        });
        this.dataSource = new MatTableDataSource(this.dataToForm.params);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
        this.notification.showSucess("Layout cadastrado com sucesso!");
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
      t.dataToForm.name = file.name;
    };

    reader.readAsBinaryString(file);
  }

  formValid() {

    return this.dataToForm && this.dataToForm.base64 != "" && this.dataToForm.base64 != undefined && this.dataToForm.name != "" && this.dataToForm.name != undefined;

  }

  getTypeDescription(type: string) {
    switch (type) {
      case 'STRING':
        return 'Texto'
      case 'NUMBER':
        return 'Numérico'
      /* case 'GROUP':
        return 'Agrupado' */
      case 'BOOL':
        return 'Sim ou Não'
      case 'DATE':
        return 'Data'
      case 'TEXTAREA':
        return 'Área de Texto'
      default:
        this.notification.showError('Tipo de metadado não mapeado!');
        break;
    }
  }

  createReport() {
    this.loading = true;    

    this.principalService.createReport(this.dataToForm, this.dataToForm.id).then(resp => {
      this.loading = false;
      this.document = resp;
      this.notification.showSucess("Relatório gerado com sucesso!");
      this.openDocumentViewerDialog();
    }).catch((error) => this.handlerException(error));

  }

  openDocumentViewerDialog(): void {

    this.dialog.open(DocumentViewerComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedDigitalDocumentId: 0, document: this.document }
    });

  }

  onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }

}
