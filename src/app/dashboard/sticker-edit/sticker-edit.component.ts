import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { Sticker } from 'app/model/Sticker';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-sticker-edit',
  templateUrl: './sticker-edit.component.html',
  styleUrls: ['./sticker-edit.component.css']
})
export class StickerEditComponent implements OnInit {

  public dataToForm: Sticker;
  public loading: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private notification: NotificationsComponent,
    private errorHandler: ErrorHandlerService,
    public dialogRef: MatDialogRef<StickerEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Sticker,) { }

  ngOnInit(): void {
    if (this.dialogRef.componentInstance.data['selectedSticker']) {
      this.dataToForm = this.dialogRef.componentInstance.data['selectedSticker'];
    } else {
      this.dataToForm = new Sticker();
    }
  }

  createOrUpdate() {
    this.loading = true;
    if (this.dataToForm.id) {
      this.dashboardService.updateSticker(this.dataToForm).then(() => {
        this.loading = false;
        this.notification.showSucess("Lembrete atualizado com sucesso!");
        this.dialogRef.close();
      }).catch((err) => {
        this.loading = false;
        this.errorHandler.handle(err, null);
      });
    } else {
      this.dashboardService.createSticker(this.dataToForm).then(() => {
        this.loading = false;
        this.notification.showSucess("Lembrete criado com sucesso!");
        this.dialogRef.close();
      }).catch((err) => {
        this.loading = false;
        this.errorHandler.handle(err, null);
      });
    }
  }
}
