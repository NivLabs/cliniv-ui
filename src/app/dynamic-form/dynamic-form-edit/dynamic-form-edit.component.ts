import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { DynamicForm } from 'app/model/AnamnesisForm';
import { DynamicFormService } from 'app/visit/anamnesis/dynamic-form.service';

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
  public anamnesisSelectedId: number = 0;


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
    if (this.dialogRef.componentInstance.data['anamnesisSelectedId'] !== null || this.anamnesisSelectedId !== 0) {
      this.loading = true;
      this.anamnesisSelectedId = this.dialogRef.componentInstance.data['anamnesisSelectedId'];
      this.principalService.findById(this.anamnesisSelectedId).then(resp => {
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

  save() { }

  openQuetionEdit(formId, question) { }

  deleteQuestion(questionId) { }

  resetForm() { }
}
