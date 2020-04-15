import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { AdminService } from './admin.service';
import { Page, Pageable } from 'app/model/Util';
import { UserFilters } from 'app/model/User';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: []
  page: Page;
  pageSettings: Pageable;
  filters: UserFilters;

  constructor(public dialog: MatDialog, private principalService: AdminService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit(): void {
    this.pageSettings = new Pageable();
    this.loading = true;
    this.principalService.getPage(this.filters, this.pageSettings).then(response => {
      this.loading = false;
      this.datas = response.content;
      this.page = response;
      this.dataNotFound = this.datas.length === 0;
    }).catch(error => {
      this.dataNotFound = this.page.content !== undefined ? this.page.content.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }

  /**
   * Realiza a paginação dos componentes
   */
  loadNextPage() {
    if (this.page && !this.page.last) {
      this.loading = true;
      this.pageSettings.page = this.pageSettings.page + 1;
      this.principalService.getPage(this.filters, this.pageSettings).then(response => {
        this.loading = false;
        response.content.forEach(newItem => {
          this.datas.push(newItem);
        })
        this.page = response;
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, null);
      })
    }
  }

  /**
   * 
   * @param id Identificador do usuário
   */
  openDialog(id) {
    const dialogRef = this.dialog.open(AdminEditComponent, {
      width: '100%',
      height: '68%',
      data: { selectedId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

}
