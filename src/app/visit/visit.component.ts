import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {

  constructor() { }

  patient: any;

  ngOnInit() {
    this.patient = {
      id: 14124635,
      visitId: 73687168,
      document: { type: 'CPF', value: '08911768456' },
      firstName: 'Vinícios de Araújo',
      lastName: 'Rodrigues',
      principalNumber: '81 9 99509300',
      bornDate: '1991-11-07',
      gender: 'M'
    }
  }

  searchVisitByCpf() {

  }
}
