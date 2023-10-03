import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewCustomerRequest } from 'app/model/NewCustomer';
import { environment } from 'environments/environment';
import { AppHttp } from '../app-http';

@Injectable()
export class CustomerService {

  baseUrl: string;

  constructor(private http: AppHttp) {
    this.baseUrl = `${environment.apiUrl}/customer`;
  }


  signup(request: NewCustomerRequest): Promise<any> {
    var headers = new HttpHeaders()
      .append('Content-Type', "application/json");

    if (request) {
      return this.http.post<NewCustomerRequest>(`${this.baseUrl}`, request, { headers }).toPromise();
    }
  }

}
