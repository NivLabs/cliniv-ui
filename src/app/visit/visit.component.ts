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
      id: 1,
      visitId: 73687168,
      document: { type: 'CPF', value: '08911768456' },
      firstName: 'Vinícios de Araújo',
      lastName: 'Rodrigues',
      principalNumber: '81 9 99509300',
      bornDate: '1991-11-07',
      gender: 'M'
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
