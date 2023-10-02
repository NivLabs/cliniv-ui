import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/security/auth.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  test: Date = new Date();
  version: string = environment.appVersion;
  customer: string = 'NivLabs';
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.customer = this.authService.getUnitName();
  }

}
