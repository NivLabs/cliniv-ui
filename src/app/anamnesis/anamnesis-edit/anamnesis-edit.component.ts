import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { AnamnesisForm } from 'app/model/AnamnesisForm';
import { AnamnesisService } from 'app/visit/anamnesis/anamnesis.service';

@Component({
  selector: 'app-anamnesis-edit',
  templateUrl: './anamnesis-edit.component.html',
  styleUrls: ['./anamnesis-edit.component.css']
})
export class AnamnesisEditComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public loading = false;
  public dataToForm: AnamnesisForm;
  public dataSource: any;
  public displayedColumns: any;
  public anamnesisSelectedId: number = 0;


  constructor(public principalService: AnamnesisService,
    public confirmDialog: MatDialog,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AnamnesisEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AnamnesisForm,
    public formBuilder: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new AnamnesisForm();
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
        this.dataToForm = new AnamnesisForm();
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

}
