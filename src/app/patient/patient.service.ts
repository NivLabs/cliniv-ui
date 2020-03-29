import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Patient, PatientInfo } from 'app/model/Patient';
import { Page } from 'app/model/Util';

@Injectable()
export class PatientService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/patient`;
    }

    getById(id): Promise<PatientInfo> {
        var headers = this.http.getHeadersDefault()
        if (id) {
            return this.http.get<PatientInfo>(`${this.baseUrl}/${id}`, { headers }).toPromise();
        }
    }

    getPageOfPatients(filter): Promise<Page> {
        var headers = this.http.getHeadersDefault()
        if (!filter) {
            return this.http.get<Page>(this.baseUrl, { headers }).toPromise();
        }
    }


    getByCpf(cpf: string): Promise<PatientInfo> {
        var headers = this.http.getHeadersDefault()
        if (cpf) {
            return this.http.get<PatientInfo>(`${this.baseUrl}/CPF/${cpf}`, { headers }).toPromise();
        }
    }

    create(patient: PatientInfo): Promise<PatientInfo> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (patient) {
            return this.http.post<PatientInfo>(`${this.baseUrl}`, patient, { headers }).toPromise();
        }
    }

    update(patient: PatientInfo): Promise<PatientInfo> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (patient) {
            return this.http.put<PatientInfo>(`${this.baseUrl}/${patient.id}`, patient, { headers }).toPromise();
        }
    }
}