import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  test: Date = new Date();
  version: string = environment.appVersion;
  customer: string = environment.customerName ? environment.customerName : 'NivLabs';
  constructor() { }

  ngOnInit() {
  }

}
