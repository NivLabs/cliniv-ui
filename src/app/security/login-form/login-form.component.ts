import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  constructor(
    //private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) { }

  login(username: string, password: string) {
    /*this.auth.login(username, password)
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });*/
  }

}