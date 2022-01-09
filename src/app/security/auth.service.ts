import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';


import { environment } from './../../environments/environment';

@Injectable()
export class AuthService {

  resourceUrl: string;
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
  ) {
    this.resourceUrl = `${environment.apiUrl}/auth`;
    this.loadToken();
  }

  login(username: string, password: string): Promise<void> {
    var headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    const body = `{"username": "${username}", "password": "${password}"}`;
    return this.http.post<any>(this.resourceUrl, body,
      { headers, withCredentials: true, responseType: 'json', observe: 'response' })
      .toPromise()
      .then(response => {
        this.removeAccessToken();
        this.saveToken(response.headers.get('Authorization'));
      })
      .catch(response => {
        if (response.status === 401) {
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

  saveToken(token: string) {
    token = token.replace('Bearer ', '');
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  private loadToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.saveToken(token);
    }
  }

}