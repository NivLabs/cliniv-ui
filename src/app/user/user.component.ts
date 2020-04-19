import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UserService } from './user.service';
import { Page, Pageable } from 'app/model/Util';
import { UserFilters } from 'app/model/User';
import { UserEditComponent } from './user-edit/user-edit.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: []
  page: Page;
  pageSettings: Pageable;
  filters: UserFilters;

  constructor(public dialog: MatDialog, private principalService: UserService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit(): void {
    this.filters = new UserFilters();
    this.pageSettings = new Pageable();
    this.loading = true;
    this.principalService.getPage(this.filters, this.pageSettings).then(response => {
      this.loading = false;
      this.datas = response.content;
      this.page = response;
      this.dataNotFound = this.datas.length === 0;
    }).catch(error => {
      this.dataNotFound = this.datas ? this.datas.length === 0 : true;
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

  applyFilter() {
    if (this.filters) {
      this.loading = true;
      this.pageSettings = new Pageable();
      this.principalService.getPage(this.filters, this.pageSettings).then(response => {
        this.loading = false;
        this.datas = response.content;
        this.dataNotFound = this.datas.length === 0;
        console.log(this.dataNotFound);
      }).catch(error => {
        this.errorHandler.handle(error, null);
        this.dataNotFound = this.datas ? this.datas.length === 0 : true;
        this.loading = false;
      });
    }
  }

  /**
  * 
  * Executa um evento à partir da tecla enter
  * 
  * @param event Evento de tecla
  */
  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
    }
  }

  /**
   * 
   * @param id Identificador do usuário
   */
  openDialog(id) {
    const dialogRef = this.dialog.open(UserEditComponent, {
      width: '100%',
      height: '68%',
      data: { selectedId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}
