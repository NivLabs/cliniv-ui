import { Component, Inject, OnInit } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { TissGlosaService } from '../../tiss-glosa.service';
import { TissGlosa } from 'app/model/TissGlosa';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tiss-glosa-edit',
  templateUrl: './tiss-glosa-edit.component.html',
  styleUrls: ['./tiss-glosa-edit.component.css']
})
export class TissGlosaEditComponent implements OnInit {

  public loading = false;
  public dataToForm: TissGlosa;

  constructor(
    public principalService: TissGlosaService,
    public dialogRef: MatDialogRef<TissGlosaEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent
  ) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new TissGlosa();
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
        this.notification.showSucess('Glosa alterada com sucesso!');
        this.dataToForm = resp;
      }).catch(error => this.handlerException(error));
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.notification.showSucess('Glosa cadastrada com sucesso!');
      }).catch(error => this.handlerException(error));
    }
  }

  delete() {
    if (confirm('Tem certeza que deseja deletar?')) {
      this.loading = true;
      this.principalService.delete(this.dataToForm.id).then(() => {
        this.loading = false;
        this.notification.showSucess('Glosa deletada com sucesso!');
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
