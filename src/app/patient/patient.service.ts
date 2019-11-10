import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { promise } from 'selenium-webdriver';

export class Pageable {
    pageNumber: number;
    pageSize: number;
    paged: boolean;
}
export class PatientPage {
    content: any;
    empty: boolean;
    first: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    totalElements: number;
    totalPages: number;
}

@Injectable()
export class PatientService {
    patientUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.patientUrl = `${environment.apiUrl}/patient`;
        this.token = "Bearer " + localStorage.getItem('token');
    }

    getPageOfPatients(filter): Promise<PatientPage> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);
        if (!filter) {
            return this.http.get<PatientPage>(this.patientUrl, { headers }).toPromise();
        }
    }
}