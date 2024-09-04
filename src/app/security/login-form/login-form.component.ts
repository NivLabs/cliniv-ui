import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { UtilService } from 'app/core/util.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../auth.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignupComponent } from './signup/signup.component';

class LoginModel {
  unitName: string;
  userName: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  showUnitInput = true;
  logoName = 'cliniv';
  hasResponse = true;
  user: LoginModel;
  saveInfoFlag: boolean = false;

  constructor(
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    public dialog: MatDialog,
    private utilService: UtilService
  ) {
    if (!this.auth.isInvalidAccessToken()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.auth.removeAccessToken();
      this.router.navigate(['/login'])
    }
  }
  ngOnInit(): void {
    this.user = new LoginModel();
    if (this.utilService.getCustomerByHost() !== 'cliniv') {
      this.showUnitInput = false;
      localStorage.setItem('__saved_unit', this.utilService.getCustomerByHost());
      this.logoName = this.utilService.getCustomerByHost();
    }
    this.user.unitName = localStorage.getItem('__saved_unit');
    this.user.userName = localStorage.getItem('__saved_user');
    this.saveInfoFlag = localStorage.getItem('__saveInfo') == 'checked' ? true : false;
  }

  /**
   * Realiza o login na aplicação
   */
  login() {
    this.hasResponse = false;
    this.updateSaveInfo();
    this.auth.login(this.user.unitName, this.user.userName, this.user.password)
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

  /**
   * Abre a tela de resgate de senha
   */
  openForgotPasswordDialog(): void {
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      data: this.user.userName
    });
    dialogRef.afterClosed.arguments(result => {
    });
  }

  updateSaveInfo() {
    if (this.saveInfoFlag) {
      localStorage.setItem('__saved_unit', this.user.unitName);
      localStorage.setItem('__saveInfo', 'checked');
      localStorage.setItem("__saved_user", this.user.userName);
    } else {
      localStorage.removeItem('__saved_unit');
      localStorage.removeItem("__saved_user");
      localStorage.removeItem('__saveInfo');
    }
  }

  checkSaveInfo() {
    this.saveInfoFlag = !this.saveInfoFlag;
  }
}