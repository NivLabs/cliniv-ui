import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-schedule',
  templateUrl: './public-schedule.component.html',
  styleUrls: ['./public-schedule.component.css']
})
export class PublicScheduleComponent implements OnInit {

  constructor() { }
  public professional: any = {
    fullName: 'Dr. Vinícios Rodrigues',
    title: 'Cirurgião Dentista',
    address: 'Av. Visconde de Suassuna, 555'
  };

  ngOnInit(): void {
  }

}
