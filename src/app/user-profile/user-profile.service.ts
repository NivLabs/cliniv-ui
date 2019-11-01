import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { AppHttp } from '../security/app-http';


export class Address {
  constructor() {}
  street: string = "";
  city: string = "";
  state: string = "";
  postalCode: string = "";
  addressComplement: string = "";
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
  phoneNumber: string;
  secondaryNumber: string;
  bornDate: Date;
  observations: string;
}

@Injectable()
export class UserProfileService {

  profileUrl: string;
  token: string;

  constructor(private http: AppHttp) {
    this.profileUrl = `${environment.apiUrl}/profile`;
    this.token = "Bearer " + localStorage.getItem('token');
  }

  getMe(): Promise<UserInfo> {
    var headers = new HttpHeaders()
        .append('Authorization', this.token);
    return this.http.get<UserInfo>(`${this.profileUrl}`, { headers })
      .toPromise();
  }
}