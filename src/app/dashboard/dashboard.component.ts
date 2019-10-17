import { Component, OnInit } from '@angular/core';

import { NotificationsComponent } from '../core/notification/notifications.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }
  
  showMessage(message) {
    let dialog = new NotificationsComponent;
    dialog.showSucess(message)
  }
  
  ngOnInit() {
  }
}
