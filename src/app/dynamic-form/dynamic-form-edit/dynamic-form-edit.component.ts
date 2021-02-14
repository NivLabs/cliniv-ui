import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { DynamicForm } from 'app/model/DynamicForm';
import { DynamicFormItem } from 'app/model/DynamicFormItem';
import { DynamicFormService } from 'app/visit/dynamicForm/dynamic-form.service';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { DynamicFormQuestionComponent } from '../dynamic-form-question/dynamic-form-question.component';

@Component({
  selector: 'app-dynamic-form-edit',
  templateUrl: './dynamic-form-edit.component.html',
  styleUrls: ['./dynamic-form-edit.component.css']
})
export class DynamicFormEditComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public loading = false;
  public dataToForm: DynamicForm;
  public dataSource: any;
  public displayedColumns: any;
  public dynamicFormSelectedId: number = 0;


  constructor(public principalService: DynamicFormService,
    public confirmDialog: MatDialog,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DynamicFormEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DynamicForm,
    public formBuilder: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new DynamicForm();
  }

  ngOnInit(): void {
    if (this.dialogRef.componentInstance.data['dynamicFormSelectedId'] !== null || this.dynamicFormSelectedId !== 0) {
      this.loading = true;
      this.dynamicFormSelectedId = this.dialogRef.componentInstance.data['dynamicFormSelectedId'];
      this.principalService.findById(this.dynamicFormSelectedId).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.dataToForm.questions = this.dataToForm.questions.sort(function (a, b) {
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        });
        this.dataSource = new MatTableDataSource(this.dataToForm.questions);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
      }).catch(error => {
        this.dataToForm = new DynamicForm();
        this.handlerException(error);
      });

      this.displayedColumns = ['question', 'metaType', 'actions'];
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  getTypeDescription(type: string) {
    switch (type) {
      case 'STRING':
        return 'Texto'
      case 'NUMBER':
        return 'Numérico'
      case 'GROUP':
        return 'Agrupado'
      case 'BOOL':
        return 'Sim ou Não'
      case 'DATE':
        return 'Data'
      default:
        this.notification.showError('Tipo de metadado não mapeado!');
        break;
    }
  }

  handlerException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialogRef);
  }

  save() { 
    this.loading = true;
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.loading = false;
        this.notification.showSucess("Fornulário alterado com sucesso!");
        this.dataToForm = resp;
      }).catch((error) => this.handlerException(error));
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.notification.showSucess("Fornulário cadastrado com sucesso!");
      }).catch((error) => this.handlerException(error));
    }
  }

  openDynamicFormQuestionDialog(dynamicFormId): void {

    const dialogRef = this.dialog.open(DynamicFormQuestionComponent, {
      width: '100%',
      height: 'auto',
      data: { dynamicFormId: dynamicFormId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });

  }

  openEditDynamicFormQuestionDialog(dynamicFormQuestion): void {

    const dialogRef = this.dialog.open(DynamicFormQuestionComponent, {
      width: '100%',
      height: 'auto',
      data: { dynamicFormQuestion: dynamicFormQuestion }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });

  }

  openDeleteAccommodationDialog(id) {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a exclusão da questão?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.principalService.deleteDynamicFormQuestion(id).then(resp => {
          this.ngOnInit();
          this.notification.showSucess("Questão excluída com sucesso!");
        }).catch((error) => this.handlerException(error));
      }
    });
  }

  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.dataToForm = new DynamicForm();
        this.dataToForm.questions = new Array<DynamicFormItem>();
      }
    });
  }
}
