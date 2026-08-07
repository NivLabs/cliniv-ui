import { Component, Inject, OnInit } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { TissBatchService } from '../../tiss-batch.service';
import { TissBatch, tissBatchStatuses } from 'app/model/TissBatch';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tiss-batch-edit',
  templateUrl: './tiss-batch-edit.component.html',
  styleUrls: ['./tiss-batch-edit.component.css']
})
export class TissBatchEditComponent implements OnInit {

  public loading = false;
  public dataToForm: TissBatch;
  public tissBatchStatuses = tissBatchStatuses;

  constructor(
    public principalService: TissBatchService,
    public dialogRef: MatDialogRef<TissBatchEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent
  ) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new TissBatch();
  }

  ngOnInit(): void {
    const selectedData = this.data ? this.data['selectedData'] : null;
    if (selectedData && selectedData.id) {
      this.dataToForm = { ...selectedData };
    }
  }

  save() {
    this.loading = true;
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.loading = false;
        this.notification.showSucess('Lote TISS alterado com sucesso!');
        this.dataToForm = resp;
      }).catch(error => this.handlerException(error));
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.notification.showSucess('Lote TISS cadastrado com sucesso!');
      }).catch(error => this.handlerException(error));
    }
  }

  delete() {
    if (confirm('Tem certeza que deseja deletar?')) {
      this.loading = true;
      this.principalService.delete(this.dataToForm.id).then(() => {
        this.loading = false;
        this.notification.showSucess('Lote TISS deletado com sucesso!');
        this.dialogRef.close();
      }).catch(error => this.handlerException(error));
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  private handlerException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialogRef);
  }
}
