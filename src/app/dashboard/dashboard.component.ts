import { Component, OnInit } from '@angular/core';

import { NotificationsComponent } from '../core/notification/notifications.component'
import { Dashboard, DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loading: boolean = false;
  data: Dashboard = new Dashboard();

  constructor(private dashboardService: DashboardService) { }

  showMessage(message) {
    let dialog = new NotificationsComponent;
    dialog.showSucess(message)
  }

  ngOnInit() {
    this.loading = true;
    this.dashboardService.getDashboardInfo().then((resp) => {
      this.data = resp;
      this.loading = false;
    });

  }
}
