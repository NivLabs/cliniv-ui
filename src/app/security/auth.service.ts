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

  login(unitName: string, username: string, password: string): Promise<void> {
    var headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    this.saveUnitName(unitName);
    const body = `{"username": "${username}", "password": "${password}"}`;
    return this.http.post<any>(this.resourceUrl, body,
      { headers, withCredentials: true, responseType: 'json', observe: 'response' })
      .toPromise()
      .then(response => {
        this.removeAccessToken();
        this.saveToken(response.headers.get('Authorization'));
        this.saveUnitName(unitName);
      })
      .catch(response => {
        let message = 'Usuário e/ou senha inválido(s)!'
        if (response.status === 401) {
          if(response.error && response.error.message) {
            message = response.error.message;
          }
          return Promise.reject(message);
        }
        return Promise.reject(response);
      });
  }

  getUnitName() {
    return localStorage.getItem('x-cutomer-id');
  }

  saveUnitName(unitName: any) {
    localStorage.setItem('x-cutomer-id', unitName);
  }

  removeAccessToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('x-cutomer-id')
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