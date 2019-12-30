import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { AppHttp } from '../security/app-http';


export class Address {
  constructor() { }
  street: string = null;
  city: string = null;
  state: string = null;
  postalCode: string = null;
  addressNumber: string = null;
  complement: string = null;
  neighborhood: string = null;
}

export class Document {
  constructor(type) {
    this.type = type;
  }
  type: string; // CPF, CNPJ, PASSAPORTE, RNE
  value: string; // Valor do documento
}
export class UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  identity: string;
  dispatcher: string;
  document?: Document = new Document('CPF');
  address?: Address = new Address();
  principalNumber: string;
  secondaryNumber: string;
  bornDate: Date;
  observations: string;
  gender: string;
  email: string;
}

@Injectable()
export class UserProfileService {

  resourceUrl: string;
  token: string;

  constructor(private http: AppHttp) {
    this.resourceUrl = `${environment.apiUrl}/profile`;
    this.token = "Bearer " + localStorage.getItem('token');
  }

  getMe(): Promise<UserInfo> {
    var headers = new HttpHeaders()
      .append('Authorization', this.token);
    return this.http.get<UserInfo>(`${this.resourceUrl}`, { headers })
      .toPromise();
  }

  save(userInfo: UserInfo): Promise<UserInfo> {
    var validUserInfo = this.validAddress(userInfo);
    var headers = new HttpHeaders()
      .append('Authorization', this.token);
    return this.http.put<UserInfo>(`${this.resourceUrl}/${validUserInfo.id}`, validUserInfo, { headers })
      .toPromise();
  }

  validAddress(userInfo: UserInfo): UserInfo {
    var validUserInfo = new UserInfo();
    validUserInfo = JSON.parse(JSON.stringify(userInfo));
    return validUserInfo;
  }
}