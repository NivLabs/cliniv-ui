import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { UtilService } from 'app/core/util.service';
import { Sticker } from 'app/model/Sticker';
import { NotificationsComponent } from '../core/notification/notifications.component';
import { Dashboard, DashboardService } from './dashboard.service';
import { StickerEditComponent } from './sticker-edit/sticker-edit.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loading: boolean = false;
  data: Dashboard = new Dashboard();
  logoName = 'cliniv';

  constructor(
    private dashboardService: DashboardService,
    private utilService: UtilService,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent,
    private dialog: MatDialog) { }

  openDialog(sticker: Sticker): void {
    const dialogRef = this.dialog.open(StickerEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedSticker: sticker }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteSticker(id: number) {
    this.loading = true;
    this.dashboardService.deleteSticker(id).then(() => {
      this.loading = false;
      this.notification.showSucess("Lembrete excluído com sucesso!");
      this.ngOnInit();
    }).catch((err) => {
      this.loading = false;
      this.errorHandler.handle(err, null);
    });
  }

  ngOnInit() {
    this.loading = true;
    this.logoName = this.utilService.getLogo();
    this.dashboardService.getDashboardInfo().then((resp) => {
      this.data = resp;
      this.loading = false;
    }).catch((err) => {
      this.loading = false;
      this.errorHandler.handle(err, null);
    });

  }
}
