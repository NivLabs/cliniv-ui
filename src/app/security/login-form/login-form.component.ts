import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../auth.service';
import { SettingsService } from 'app/settings/settings.service';
import { SignupComponent } from './signup/signup.component';
import { MatDialog } from '@angular/material/dialog';
import { UserInfo } from 'app/model/User';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  hasResponse = true;
  user: UserInfo;
  saveInfoFlag: boolean = false;

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
  ngOnInit(): void {
    this.user = new UserInfo();
    this.user.userName = localStorage.getItem('__saved_user');
    this.saveInfoFlag = localStorage.getItem('__saveInfo') == 'checked' ? true : false;
  }

  /**
   * Realiza o login na aplicação
   * @param userName Nome de usuário
   * @param password Senha do usuário
   */
  login() {
    this.hasResponse = false;
    this.updateSaveInfo();
    this.auth.login(this.user.userName, this.user.password)
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

  updateSaveInfo() {
    if (this.saveInfoFlag) {
      localStorage.setItem('__saveInfo', 'checked');
      localStorage.setItem("__saved_user", this.user.userName);
    } else {
      localStorage.removeItem("__saved_user");
      localStorage.removeItem('__saveInfo');
    }
  }

  checkSaveInfo() {
    this.saveInfoFlag = !this.saveInfoFlag;
  }
}