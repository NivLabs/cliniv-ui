import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { AdminService } from './admin.service';
import { Page, Pageable } from 'app/model/Util';
import { UserFilters } from 'app/model/User';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public loading: boolean;
  public userNotFound: boolean;
  loadedUsers: []
  page: Page;
  pageSettings: Pageable;
  filters: UserFilters;

  constructor(private userService: AdminService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit(): void {
    this.pageSettings = new Pageable();
    this.loading = true;
    this.userService.getPage(this.filters, this.pageSettings).then(response => {
      this.loading = false;
      this.loadedUsers = response.content;
      this.page = response;
      this.userNotFound = this.loadedUsers.length === 0;
    }).catch(error => {
      this.userNotFound = this.page.content !== undefined ? this.page.content.length === 0 : true;
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
      this.userService.getPage(this.filters, this.pageSettings).then(response => {
        this.loading = false;
        response.content.forEach(newItem => {
          this.loadedUsers.push(newItem);
        })
        this.page = response;
      }).catch(error => {
        this.userNotFound = this.page.content !== undefined ? this.page.content.length === 0 : true;
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
  }
}
