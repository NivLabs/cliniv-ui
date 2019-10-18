import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';


import { environment } from './../../environments/environment';
import { NotificationsComponent } from 'app/core/notification/notifications.component';

@Injectable()
export class AuthService {

  tokenUrl: string;
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private notification : NotificationsComponent = new NotificationsComponent
  ) {
    this.tokenUrl = `${environment.apiUrl}/login`;
    this.loadToken();
  }

  login(username: string, password: string): Promise<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

    const body = `{"username": "${username}", "password": "${password}"}`;

    return this.http.post<any>(this.tokenUrl, body,
        { headers })
      .toPromise()
      .then(response => {
        this.saveToken(response.headers['Authorization']);
      })
      .catch(response => {
        if (response.status === 401) {
            this.notification.showError("Usuário ou senha inválida!");
            return Promise.reject('Usuário ou senha inválida!');
        }
        return Promise.reject(response);
      });
  }

  removeAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  isInvalidAccessToken() {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }

  hasPermission(permission: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permission);
  }

  hasAnyPermission(roles) {
    for (const role of roles) {
      if (this.hasPermission(role)) {
        return true;
      }
    }

    return false;
  }

  private saveToken(token: string) {
    token = token.replace('Bearer ', '');
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private loadToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.saveToken(token);
    }
  }

}