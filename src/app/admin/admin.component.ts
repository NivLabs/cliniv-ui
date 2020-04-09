import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { AdminService } from './admin.service';
import { Page } from 'app/model/Util';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public loading: boolean;
  public userNotFound: boolean;
  page: Page;

  constructor(private userService: AdminService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
    this.page = new Page();
    this.page.content = [];
  }

  ngOnInit(): void {
    this.loading = true;
    this.userService.getPage(null).then(response => {
      this.loading = false;
      this.page = response;
      this.userNotFound = this.page.content.length === 0;
    }).catch(error => {
      this.userNotFound = this.page.content !== undefined ? this.page.content.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }

  openDialog(id) {

  }
}
