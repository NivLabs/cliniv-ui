import { Component, OnInit } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { VisitService, VisitInfo } from './visit.service';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {

  constructor(private visitService: VisitService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  visit: VisitInfo;
  public loading: boolean;

  ngOnInit() {
    this.visit = {
      patientId: null,
      id: null,
      document: { type: 'CPF', value: null },
      firstName: null,
      lastName: null,
      principalNumber: null,
      bornDate: null,
      gender: null,
      events: [],
      allergies: []
    }
  }

  searchVisitByPatientId() {
    if (this.visit.id) {
      this.visitService.getVisitsByPatientId(this.visit.patientId).then(result => {
        console.log(result);
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error);
      });
    }
  }
  searchVisitById() {
    this.loading = true
    if (this.visit.id) {
      this.visitService.getVisitById(this.visit.id).then(result => {
        this.loading = false
        this.visit = result;
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error);
      });
    }
  }
}
