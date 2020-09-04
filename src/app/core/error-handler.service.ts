import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { NotAuthenticatedError } from './../security/app-http';
import { NotificationsComponent } from './notification/notifications.component';
import { AuthService } from 'app/security/auth.service';

@Injectable()
export class ErrorHandlerService {

  constructor(
    private notification: NotificationsComponent,
    private router: Router,
    private auth: AuthService
  ) { }

  handle(errorResponse: any, dialogRefToClose: any) {
    let msg: string;

    if (typeof errorResponse === 'string') {
      msg = errorResponse;
      this.notification.showError(msg);
    } else if (errorResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou!';

      this.auth.removeAccessToken();
      this.router.navigate(['/login']);
      if (dialogRefToClose) {
        dialogRefToClose.close();
      }

    } else if (errorResponse instanceof HttpErrorResponse
      && errorResponse.status >= 400 && errorResponse.status <= 499) {

      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (errorResponse.error && errorResponse.error.message) {
        msg = errorResponse.error.message;
      }

      if (errorResponse.status === 403) {
        msg = 'Você não tem permissão para executar esta ação';
        if (dialogRefToClose) {
          dialogRefToClose.close();
        }
      }

      if (errorResponse.status === 405 && errorResponse.error && errorResponse.error.message) {
        msg = errorResponse.error.message;
      }
      if (errorResponse.status === 401) {
        msg = 'Sua sessão expirou!';
        this.auth.removeAccessToken();
        this.router.navigate(['/login']);
        if (dialogRefToClose) {
          dialogRefToClose.close();
        }
      }

      var hasShow = false;
      if (errorResponse.status === 400 && (errorResponse.error && !errorResponse.error.validations)) {
        this.notification.showError(errorResponse.error.message)
      }

      if (errorResponse.status === 422) {
        if (errorResponse.error)
          errorResponse.error.validations.forEach(validationError => {
            this.notification.showError(validationError.message);
            hasShow = true;
          });
        if (!hasShow) {
          this.notification.showError(errorResponse.error.message);
          hasShow = true;
        }
      }

      try {
        msg = errorResponse.error[0].mensagemUsuario;
      } catch (e) { }

      console.error('Ocorreu um erro', errorResponse);
      if (!hasShow) {
        this.notification.showError(msg);
      }
    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      if (errorResponse.message) {
        msg = errorResponse.message;
        if (msg.includes("Http failure response for ") || (errorResponse?.statusText == 'Unknown Error')) {
          msg = 'Erro ao processar serviço remoto, verifique sua rede e tente novamente.';
        }
      }
      console.error('Ocorreu um erro', errorResponse);
      this.notification.showError(msg);
    }

  }

}