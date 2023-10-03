import { Component, OnInit } from '@angular/core';
import { UtilService } from 'app/core/util.service';
import { NotificationsComponent } from '../core/notification/notifications.component';
import { Dashboard, DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loading: boolean = false;
  data: Dashboard = new Dashboard();
  logoName = 'cliniv';

  constructor(private dashboardService: DashboardService,
    private utilService: UtilService) { }

  showMessage(message) {
    let dialog = new NotificationsComponent;
    dialog.showSucess(message)
  }

  ngOnInit() {
    this.loading = true;
    this.logoName = this.utilService.getLogo();
    this.dashboardService.getDashboardInfo().then((resp) => {
      this.data = resp;
      this.loading = false;
    }).catch((err) => this.loading = false);

  }
}
