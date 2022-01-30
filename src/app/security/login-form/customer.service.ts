import { Injectable } from '@angular/core';
import { Parameter } from 'app/model/Parameter';
import { HttpHeaders } from '@angular/common/http';
import { AppHttp } from 'app/security/app-http';
import { NewCustomerRequest } from 'app/model/NewCustomer';
import { environment } from 'environments/environment';

@Injectable()
export class CustomerService {

  baseUrl: string;
  private parameters: Array<Parameter> = [];

  constructor(private http: AppHttp) {
    this.baseUrl = `${environment.apiUrl}/customer`;
  }


  signup(request: NewCustomerRequest): Promise<any> {
    var headers = new HttpHeaders().append('Content-Type', "application/json");

    return this.http.post<NewCustomerRequest>(`${this.baseUrl}`, request, { headers }).toPromise();
  }

}
