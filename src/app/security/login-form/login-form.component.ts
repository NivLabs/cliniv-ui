import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../auth.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  hasResponse = true;

  constructor(
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}

  login(username: string, password: string) {
    this.hasResponse = false;
    this.auth.login(username, password)
      .then(() => {
        this.hasResponse = true;
        this.router.navigate(['/dashboard']);
      })
      .catch(erro => {
        this.hasResponse = true;
        this.errorHandler.handle(erro);
      });
  }

}