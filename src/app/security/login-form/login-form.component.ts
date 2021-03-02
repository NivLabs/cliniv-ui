import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../auth.service';
import { SettingsService } from 'app/settings/settings.service';
import { SignupComponent } from './signup/signup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  hasResponse = true;
  user: any;

  constructor(
    private auth: AuthService,
    private settingsService: SettingsService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    public dialog: MatDialog
  ) {
    if (!this.auth.isInvalidAccessToken()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.auth.removeAccessToken();
      this.router.navigate(['/login'])
    }
  }

  /**
   * Realiza o login na aplicação
   * @param username Nome de usuário
   * @param password Senha do usuário
   */
  login(username: string, password: string) {
    this.hasResponse = false;
    this.auth.login(username, password)
      .then(() => {
        this.hasResponse = true;
        this.router.navigate(['/dashboard']);
      })
      .catch(erro => {
        this.hasResponse = true;
        this.errorHandler.handle(erro, null);
      });
  }


  /**
   * Abre a tela de cadastro de novos usuários
   */
  openNewUserDialog(): void {
    const dialogRef = this.dialog.open(SignupComponent, {
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}