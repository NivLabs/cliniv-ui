import { Component, OnInit } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { VisitService } from './visit.service';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {

  constructor(private visitService: VisitService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  patient: any;
  public loading: boolean;

  ngOnInit() {
    this.patient = {
      id: null,
      visitId: null,
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
    if (this.patient.id) {
      this.visitService.getVisitsByPatientId(this.patient.id).then(result => {
        console.log(result);
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error);
      });
    }
  }
  searchVisitByCpf() {

  }
}
