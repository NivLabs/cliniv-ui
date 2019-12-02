import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';


export class InstituteInfo {
    cnpf: string = '';
    cnes: string = '';
    name: string = '';
    corporativeName: string = '';
    legalNature: string = '';
    street: string = '';
    addressNumber: string = '';
    complement: string = '';
    postalCode: string = '';
    state: string = '';
    neighborhood: string = '';
    city: string = '';
    phone: string = '';
    dependency: string = '';
    instituteType: string = '';
    managemente: string = '';
}

@Injectable()
export class InstituteService {

    instituteUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.instituteUrl = `${environment.apiUrl}/institute`;
        this.token = "Bearer " + localStorage.getItem('token');
    }

    getAbout(): Promise<InstituteInfo> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);
        return this.http.get<InstituteInfo>(`${this.instituteUrl}/about`, { headers }).toPromise();
    }

}