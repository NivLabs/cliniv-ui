import { Component, OnInit, ErrorHandler } from '@angular/core';
import { InstituteInfo, InstituteService } from './institute.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.css']
})
export class InstituteComponent implements OnInit {

  institute: InstituteInfo
  public loading: boolean;

  constructor(private instituteService: InstituteService, private notification: NotificationsComponent, private errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.institute = new InstituteInfo();
    this.loading = true;
    this.instituteService.getAbout().then(resp => {
      this.loading = false;
      this.institute = resp;
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error);
    });
  }
}
