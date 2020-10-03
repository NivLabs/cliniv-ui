import { Component, OnInit } from '@angular/core';
import { CloseAttendanceRequest } from 'app/model/Attendance';

@Component({
  selector: 'app-close-event',
  templateUrl: './close-event.component.html',
  styleUrls: ['./close-event.component.css']
})
export class CloseEventComponent implements OnInit {

  public dataToForm: CloseAttendanceRequest;

  constructor() { }

  ngOnInit(): void {
    this.dataToForm = new CloseAttendanceRequest();
  }

}
